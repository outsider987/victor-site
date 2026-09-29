"""Run after npm run dev: python3 tools/check-motion.py (Playwright + Chrome)."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True, args=["--enable-gpu", "--use-angle=gl", "--ozone-platform=x11"])
    page = browser.new_page(viewport={"width": 1024, "height": 768})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://127.0.0.1:5173/?tier=low", wait_until="domcontentloaded")
    page.wait_for_function("window.__world?.state.intro === 'done'", timeout=120000)
    page.evaluate("""() => {
      window.house = __world.scene.getObjectByName('house_a');
      window.housePosition = house.position.clone();
    }""")
    page.wait_for_timeout(500)
    assert page.evaluate("house.position.equals(housePosition)"), "Static scenery must not jitter"
    assert page.evaluate("[...document.querySelectorAll('.tag')].slice(1).every(t => getComputedStyle(t).opacity === '0')"), "Hidden cards must be fully transparent"
    page.evaluate("""async () => {
      const THREE = await import('/node_modules/.vite/deps/three.js');
      const { Victor } = await import('/src/gl/victor.ts');
      const { Post } = await import('/src/gl/post.ts');
      const scene = new THREE.Scene();
      const actor = new Victor({ scene: new THREE.Group(), animations: [] }, scene);
      const pos = new THREE.Vector3(1, 0, 2);
      actor.update(false, pos, 0.5, 'idle', 1, false);
      if (!actor.root.position.equals(pos) || actor.root.rotation.y !== 0.5 || scene.children[1].position.x !== 1) {
        throw new Error('Travel and its contact shadow must update between pose ticks');
      }
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(32, 32);
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.z = 4;
      const material = new THREE.MeshStandardMaterial();
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(), material);
      const testScene = new THREE.Scene();
      testScene.add(mesh, new THREE.HemisphereLight());
      const post = new Post(renderer, testScene, camera, 'medium');
      post.render(1 / 60);
      const program = renderer.properties.get(material).currentProgram;
      post.setTier('low');
      post.render(1 / 60);
      if (renderer.properties.get(material).currentProgram !== program) {
        throw new Error('A quality downgrade must reuse the scene shader');
      }
      post.composer.dispose();
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    }""")
    assert not errors, errors
    browser.close()
    print("Motion, hidden cards and shader reuse checks passed")
