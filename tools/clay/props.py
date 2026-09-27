"""Clay props for every station, exported as props.glb (one top-level node per prop).

    blender --background --factory-startup --python props.py -- <out_dir> [--preview]

Each prop is built around the origin with its base on the ground, so the runtime can
place and pop it from its feet. Overlay anchors (screens, labels) are stored as node
extras in three.js axes: [x, y, z, width, height].
"""
import math
import os
import random
import sys

import bpy
import bmesh
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

OUT = lib.args()[0]
PREVIEW = '--preview' in lib.args()
lib.reset()
random.seed(7)

PAL = {
    'moss': '#7fae5a', 'leaf': '#5c9a48', 'leaf2': '#8cc063', 'pine': '#3f7f4a', 'trunk': '#7a5238',
    'wood': '#b9855e', 'wood_dark': '#7d543b', 'tomato': '#e8553a', 'butter': '#f6c85f', 'cream': '#efe4cf',
    'plum': '#5a3656', 'roof': '#8e3d3a', 'stone': '#9a918a', 'stone2': '#b7aea3', 'teal': '#2d7f86', 'navy': '#2b3558',
    'lilac': '#b9a6e8', 'black': '#1e1d22', 'white': '#f4efe4', 'gold': '#e0a02a', 'red': '#c9332b',
    'green': '#2fbf71', 'sand': '#e6c68d', 'pink': '#f19aa0', 'orange': '#e8903f', 'blue': '#3d6fd6',
    'gray': '#77727a', 'silver': '#c9ccd4', 'slate': '#4a5260', 'frame': '#efe4cf', 'water': '#4aa3c7',
    'roofgreen': '#2f6e55', 'corgi': '#e39a4d', 'pinkish': '#e7a3a0', 'robot': '#2d7f86',
}
C = {k: lib.material(f'clay_{k}', v, rough=0.64) for k, v in PAL.items()}
C['gold'] = lib.material('clay_gold', PAL['gold'], rough=0.32, metal=0.55)
C['silver'] = lib.material('clay_silver', PAL['silver'], rough=0.35, metal=0.4)
C['black'] = lib.material('clay_black', PAL['black'], rough=0.4)
C['water'] = lib.material('clay_water', PAL['water'], rough=0.15)
C['glow'] = lib.material('glow_warm', '#ffd06b', rough=0.4, emit='#ffc44a', emit_strength=4.0)
C['glow_red'] = lib.material('glow_red', '#ff6b5a', rough=0.4, emit='#ff4a3a', emit_strength=3.0)
C['glow_green'] = lib.material('glow_green', '#7dff9c', rough=0.4, emit='#4dff7a', emit_strength=3.0)

PROPS = []


def to3(x, y, z):
    """Blender (Z-up) point -> three.js (Y-up)."""
    return [round(x, 4), round(z, 4), round(-y, 4)]


def rb(name, size, loc=(0, 0, 0), mat='cream', bevel=0.28, sub=2, lump=0.006, rot=(0, 0, 0)):
    o = lib.prim('cube', name, loc=loc, rot=rot, size=1)
    o.scale = size
    lib.apply_transform(o)
    b = bevel * min(size)
    if b > 0:
        lib.modifier(o, 'BEVEL', width=b, segments=3)
    if sub:
        lib.modifier(o, 'SUBSURF', levels=sub)
    if lump:
        lib.lumps(o, strength=lump, size=0.15, seed=len(name))
    lib.shade_smooth(o)
    return lib.assign(o, C[mat])


