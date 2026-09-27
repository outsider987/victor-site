"""Capture the real Clinic Portal UI with local demo data, without a backend.

    python3 tools/capture/mediconcen.py [path/to/clinic-portal/frontend]

Uses the source app's installed dependencies and Python Playwright. The source
project stays untouched; its environment files are never copied into the preview.
"""
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import tempfile
import time
from urllib.parse import urlparse
from urllib.request import urlopen

from playwright.sync_api import sync_playwright

source = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / 'mediconcen/mcc-clinic-portal-v2/frontend'
source = source.resolve()
out = Path(__file__).resolve().parent / 'out'
out.mkdir(exist_ok=True)
base = 'http://127.0.0.1:4381'
records = [dict(transactionTime=f'2026-09-28T{14-i:02d}:00:00+08:00',
                doctorName='示範醫師', benefitType='門診', patientName=f'示範病患 {i+1:02d}',
                insurerName='示範保險', voucher=f'DEMO-{i+1:03d}', status='已完成', verifyType='card')
           for i in range(6)]

with tempfile.TemporaryDirectory(prefix='victor-clinic-') as directory:
    preview = Path(directory)
    for name in ('src', 'public'):
        shutil.copytree(source / name, preview / name)
    for name in ('package.json', 'next.config.js', 'tsconfig.json', 'next-env.d.ts'):
        shutil.copy2(source / name, preview / name)
    (preview / 'node_modules').symlink_to(source / 'node_modules', target_is_directory=True)
    node = shutil.which('node')
    assert node, 'Node is required to run the source app'
    env = dict(PATH=os.defpath, NEXT_TELEMETRY_DISABLED='1', IMAGE_DOMAINS='[]',
               NEXT_PUBLIC_API_BASE=base + '/api', NEXT_PUBLIC_S3_URL_PREFIX=base)
    with (out / 'mediconcen-preview.log').open('w') as log:
        server = subprocess.Popen([node, str(preview / 'node_modules/next/dist/bin/next'),
                                   'dev', '-H', '127.0.0.1', '-p', '4381'],
                                  cwd=preview, env=env, stdout=log, stderr=log, start_new_session=True)
        try:
            deadline = time.monotonic() + 60
            while True:
                try:
                    with urlopen(base + '/login', timeout=2):
                        break
                except OSError:
                    assert server.poll() is None, f'Preview exited: see {log.name}'
                    assert time.monotonic() < deadline, f'Preview did not start: see {log.name}'
                    time.sleep(1)

            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True, executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
                page = browser.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=2)
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))

                def route(request):
                    url = urlparse(request.request.url)
                    if url.netloc == 'widget.docsbot.ai' and url.path == '/chat.js':
                        # Leave the hosted chat widget out of the local capture.
                        return request.fulfill(content_type='text/javascript', body="window.DocsBotAI.mount=()=>Promise.resolve();const root=document.createElement('div');root.id='docsbotai-root';document.body.appendChild(root);")
                    if url.netloc != '127.0.0.1:4381':
                        return request.abort()
                    if not url.path.startswith('/api/'):
                        return request.continue_()
                    data = {'success': True, 'items': []}
                    if url.path == '/api/clinic/lite':
                        data['data'] = {'id': 'portfolio-demo', 'email': 'demo@example.invalid'}
                    elif url.path == '/api/records':
                        data['data'] = {'items': records, 'count': len(records)}
                    request.fulfill(content_type='application/json', body=json.dumps(data))

                page.route('**/*', route)
                page.add_init_script("localStorage.setItem('tokens', JSON.stringify({accessToken:'portfolio-demo',refreshToken:''})); localStorage.setItem('lang','cn');")
                for name, target in [('portal', '/'), ('records', '/records')]:
                    page.goto(base + target, wait_until='domcontentloaded', timeout=60000)
                    page.get_by_text('demo@example.invalid', exact=True).wait_for()
                    if name == 'records':
                        page.get_by_text('示範病患 01', exact=True).wait_for()
                    else:
                        page.locator('a[href="/verify"]').first.wait_for()
                    page.evaluate('document.fonts.ready')
                    page.wait_for_timeout(800)
                    page.screenshot(path=str(out / f'mediconcen-{name}-d.png'))
                    print('Captured Clinic Portal:', name, flush=True)
                assert not errors, errors
                browser.close()
        finally:
            os.killpg(server.pid, signal.SIGTERM)
            try:
                server.wait(timeout=10)
            except subprocess.TimeoutExpired:
                os.killpg(server.pid, signal.SIGKILL)
                server.wait()