def bl(name, radii, loc=(0, 0, 0), mat='leaf', lump=0.012, seg=32):
    o = lib.prim('sphere', name, loc=loc, segments=seg, ring_count=seg // 2, radius=1)
    o.scale = radii
    lib.apply_transform(o)
    if lump:
        lib.lumps(o, strength=lump, size=0.2, seed=len(name) * 3)
    lib.shade_smooth(o)
    return lib.assign(o, C[mat])


def cy(name, r, h, loc=(0, 0, 0), mat='wood', r2=None, verts=28, bevel=0.3, sub=1, lump=0.004, rot=(0, 0, 0)):
    if r2 is None:
        o = lib.prim('cyl', name, loc=loc, rot=rot, vertices=verts, radius=r, depth=h)
    else:
        o = lib.prim('cone', name, loc=loc, rot=rot, vertices=verts, radius1=r, radius2=r2, depth=h)
    lib.apply_transform(o)
    b = bevel * min(r, h / 2) * 0.6
    if b > 0:
        lib.modifier(o, 'BEVEL', width=b, segments=3, limit_method='ANGLE')
    if sub:
        lib.modifier(o, 'SUBSURF', levels=sub)
    if lump:
        lib.lumps(o, strength=lump, size=0.15, seed=len(name) * 5)
    lib.shade_smooth(o)
    return lib.assign(o, C[mat])


def cone(name, r, h, loc=(0, 0, 0), mat='pine', verts=24, lump=0.01, rot=(0, 0, 0)):
    o = lib.prim('cone', name, loc=loc, rot=rot, vertices=verts, radius1=r, radius2=0.0, depth=h)
    lib.apply_transform(o)
    lib.modifier(o, 'BEVEL', width=min(r, h) * 0.12, segments=3)
    lib.modifier(o, 'SUBSURF', levels=2)
    if lump:
        lib.lumps(o, strength=lump, size=0.2, seed=len(name) * 7)
    lib.shade_smooth(o)
    return lib.assign(o, C[mat])


def prism(name, width, height, length, loc=(0, 0, 0), mat='roof', bevel=0.12, curl=0.0):
    """Gable roof: triangle (width along Y, height up) extruded along X. curl lifts the eave ends."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    prof = [(-width / 2, 0), (width / 2, 0), (0, height)]
    n = 8
    rings = []
    for i in range(n + 1):
        x = -length / 2 + length * i / n
        lift = curl * (abs(x) / (length / 2)) ** 4
        rings.append([bm.verts.new((x, y, z + lift)) for y, z in prof])
    for i in range(n):
        a, b = rings[i], rings[i + 1]
        for j in range(3):
            bm.faces.new((a[j], a[(j + 1) % 3], b[(j + 1) % 3], b[j]))
    bm.faces.new(rings[0][::-1])
    bm.faces.new(rings[-1])
    bm.to_mesh(me)
    bm.free()
    o = lib.link(bpy.data.objects.new(name, me))
    o.location = loc
    lib.apply_transform(o)
    lib.modifier(o, 'BEVEL', width=min(width, height) * bevel, segments=3)
    lib.modifier(o, 'SUBSURF', levels=2)
    lib.lumps(o, strength=0.006, size=0.15, seed=len(name))
    lib.shade_smooth(o)
    return lib.assign(o, C[mat])


def fused(name, parts, mat, voxel=0.03, smooth=6, lump=0.015, ratio=0.5):
    o = lib.join(parts, name)
    lib.remesh_smooth(o, voxel=voxel, smooth_iter=smooth, factor=0.6)
    if lump:
        lib.lumps(o, strength=lump, size=0.25, seed=len(name) * 11)
    lib.decimate(o, ratio)
    lib.shade_smooth(o)
    return lib.assign(o, C[mat])


def extrude_shape(name, pts2d, depth, loc=(0, 0, 0), mat='butter', plane='XZ'):
    """Extrude a 2D polygon (in the XZ plane) along Y. Used for bolts and flat signs."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    front = [bm.verts.new((x, -depth / 2, z)) for x, z in pts2d]
    back = [bm.verts.new((x, depth / 2, z)) for x, z in pts2d]
    bm.faces.new(front)
    bm.faces.new(back[::-1])
    k = len(pts2d)
    for i in range(k):
        bm.faces.new((front[i], back[i], back[(i + 1) % k], front[(i + 1) % k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = lib.link(bpy.data.objects.new(name, me))
    o.location = loc
    lib.apply_transform(o)
    lib.modifier(o, 'BEVEL', width=depth * 0.35, segments=3)
    lib.modifier(o, 'SUBSURF', levels=1)
    lib.shade_smooth(o)
    return lib.assign(o, C[mat])


def prop(name, parts, anchors=None, max_tris=2800):
    o = lib.join(parts, name) if len(parts) > 1 else parts[0]
    o.name = name
    t = lib.tris(o)
    if t > max_tris:
        lib.decimate(o, max_tris / t)
    for k, v in (anchors or {}).items():
        o[k] = v
    PROPS.append(o)
    return o


# ------------------------------------------------------------ village kit
def house(name, body, roof_w, roof_h, wall, roofc, door_x=0.3, windows=((-0.35, 0.8),), chimney=True, round_window=False):
    W, D, H = body
    parts = [rb(f'{name}_body', (W, D, H), (0, 0, H / 2), wall, bevel=0.16)]
    parts.append(prism(f'{name}_roof', roof_w, roof_h, W + 0.3, (0, 0, H - 0.06), roofc))
    parts.append(rb(f'{name}_door', (0.36, 0.1, 0.62), (door_x, -D / 2, 0.31), 'wood_dark', bevel=0.3))
    parts.append(bl(f'{name}_knob', (0.03, 0.03, 0.03), (door_x + 0.1, -D / 2 - 0.06, 0.32), 'gold', lump=0))
    for i, (wx, wz) in enumerate(windows):
        if round_window:
            w = cy(f'{name}_win{i}', 0.17, 0.08, (wx, -D / 2, wz), 'glow', rot=(math.radians(90), 0, 0), bevel=0.2, lump=0)
        else:
            w = rb(f'{name}_win{i}', (0.32, 0.08, 0.32), (wx, -D / 2, wz), 'glow', bevel=0.25, lump=0)
        parts.append(w)
        parts.append(rb(f'{name}_sill{i}', (0.42, 0.14, 0.07), (wx, -D / 2 - 0.02, wz - 0.2), 'cream', bevel=0.3))
    if chimney:
        parts.append(rb(f'{name}_chim', (0.24, 0.24, 0.55), (W * 0.28, 0.15, H + roof_h * 0.55), 'stone', bevel=0.25))
    return prop(name, parts)


house('house_a', (1.5, 1.3, 1.3), 1.65, 0.95, 'tomato', 'roof')
house('house_b', (1.1, 1.1, 1.9), 1.4, 0.85, 'butter', 'plum', door_x=0.0, windows=((0.0, 1.35),), round_window=True, chimney=False)
house('house_c', (2.0, 1.3, 1.1), 1.65, 0.75, 'cream', 'teal', door_x=0.45, windows=((-0.5, 0.62), (0.0, 0.62)))


def tree_round(name, s=1.0, mat='leaf'):
    parts = [cy(f'{name}_trunk', 0.12 * s, 1.0 * s, (0, 0, 0.5 * s), 'trunk', r2=0.08 * s)]
    crown = [bl(f'{name}_c{i}', (r * s,) * 3, (x * s, y * s, z * s), mat, lump=0) for i, (r, x, y, z) in enumerate([(0.56, 0, 0, 1.35), (0.43, 0.36, 0.08, 1.2), (0.41, -0.32, -0.04, 1.24), (0.36, 0.06, 0.22, 1.72), (0.34, -0.1, -0.25, 1.62)])]
    parts.append(fused(f'{name}_crown', crown, mat, voxel=0.035 * s, lump=0.03 * s))
    return prop(name, parts)


tree_round('tree_round')
tree_round('tree_round_b', 0.82, 'leaf2')


def tree_pine(name, s=1.0):
    parts = [cy(f'{name}_trunk', 0.1 * s, 0.7 * s, (0, 0, 0.35 * s), 'trunk')]
    for i, (r, h, z) in enumerate([(0.72, 0.95, 1.0), (0.56, 0.8, 1.55), (0.4, 0.7, 2.05)]):
        parts.append(cone(f'{name}_l{i}', r * s, h * s, (0, 0, z * s), 'pine'))
    return prop(name, parts)


tree_pine('tree_pine')
prop('bush', [fused('bush_body', [bl(f'bush_{i}', (r,) * 3, (x, y, r * 0.8), 'leaf2', lump=0) for i, (r, x, y) in enumerate([(0.36, 0, 0), (0.28, 0.32, 0.05), (0.27, -0.3, 0.02), (0.22, 0.05, 0.25)])], 'leaf2', voxel=0.03)])
prop('rock_a', [bl('rock_a_b', (0.4, 0.32, 0.26), (0, 0, 0.18), 'stone', lump=0.05, seg=20)])
prop('rock_b', [bl('rock_b_b', (0.26, 0.3, 0.2), (0, 0, 0.13), 'stone2', lump=0.04, seg=20)])


def lamp_post(name):
    parts = [
        cy(f'{name}_base', 0.16, 0.16, (0, 0, 0.08), 'black'),
        cy(f'{name}_pole', 0.05, 2.25, (0, 0, 1.2), 'black', bevel=0.1),
        bl(f'{name}_glass', (0.17, 0.17, 0.2), (0, 0, 2.45), 'glow', lump=0),
        cone(f'{name}_cap', 0.26, 0.22, (0, 0, 2.66), 'black', lump=0),
        bl(f'{name}_top', (0.05, 0.05, 0.05), (0, 0, 2.8), 'black', lump=0),
    ]
    return prop(name, parts, {'light': to3(0, 0, 2.45)})


lamp_post('lamp_post')


def signpost(name):
    parts = [
        cy(f'{name}_post', 0.07, 1.7, (0, 0, 0.85), 'wood_dark'),
        rb(f'{name}_board', (1.9, 0.12, 0.6), (0, -0.04, 1.5), 'wood', bevel=0.3),
        cone(f'{name}_tip', 0.09, 0.14, (0, 0, 1.76), 'wood_dark', lump=0),
    ]
    return prop(name, parts, {'label': to3(0, -0.105, 1.5) + [1.7, 0.46]})


signpost('signpost')
prop('fence', [cy(f'fence_p{i}', 0.06, 0.8, (x, 0, 0.4), 'wood') for i, x in enumerate((-1.0, 0, 1.0))] + [rb(f'fence_r{i}', (2.3, 0.07, 0.1), (0, -0.02, z), 'wood', bevel=0.3) for i, z in enumerate((0.35, 0.62))])
prop('bench', [rb('bench_seat', (1.3, 0.45, 0.1), (0, 0, 0.45), 'wood', bevel=0.3), rb('bench_back', (1.3, 0.08, 0.35), (0, 0.2, 0.72), 'wood', bevel=0.3)] + [rb(f'bench_leg{i}', (0.08, 0.35, 0.42), (x, 0, 0.21), 'wood_dark', bevel=0.3) for i, x in enumerate((-0.5, 0.5))])
prop('grass', [cone(f'grass_{i}', 0.035, 0.28 + random.random() * 0.12, (math.cos(i * 1.3) * 0.08, math.sin(i * 1.3) * 0.08, 0.14), 'leaf2' if i % 2 else 'moss', verts=6, lump=0, rot=(random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3), 0)) for i in range(5)], max_tris=420)
prop('flower', [cy('flower_stem', 0.018, 0.4, (0, 0, 0.2), 'leaf', bevel=0, sub=0, lump=0)] + [bl(f'flower_p{i}', (0.06, 0.06, 0.035), (math.cos(i * 1.257) * 0.06, math.sin(i * 1.257) * 0.06, 0.42), 'pink', lump=0, seg=16) for i in range(5)] + [bl('flower_c', (0.04, 0.04, 0.03), (0, 0, 0.44), 'butter', lump=0, seg=16)], max_tris=1500)

# ------------------------------------------------------------ the big screen
SW, SH, SZ = 4.8, 3.0, 3.75


def screen_frame(name):
    t = 0.34
    parts = [
        rb(f'{name}_top', (SW + 2 * t + 0.1, 0.42, t), (0, 0, SZ + SH / 2 + t / 2), 'frame', bevel=0.35),
        rb(f'{name}_bot', (SW + 2 * t + 0.1, 0.42, t), (0, 0, SZ - SH / 2 - t / 2), 'frame', bevel=0.35),
        rb(f'{name}_l', (t, 0.42, SH + 0.05), (-(SW / 2 + t / 2), 0, SZ), 'frame', bevel=0.35),
        rb(f'{name}_r', (t, 0.42, SH + 0.05), ((SW / 2 + t / 2), 0, SZ), 'frame', bevel=0.35),
        rb(f'{name}_back', (SW + 0.3, 0.1, SH + 0.3), (0, 0.14, SZ), 'navy', bevel=0.2, lump=0.002),
    ]
    for i, x in enumerate((-SW / 2 + 0.35, SW / 2 - 0.35)):
        parts.append(rb(f'{name}_leg{i}', (0.3, 0.3, SZ - SH / 2 - 0.2), (x, 0.05, (SZ - SH / 2 - 0.2) / 2), 'wood_dark', bevel=0.3))
        parts.append(bl(f'{name}_foot{i}', (0.32, 0.4, 0.14), (x, 0.05, 0.07), 'wood_dark', lump=0.01))
    return prop(name, parts, {'screen': to3(0, -0.215, SZ) + [SW, SH]}, max_tris=8000)


screen_frame('screen_frame')


def phone_stand(name):
    parts = [
        rb(f'{name}_body', (0.74, 0.14, 1.42), (0, 0, 1.28), 'black', bevel=0.22),
        rb(f'{name}_rest', (0.9, 0.3, 0.12), (0, -0.05, 0.52), 'wood', bevel=0.3),
        cy(f'{name}_leg_a', 0.04, 1.2, (-0.3, 0.2, 0.55), 'wood', rot=(math.radians(-14), 0, 0), bevel=0, sub=0),
        cy(f'{name}_leg_b', 0.04, 1.2, (0.3, 0.2, 0.55), 'wood', rot=(math.radians(-14), 0, 0), bevel=0, sub=0),
        cy(f'{name}_leg_c', 0.04, 1.3, (0, 0.45, 0.6), 'wood', rot=(math.radians(22), 0, 0), bevel=0, sub=0),
    ]
    return prop(name, parts, {'screen': to3(0, -0.075, 1.28) + [0.62, 1.26]})


phone_stand('phone_stand')

# ------------------------------------------------------------ work stations
prop('scoreboard', [
    rb('sb_board', (2.3, 0.28, 1.15), (0, 0, 2.15), 'black', bevel=0.18),
    rb('sb_trim', (2.46, 0.2, 0.16), (0, 0, 2.8), 'tomato', bevel=0.35),
    rb('sb_leg_a', (0.18, 0.18, 1.6), (-0.8, 0.05, 0.8), 'slate', bevel=0.3),
    rb('sb_leg_b', (0.18, 0.18, 1.6), (0.8, 0.05, 0.8), 'slate', bevel=0.3),
    bl('sb_lamp_a', (0.08, 0.08, 0.08), (-0.95, -0.15, 2.62), 'glow_green', lump=0),
    bl('sb_lamp_b', (0.08, 0.08, 0.08), (0.95, -0.15, 2.62), 'glow_red', lump=0),
], {'panel': to3(0, -0.145, 2.12) + [2.05, 0.95]})
prop('trophy', [cy('tr_base', 0.22, 0.16, (0, 0, 0.08), 'wood_dark'), cy('tr_stem', 0.06, 0.3, (0, 0, 0.3), 'gold', lump=0), cy('tr_cup', 0.24, 0.36, (0, 0, 0.62), 'gold', r2=0.12, lump=0, rot=(math.pi, 0, 0))] + [bl(f'tr_h{i}', (0.05, 0.05, 0.12), (x, 0, 0.64), 'gold', lump=0) for i, x in enumerate((-0.27, 0.27))])
prop('gamepad', [
    rb('gp_body', (0.62, 0.3, 0.17), (0, 0, 0.13), 'black', bevel=0.45),
    bl('gp_l', (0.12, 0.17, 0.1), (-0.23, 0.15, 0.09), 'black', lump=0),
    bl('gp_r', (0.12, 0.17, 0.1), (0.23, 0.15, 0.09), 'black', lump=0),
    rb('gp_dpad_a', (0.12, 0.04, 0.035), (-0.17, -0.02, 0.225), 'slate', bevel=0.3, lump=0),
    rb('gp_dpad_b', (0.04, 0.12, 0.035), (-0.17, -0.02, 0.225), 'slate', bevel=0.3, lump=0),
] + [bl(f'gp_b{i}', (0.032, 0.032, 0.022), (0.17 + dx, -0.02 + dy, 0.225), m, lump=0, seg=12) for i, (dx, dy, m) in enumerate([(0.05, 0, 'green'), (-0.05, 0, 'tomato'), (0, 0.05, 'butter'), (0, -0.05, 'blue')])])

prop('clinic', [
    rb('cl_body', (1.9, 1.4, 1.5), (0, 0, 0.75), 'white', bevel=0.14),
    rb('cl_roof', (2.15, 1.65, 0.26), (0, 0, 1.6), 'teal', bevel=0.35),
    rb('cl_door', (0.5, 0.1, 0.85), (-0.45, -0.7, 0.43), 'teal', bevel=0.25),
    rb('cl_win', (0.6, 0.08, 0.45), (0.45, -0.7, 0.9), 'glow', bevel=0.25, lump=0),
    cy('cl_pole', 0.05, 0.5, (0, -0.35, 1.95), 'gray', bevel=0, sub=0),
    rb('cl_sign', (0.7, 0.12, 0.7), (0, -0.35, 2.45), 'white', bevel=0.3),
    rb('cl_cross_a', (0.44, 0.1, 0.14), (0, -0.42, 2.45), 'red', bevel=0.3),
    rb('cl_cross_b', (0.14, 0.1, 0.44), (0, -0.42, 2.45), 'red', bevel=0.3),
])
prop('clipboard', [rb('cb_board', (0.52, 0.05, 0.72), (0, 0, 0.36), 'wood', bevel=0.2), rb('cb_paper', (0.44, 0.02, 0.56), (0, -0.03, 0.33), 'white', bevel=0.1, lump=0), rb('cb_clip', (0.22, 0.05, 0.08), (0, -0.04, 0.68), 'silver', bevel=0.3)], {'paper': to3(0, -0.045, 0.33) + [0.4, 0.52]})
prop('pill_bottle', [cy('pb_body', 0.14, 0.34, (0, 0, 0.17), 'orange'), cy('pb_cap', 0.15, 0.1, (0, 0, 0.39), 'white')])

stripes = []
for i in range(7):
    stripes.append(rb(f'shop_st{i}', (0.38, 1.05, 0.08), (-1.14 + i * 0.38, -0.2, 2.35), 'green' if i % 2 == 0 else 'white', bevel=0.3, rot=(math.radians(-16), 0, 0), lump=0.003))
prop('shop', [
    rb('shop_counter', (2.5, 0.9, 1.0), (0, 0, 0.5), 'cream', bevel=0.16),
    rb('shop_top', (2.65, 1.0, 0.12), (0, 0, 1.05), 'wood', bevel=0.3),
    rb('shop_post_a', (0.12, 0.12, 2.3), (-1.2, 0.35, 1.15), 'wood_dark', bevel=0.3),
    rb('shop_post_b', (0.12, 0.12, 2.3), (1.2, 0.35, 1.15), 'wood_dark', bevel=0.3),
    rb('shop_sign', (1.6, 0.12, 0.42), (0, 0.3, 2.72), 'green', bevel=0.3),
] + stripes, {'label': to3(0, 0.235, 2.72) + [1.45, 0.34]}, max_tris=7000)
prop('camera', [rb('cam_body', (0.5, 0.3, 0.34), (0, 0, 0.17), 'black', bevel=0.25), cy('cam_lens', 0.12, 0.2, (0, -0.22, 0.17), 'slate', rot=(math.radians(90), 0, 0)), cy('cam_glass', 0.08, 0.04, (0, -0.33, 0.17), 'blue', rot=(math.radians(90), 0, 0), lump=0), rb('cam_top', (0.18, 0.16, 0.1), (-0.12, 0, 0.36), 'black', bevel=0.3)])
prop('phone', [rb('ph_body', (0.3, 0.05, 0.6), (0, 0, 0.3), 'black', bevel=0.3), rb('ph_screen', (0.25, 0.02, 0.5), (0, -0.025, 0.31), 'teal', bevel=0.2, lump=0)])
prop('laptop', [rb('lt_base', (0.84, 0.56, 0.05), (0, 0, 0.025), 'silver', bevel=0.3), rb('lt_lid', (0.84, 0.04, 0.54), (0, 0.3, 0.3), 'silver', bevel=0.3, rot=(math.radians(-12), 0, 0)), rb('lt_scr', (0.76, 0.02, 0.46), (0, 0.27, 0.3), 'navy', bevel=0.2, rot=(math.radians(-12), 0, 0), lump=0)])
prop('bubble', [fused('bb_body', [bl('bb_a', (0.38, 0.14, 0.28), (0, 0, 0.5), 'green', lump=0), cone('bb_tail', 0.1, 0.24, (-0.2, 0, 0.2), 'green', lump=0, rot=(0, math.radians(160), 0))], 'green', voxel=0.02, lump=0.006)] + [bl(f'bb_dot{i}', (0.04, 0.03, 0.04), (x, -0.13, 0.5), 'white', lump=0, seg=12) for i, x in enumerate((-0.12, 0, 0.12))])

def paifang(name):
    parts = [rb(f'{name}_base', (4.7, 1.05, 0.18), (0, 0, 0.09), 'stone2', bevel=0.3)]
    for i, (x, h) in enumerate([(-1.95, 2.25), (-0.78, 2.85), (0.78, 2.85), (1.95, 2.25)]):
        parts.append(cy(f'{name}_col{i}', 0.14, h, (x, 0, 0.18 + h / 2), 'red', verts=20))
        parts.append(cy(f'{name}_cb{i}', 0.22, 0.22, (x, 0, 0.29), 'stone'))
    parts += [
        rb(f'{name}_beam_c', (1.95, 0.3, 0.26), (0, 0, 2.58), 'red', bevel=0.3),
        rb(f'{name}_beam_c2', (1.72, 0.22, 0.16), (0, 0, 2.2), 'red', bevel=0.3),
        rb(f'{name}_plaque', (0.95, 0.12, 0.38), (0, -0.19, 2.39), 'gold', bevel=0.3),
    ]
    for s_ in (-1, 1):
        parts.append(rb(f'{name}_beam_s{s_}', (1.3, 0.26, 0.22), (1.36 * s_, 0, 1.98), 'red', bevel=0.3))
        parts.append(prism(f'{name}_roof_s{s_}', 1.0, 0.42, 1.55, (1.38 * s_, 0, 2.12), 'orange', curl=0.3))
        parts.append(rb(f'{name}_ridge_s{s_}', (1.3, 0.1, 0.09), (1.38 * s_, 0, 2.56), 'orange', bevel=0.35))
    for i, x in enumerate((-0.62, -0.21, 0.21, 0.62)):
        parts.append(rb(f'{name}_bracket{i}', (0.16, 0.36, 0.15), (x, 0, 2.78), 'teal', bevel=0.3, lump=0.002))
    parts.append(prism(f'{name}_roof_c', 1.3, 0.55, 2.75, (0, 0, 2.86), 'orange', curl=0.4))
    parts.append(rb(f'{name}_ridge_c', (2.25, 0.14, 0.12), (0, 0, 3.43), 'orange', bevel=0.35))
    for s_ in (-1, 1):
        parts.append(cone(f'{name}_tail{s_}', 0.085, 0.55, (1.18 * s_, 0, 3.58), 'orange', lump=0, rot=(0, math.radians(-48 * s_), 0)))
    parts.append(bl(f'{name}_pearl', (0.12, 0.12, 0.12), (0, 0, 3.58), 'gold', lump=0))
    return prop(name, parts, {'plaque': to3(0, -0.255, 2.39) + [0.84, 0.3]}, max_tris=9000)


paifang('gate')
prop('lantern', [bl('ln_body', (0.3, 0.3, 0.36), (0, 0, -0.45), 'red', lump=0.004), cy('ln_top', 0.14, 0.08, (0, 0, -0.07), 'gold', lump=0), cy('ln_bot', 0.12, 0.08, (0, 0, -0.83), 'gold', lump=0), cone('ln_tassel', 0.06, 0.26, (0, 0, -1.0), 'gold', lump=0, rot=(math.pi, 0, 0)), cy('ln_cord', 0.012, 0.1, (0, 0, 0.0), 'black', bevel=0, sub=0, lump=0)], {'light': to3(0, 0, -0.45)})

prop('pyramid', [cone('py_body', 1.45, 1.7, (0, 0, 0.85), 'sand', verts=4, lump=0.02, rot=(0, 0, math.radians(45)))])
prop('dune', [bl('dune_b', (1.2, 0.8, 0.35), (0, 0, 0.05), 'sand', lump=0.03)])
scarab = [bl('sc_body', (0.2, 0.26, 0.12), (0, 0, 0.12), 'gold', lump=0), bl('sc_head', (0.1, 0.08, 0.07), (0, -0.28, 0.11), 'gold', lump=0)]
for i, (x, y) in enumerate([(-0.2, -0.12), (0.2, -0.12), (-0.23, 0.02), (0.23, 0.02), (-0.2, 0.15), (0.2, 0.15)]):
    scarab.append(cy(f'sc_leg{i}', 0.018, 0.16, (x, y, 0.06), 'gold', rot=(0, math.radians(60 if x > 0 else -60), 0), bevel=0, sub=0, lump=0))
scarab.append(bl('sc_gem', (0.06, 0.04, 0.06), (0, -0.06, 0.22), 'red', lump=0, seg=16))
prop('scarab', scarab)
prop('slot_machine', [
    rb('sm_cab', (1.15, 0.85, 1.7), (0, 0, 0.85), 'red', bevel=0.12),
    cy('sm_arch', 0.575, 0.85, (0, 0, 1.7), 'gold', rot=(math.radians(90), 0, 0), lump=0.003),
    rb('sm_ledge', (1.25, 0.5, 0.1), (0, -0.4, 0.95), 'gold', bevel=0.3),
    cy('sm_lever', 0.035, 0.6, (0.7, 0, 1.3), 'silver', bevel=0, sub=0),
    bl('sm_ball', (0.09, 0.09, 0.09), (0.7, 0, 1.62), 'tomato', lump=0),
], {'screen': to3(0, -0.435, 1.35) + [0.9, 0.62]})

corgi = [
    fused('cg_body', [bl('cg_b', (0.24, 0.42, 0.22), (0, 0.05, 0.36), 'corgi', lump=0), bl('cg_chest', (0.2, 0.2, 0.2), (0, -0.3, 0.42), 'corgi', lump=0)], 'corgi', voxel=0.02, lump=0.005),
    bl('cg_belly', (0.17, 0.3, 0.12), (0, -0.05, 0.25), 'white', lump=0),
    bl('cg_bib', (0.15, 0.1, 0.16), (0, -0.44, 0.42), 'white', lump=0),
    bl('cg_head', (0.2, 0.19, 0.18), (0, -0.52, 0.66), 'corgi', lump=0),
    bl('cg_snout', (0.1, 0.12, 0.08), (0, -0.7, 0.6), 'white', lump=0),
    bl('cg_nose', (0.04, 0.03, 0.03), (0, -0.82, 0.63), 'black', lump=0, seg=12),
    cone('cg_ear_l', 0.08, 0.2, (-0.12, -0.5, 0.86), 'corgi', lump=0, rot=(0, math.radians(-14), 0)),
    cone('cg_ear_r', 0.08, 0.2, (0.12, -0.5, 0.86), 'corgi', lump=0, rot=(0, math.radians(14), 0)),
    bl('cg_eye_l', (0.028, 0.02, 0.03), (-0.08, -0.68, 0.7), 'black', lump=0, seg=12),
    bl('cg_eye_r', (0.028, 0.02, 0.03), (0.08, -0.68, 0.7), 'black', lump=0, seg=12),
    bl('cg_tail', (0.07, 0.07, 0.07), (0, 0.47, 0.44), 'white', lump=0),
    bl('cg_tongue', (0.03, 0.02, 0.03), (0, -0.78, 0.54), 'pinkish', lump=0, seg=12),
]
for i, (x, y) in enumerate([(-0.13, -0.3), (0.13, -0.3), (-0.13, 0.3), (0.13, 0.3)]):
    corgi.append(cy(f'cg_leg{i}', 0.065, 0.2, (x, y, 0.1), 'corgi', lump=0))
    corgi.append(bl(f'cg_paw{i}', (0.07, 0.08, 0.04), (x, y - 0.02, 0.02), 'white', lump=0, seg=16))
prop('corgi', corgi)
pegs = [bl(f'pl_peg{i}_{j}', (0.03, 0.03, 0.03), (-0.45 + j * 0.15 + (0.075 if i % 2 else 0), -0.08, 0.55 + i * 0.16), 'white', lump=0, seg=10) for i in range(6) for j in range(6 if i % 2 else 7)]
prop('plinko', [rb('pl_board', (1.2, 0.1, 1.5), (0, 0, 1.0), 'navy', bevel=0.12), rb('pl_leg_a', (0.1, 0.3, 0.3), (-0.5, 0, 0.15), 'wood_dark', bevel=0.3), rb('pl_leg_b', (0.1, 0.3, 0.3), (0.5, 0, 0.15), 'wood_dark', bevel=0.3), bl('pl_ball', (0.06, 0.06, 0.06), (0.1, -0.1, 1.55), 'butter', lump=0)] + [rb(f'pl_slot{i}', (0.13, 0.08, 0.18), (-0.45 + i * 0.15, -0.07, 0.35), ['tomato', 'butter', 'green', 'butter', 'tomato', 'lilac', 'green'][i], bevel=0.25, lump=0) for i in range(7)] + pegs, max_tris=7000)
dice = [rb('dc_cube', (0.36, 0.36, 0.36), (0, 0, 0.18), 'white', bevel=0.3)]
for i, (x, z) in enumerate([(-0.08, 0.26), (0.08, 0.1), (0.0, 0.18)]):
    dice.append(bl(f'dc_pip{i}', (0.028, 0.012, 0.028), (x, -0.182, z), 'black', lump=0, seg=10))
prop('dice', dice)

beams = [rb(f'th_beam{i}', (0.08, 0.06, 1.5), (x, -0.71, 0.8), 'wood_dark', bevel=0.3, lump=0.003) for i, x in enumerate((-0.7, 0.0, 0.7))]
beams += [rb('th_cross_a', (1.5, 0.06, 0.08), (0, -0.71, 1.0), 'wood_dark', bevel=0.3, lump=0.003), rb('th_cross_b', (0.08, 0.06, 1.0), (-0.35, -0.72, 0.55), 'wood_dark', bevel=0.3, rot=(0, math.radians(40), 0), lump=0.003)]
prop('timber_house', [rb('th_body', (1.6, 1.4, 1.6), (0, 0, 0.8), 'cream', bevel=0.12), prism('th_roof', 1.75, 1.0, 1.9, (0, 0, 1.56), 'slate'), rb('th_win', (0.34, 0.08, 0.34), (0.35, -0.7, 1.25), 'glow', bevel=0.25, lump=0)] + beams)
prop('fountain', [cy('ft_basin', 0.9, 0.42, (0, 0, 0.21), 'stone', verts=36), cy('ft_water', 0.78, 0.05, (0, 0, 0.4), 'water', verts=36, lump=0, bevel=0, sub=0), cy('ft_pillar', 0.12, 0.7, (0, 0, 0.6), 'stone2'), cy('ft_bowl', 0.34, 0.14, (0, 0, 0.98), 'stone', r2=0.2, rot=(math.pi, 0, 0)), cy('ft_water2', 0.28, 0.04, (0, 0, 1.03), 'water', lump=0, bevel=0, sub=0)])
prop('sword_stone', [bl('ss_rock', (0.5, 0.42, 0.34), (0, 0, 0.2), 'stone', lump=0.05), rb('ss_blade', (0.08, 0.03, 0.8), (0, 0, 0.8), 'silver', bevel=0.3, lump=0), rb('ss_guard', (0.36, 0.08, 0.07), (0, 0, 1.22), 'gold', bevel=0.35, lump=0), cy('ss_grip', 0.035, 0.26, (0, 0, 1.38), 'wood_dark', bevel=0, lump=0), bl('ss_pommel', (0.06, 0.06, 0.06), (0, 0, 1.53), 'gold', lump=0)])

# ------------------------------------------------------------ skills workbench
prop('workbench', [rb('wb_top', (2.6, 1.05, 0.16), (0, 0, 0.98), 'wood', bevel=0.3)] + [rb(f'wb_leg{i}', (0.14, 0.14, 0.92), (x, y, 0.46), 'wood_dark', bevel=0.3) for i, (x, y) in enumerate([(-1.15, -0.4), (1.15, -0.4), (-1.15, 0.4), (1.15, 0.4)])] + [rb('wb_shelf', (2.35, 0.9, 0.08), (0, 0, 0.3), 'wood_dark', bevel=0.3), rb('wb_vise', (0.26, 0.3, 0.22), (1.1, -0.5, 1.14), 'teal', bevel=0.3)])
prop('toolbox', [rb('tb_box', (0.72, 0.36, 0.34), (0, 0, 0.17), 'tomato', bevel=0.2), rb('tb_lid', (0.76, 0.38, 0.08), (0, 0, 0.37), 'red', bevel=0.3), cy('tb_handle', 0.025, 0.36, (0, 0, 0.48), 'black', rot=(0, math.radians(90), 0), bevel=0, sub=0)])
bolt_pts = [(-0.1, 0.9), (0.18, 0.9), (0.02, 0.5), (0.22, 0.5), (-0.12, 0.0), (0.0, 0.38), (-0.2, 0.38)]
prop('bolt', [extrude_shape('bolt_body', bolt_pts, 0.12, (0, 0, 0.0), 'butter')])
prop('monitor_icon', [rb('mi_screen', (0.8, 0.08, 0.52), (0, 0, 0.62), 'black', bevel=0.2), rb('mi_face', (0.7, 0.02, 0.42), (0, -0.045, 0.62), 'teal', bevel=0.2, lump=0), cy('mi_neck', 0.04, 0.3, (0, 0.02, 0.2), 'slate', bevel=0), rb('mi_foot', (0.4, 0.22, 0.05), (0, 0.02, 0.03), 'slate', bevel=0.3)])
prop('database', [cy(f'db_{i}', 0.3, 0.2, (0, 0, 0.12 + i * 0.24), 'navy' if i % 2 == 0 else 'teal', verts=32) for i in range(3)] + [bl(f'db_led{i}', (0.025, 0.02, 0.025), (0.2, -0.22, 0.12 + i * 0.24), 'glow_green', lump=0, seg=10) for i in range(3)])
prop('cloud_icon', [fused('ci_body', [bl(f'ci_{i}', (r,) * 3, (x, 0, z), 'white', lump=0) for i, (r, x, z) in enumerate([(0.28, 0, 0.35), (0.2, 0.28, 0.25), (0.2, -0.28, 0.25), (0.18, 0.12, 0.52)])], 'white', voxel=0.02, lump=0.005)])
prop('robot_head', [rb('rh_head', (0.5, 0.42, 0.42), (0, 0, 0.25), 'silver', bevel=0.3), rb('rh_visor', (0.4, 0.06, 0.16), (0, -0.21, 0.28), 'black', bevel=0.35, lump=0), bl('rh_eye_l', (0.04, 0.02, 0.04), (-0.09, -0.245, 0.28), 'glow', lump=0, seg=10), bl('rh_eye_r', (0.04, 0.02, 0.04), (0.09, -0.245, 0.28), 'glow', lump=0, seg=10), cy('rh_ant', 0.015, 0.2, (0, 0, 0.56), 'black', bevel=0, sub=0), bl('rh_ball', (0.045, 0.045, 0.045), (0, 0, 0.68), 'tomato', lump=0, seg=12)])

# ------------------------------------------------------------ AI crew set
def robot(name, body='robot'):
    parts = [
        fused(f'{name}_body', [bl(f'{name}_t', (0.26, 0.22, 0.3), (0, 0, 0.62), body, lump=0), bl(f'{name}_hip', (0.22, 0.2, 0.14), (0, 0, 0.36), body, lump=0)], body, voxel=0.02, lump=0.004),
        rb(f'{name}_head', (0.46, 0.4, 0.36), (0, 0, 1.12), 'cream', bevel=0.35),
        rb(f'{name}_visor', (0.36, 0.06, 0.14), (0, -0.2, 1.14), 'black', bevel=0.35, lump=0),
        bl(f'{name}_eye_l', (0.035, 0.02, 0.035), (-0.08, -0.235, 1.14), 'glow', lump=0, seg=10),
        bl(f'{name}_eye_r', (0.035, 0.02, 0.035), (0.08, -0.235, 1.14), 'glow', lump=0, seg=10),
        cy(f'{name}_ant', 0.014, 0.18, (0, 0, 1.38), 'black', bevel=0, sub=0),
        bl(f'{name}_antball', (0.04, 0.04, 0.04), (0, 0, 1.49), 'tomato', lump=0, seg=12),
        cy(f'{name}_leg_l', 0.06, 0.3, (-0.1, 0, 0.15), 'slate'),
        cy(f'{name}_leg_r', 0.06, 0.3, (0.1, 0, 0.15), 'slate'),
        cy(f'{name}_arm_l', 0.045, 0.5, (-0.3, -0.12, 0.95), 'slate', rot=(math.radians(-30), math.radians(-15), 0)),
        cy(f'{name}_arm_r', 0.045, 0.5, (0.3, -0.12, 0.95), 'slate', rot=(math.radians(-30), math.radians(15), 0)),
        rb(f'{name}_sign', (0.9, 0.05, 0.56), (0, -0.33, 1.28), 'white', bevel=0.2),
        cy(f'{name}_stick', 0.02, 0.6, (0, -0.3, 0.92), 'wood', bevel=0, sub=0),
    ]
    return prop(name, parts, {'sign': to3(0, -0.36, 1.28) + [0.82, 0.48]})


robot('robot')


def director_chair(name):
    parts = [
        rb(f'{name}_seat', (0.7, 0.55, 0.06), (0, 0, 0.62), 'tomato', bevel=0.3, lump=0.002),
        rb(f'{name}_back', (0.72, 0.05, 0.34), (0, 0.27, 1.05), 'tomato', bevel=0.3, lump=0.002),
    ]
    for i, (x, rot) in enumerate([(-0.34, 22), (0.34, -22)]):
        parts.append(cy(f'{name}_x{i}a', 0.03, 0.8, (x, 0, 0.32), 'wood', rot=(math.radians(rot), 0, 0), bevel=0, sub=0))
        parts.append(cy(f'{name}_x{i}b', 0.03, 0.8, (x, 0, 0.32), 'wood', rot=(math.radians(-rot), 0, 0), bevel=0, sub=0))
        parts.append(cy(f'{name}_up{i}', 0.03, 0.62, (x, 0.27, 0.95), 'wood', bevel=0, sub=0))
        parts.append(rb(f'{name}_arm{i}', (0.06, 0.55, 0.05), (x, 0, 0.82), 'wood', bevel=0.3))
    return prop(name, parts, {'back': to3(0, 0.24, 1.05) + [0.66, 0.28]})


director_chair('director_chair')
prop('film_camera', [
    rb('fc_body', (0.62, 0.4, 0.44), (0, 0, 1.52), 'black', bevel=0.2),
    cy('fc_lens', 0.13, 0.32, (0, -0.34, 1.5), 'slate', rot=(math.radians(90), 0, 0)),
    cy('fc_glass', 0.1, 0.04, (0, -0.5, 1.5), 'blue', rot=(math.radians(90), 0, 0), lump=0),
    cy('fc_reel_a', 0.2, 0.08, (-0.14, 0.02, 1.96), 'black', rot=(0, math.radians(90), 0)),
    cy('fc_reel_b', 0.2, 0.08, (0.2, 0.02, 1.96), 'black', rot=(0, math.radians(90), 0)),
    cy('fc_head', 0.12, 0.1, (0, 0, 1.25), 'slate'),
] + [cy(f'fc_leg{i}', 0.03, 1.35, (math.cos(a) * 0.25, math.sin(a) * 0.25, 0.62), 'wood_dark', rot=(math.sin(a) * 0.35, -math.cos(a) * 0.35, 0), bevel=0, sub=0) for i, a in enumerate((0.5, 2.6, 4.7))])
prop('storyboard', [
    rb('st_board', (1.5, 0.06, 1.0), (0, 0, 1.5), 'white', bevel=0.12),
    cy('st_leg_a', 0.03, 1.8, (-0.5, 0.1, 0.9), 'wood', rot=(math.radians(-8), 0, math.radians(8)), bevel=0, sub=0),
    cy('st_leg_b', 0.03, 1.8, (0.5, 0.1, 0.9), 'wood', rot=(math.radians(-8), 0, math.radians(-8)), bevel=0, sub=0),
    cy('st_leg_c', 0.03, 1.9, (0, 0.5, 0.9), 'wood', rot=(math.radians(18), 0, 0), bevel=0, sub=0),
    rb('st_ledge', (1.5, 0.14, 0.06), (0, -0.05, 0.98), 'wood', bevel=0.3),
], {'board': to3(0, -0.035, 1.5) + [1.4, 0.9]})

# ------------------------------------------------------------ road so far + wrap
prop('milestone', [rb('ms_stone', (0.9, 0.4, 1.2), (0, 0, 0.6), 'stone2', bevel=0.3, lump=0.012), rb('ms_plaque', (0.72, 0.06, 0.5), (0, -0.2, 0.78), 'cream', bevel=0.25, lump=0.002), bl('ms_moss', (0.3, 0.22, 0.12), (0.25, 0.1, 1.18), 'moss', lump=0.02)], {'plaque': to3(0, -0.235, 0.78) + [0.64, 0.42]})
prop('clapperboard', [
    rb('cp_slate', (1.1, 0.09, 0.8), (0, 0, 0.55), 'black', bevel=0.12),
    rb('cp_stick_a', (1.12, 0.1, 0.16), (0, -0.01, 1.03), 'white', bevel=0.2),
    rb('cp_stick_b', (1.12, 0.1, 0.16), (0.05, -0.01, 1.22), 'white', bevel=0.2, rot=(0, math.radians(-14), 0)),
    rb('cp_foot', (0.6, 0.45, 0.14), (0, 0.05, 0.07), 'wood_dark', bevel=0.3),
], {'slate': to3(0, -0.05, 0.55) + [1.0, 0.7]})
prop('light_stand', [
    rb('ls_box', (0.9, 0.5, 0.7), (0, 0, 2.6), 'black', bevel=0.12),
    rb('ls_face', (0.8, 0.04, 0.6), (0, -0.26, 2.6), 'glow', bevel=0.1, lump=0),
    cy('ls_pole', 0.035, 2.2, (0, 0.05, 1.3), 'slate', bevel=0, sub=0),
] + [cy(f'ls_leg{i}', 0.028, 0.9, (math.cos(a) * 0.28, math.sin(a) * 0.28, 0.35), 'slate', rot=(math.sin(a) * 0.7, -math.cos(a) * 0.7, 0), bevel=0, sub=0) for i, a in enumerate((0.3, 2.4, 4.5))], {'light': to3(0, -0.3, 2.6)})
prop('mailbox', [cy('mb_post', 0.06, 1.1, (0, 0, 0.55), 'wood_dark'), rb('mb_box', (0.4, 0.62, 0.34), (0, 0, 1.2), 'tomato', bevel=0.3), cy('mb_roof', 0.2, 0.62, (0, 0, 1.37), 'tomato', rot=(math.radians(90), 0, 0)), rb('mb_flag', (0.04, 0.2, 0.14), (0.24, 0.1, 1.35), 'butter', bevel=0.3)])
prop('cloud_prop', [fused('cp_body', [bl(f'cld_{i}', (r,) * 3, (x, 0, z), 'white', lump=0) for i, (r, x, z) in enumerate([(0.7, 0, 0.5), (0.5, 0.75, 0.35), (0.55, -0.7, 0.4), (0.45, 0.25, 0.9), (0.4, -0.3, 0.8)])], 'white', voxel=0.05, lump=0.03)])

# ------------------------------------------------------------ export
VC = lib.material('clay_vc', '#ffffff', rough=0.64)
KEEP = {'clay_frame', 'clay_robot', 'clay_gold', 'clay_silver', 'clay_water', 'glow_warm', 'glow_red', 'glow_green'}
for o in PROPS:
    lib.bake_vertex_colors(o, keep=KEEP, groups={'*': VC})
total = sum(lib.tris(o) for o in PROPS)
print('PROPS', len(PROPS), 'TRIS', total)
for o in PROPS:
    print('  ', o.name, lib.tris(o))
os.makedirs(OUT, exist_ok=True)
lib.export_glb(os.path.join(OUT, 'props.glb'), objects=PROPS, animations=False)
print('EXPORTED props.glb')

if PREVIEW:
    for o in PROPS:
        o.hide_render = True
    prev_dir = os.path.join(OUT, 'props_prev')
    os.makedirs(prev_dir, exist_ok=True)
    for o in PROPS:
        o.hide_render = False
        bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
        lo = Vector((min(v.x for v in bb), min(v.y for v in bb), min(v.z for v in bb)))
        hi = Vector((max(v.x for v in bb), max(v.y for v in bb), max(v.z for v in bb)))
        size = max((hi - lo).length, 0.3)
        lib.preview(os.path.join(prev_dir, f'{o.name}.png'), target=tuple((lo + hi) / 2), dist=size * 1.55, yaw=-28, pitch=14, size=(320, 320), lens=50)
        o.hide_render = True
    print('PREVIEWS done')
