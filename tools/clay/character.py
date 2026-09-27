"""Clay Victor: modelled, rigged and animated procedurally, exported as victor.glb.

Ironvale's approved_fr_native.png informs facial proportions, black fringe and round glasses.
Victor wears his everyday T-shirt, jeans, sneakers and backpack.

    blender --background --factory-startup --python character.py -- <out_dir> [--preview]
"""
import math
import os
import sys

import bpy
import bmesh
from mathutils import Euler, Matrix, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

OUT = lib.args()[0]
PREVIEW = '--preview' in lib.args()
lib.reset()

M = {
    'skin': lib.material('clay_skin', '#e3b08a', rough=0.58, sss=0.08),
    'hair': lib.material('clay_hair', '#1c1a20', rough=0.5),
    'tee': lib.material('clay_tee', '#2f2e37', rough=0.66),
    'jeans': lib.material('clay_jeans', '#3d5288', rough=0.7),
    'shoe': lib.material('clay_shoe', '#f2ede3', rough=0.55),
    'sole': lib.material('clay_sole', '#c8bfb0', rough=0.6),
    'glasses': lib.material('clay_glasses', '#141318', rough=0.22),
    'lens': lib.material('glass_lens', '#bbd2ee', rough=0.075, metal=0.85),
    'mouth': lib.material('clay_mouth', '#6a2a30', rough=0.5),
    'pack': lib.material('clay_pack', '#a06d45', rough=0.65),
    'strap': lib.material('clay_strap', '#6d4930', rough=0.6),
}


def sphere(name, loc, radii, seg=48, rings=32):
    o = lib.prim('sphere', name, loc=loc, segments=seg, ring_count=rings, radius=1)
    o.scale = radii
    return lib.apply_transform(o)


def capsule(name, a, b, r, seg=24):
    """Capsule between points a and b (joined sphere-cylinder-sphere)."""
    a, b = Vector(a), Vector(b)
    d = b - a
    mid = (a + b) / 2
    cyl = lib.prim('cyl', name, loc=mid, vertices=seg, radius=r, depth=d.length)
    cyl.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    lib.apply_transform(cyl)
    s1 = sphere(name + '_a', a, (r, r, r), seg, seg // 2)
    s2 = sphere(name + '_b', b, (r, r, r), seg, seg // 2)
    return lib.join([cyl, s1, s2], name)


def fuse(objs, name, mat, voxel=0.011, smooth=8, lump=0.004, ratio=0.35):
    o = lib.join(objs, name)
    lib.remesh_smooth(o, voxel=voxel, smooth_iter=smooth, factor=0.55)
    if lump:
        lib.lumps(o, strength=lump, size=0.12, seed=len(name))
    lib.decimate(o, ratio)
    lib.shade_smooth(o)
    return lib.assign(o, mat)


# ---------------------------------------------------------------- head
HEAD = Vector((0, 0, 1.42))
head = fuse([
    sphere('skull', HEAD, (0.345, 0.325, 0.385)),
    sphere('cheeks', HEAD + Vector((0, -0.06, -0.1)), (0.275, 0.235, 0.23)),
    sphere('nose', HEAD + Vector((0, -0.345, -0.05)), (0.062, 0.07, 0.07)),
    sphere('ear_l', HEAD + Vector((0.335, 0.0, -0.02)), (0.05, 0.075, 0.1)),
    sphere('ear_r', HEAD + Vector((-0.335, 0.0, -0.02)), (0.05, 0.075, 0.1)),
    capsule('neck', (0, 0.01, 1.0), (0, 0.01, 1.12), 0.1),
], 'head', M['skin'], voxel=0.009, ratio=0.09)

# Bowl cut: a shell over the skull, rim high at the front, low at the nape.
hair = lib.prim('sphere', 'hair', loc=HEAD + Vector((0, 0.012, 0.04)), segments=60, ring_count=40, radius=1)
hair.scale = (0.375, 0.354, 0.412)
lib.apply_transform(hair)
bm = bmesh.new()
bm.from_mesh(hair.data)


def rim_height(x, y):
    a = math.atan2(x, -y)  # 0 at the face, +-pi at the nape
    return 1.305 + 0.215 * ((1 + math.cos(a)) / 2) ** 0.62


doomed = [v for v in bm.verts if v.co.z < rim_height(v.co.x, v.co.y)]
bmesh.ops.delete(bm, geom=doomed, context='VERTS')
# Chunky, slightly uneven fringe like hand-cut clay.
for v in bm.verts:
    if v.is_boundary:
        a = math.atan2(v.co.x, -v.co.y)
        v.co.z += 0.012 * math.sin(a * 9.0) + 0.006 * math.sin(a * 23.0)
bm.to_mesh(hair.data)
bm.free()
lib.modifier(hair, 'SOLIDIFY', thickness=0.04, offset=-1)
lib.shade_smooth(hair)
lib.assign(hair, M['hair'])

# Opaque reflective round glasses, with no eyes or eyelids behind them.
face = []
for s in (1, -1):
    rim = lib.prim('torus', f'rim_{"l" if s > 0 else "r"}', loc=HEAD + Vector((0.145 * s, -0.372, 0.005)), rot=(math.radians(90), 0, 0), major_radius=0.125, minor_radius=0.011, major_segments=48, minor_segments=12)
    lib.apply_transform(rim)
    face.append(lib.assign(lib.shade_smooth(rim), M['glasses']))
    lens = sphere(f'lens_{"l" if s > 0 else "r"}', HEAD + Vector((0.145 * s, -0.378, 0.005)), (0.118, 0.018, 0.118), 40, 24)
    face.append(lib.assign(lib.shade_smooth(lens), M['lens']))
    temple = capsule(f'temple_{"l" if s > 0 else "r"}', HEAD + Vector((0.268 * s, -0.36, 0.02)), HEAD + Vector((0.335 * s, 0.02, 0.0)), 0.011, 10)
    face.append(lib.assign(lib.shade_smooth(temple), M['glasses']))
for s in (1, -1):
    blush = sphere(f'blush_{"l" if s > 0 else "r"}', HEAD + Vector((0.222 * s, -0.234, -0.118)), (0.05, 0.02, 0.031), 24, 12)
    face.append(lib.assign(lib.shade_smooth(blush), lib.material('clay_blush', '#e3a092', rough=0.6)))
bridge = capsule('bridge', HEAD + Vector((0.04, -0.385, 0.025)), HEAD + Vector((-0.04, -0.385, 0.025)), 0.011, 10)
face.append(lib.assign(lib.shade_smooth(bridge), M['glasses']))

for s in (1, -1):
    smile = capsule(f'smile_{s}', HEAD + Vector((0, -0.293, -0.185)), HEAD + Vector((0.055 * s, -0.286, -0.176)), 0.008, 12)
    face.append(lib.assign(lib.shade_smooth(smile), M['mouth']))

# A more restrained head proportion, keeping the existing neck joint.
for o in [head, hair, *face]:
    for v in o.data.vertices:
        v.co = Vector((0, 0, 1.09)) + (v.co - Vector((0, 0, 1.09))) * 0.86

# ---------------------------------------------------------------- body
tee = fuse([
    sphere('chest', (0, 0.0, 0.87), (0.245, 0.175, 0.25)),
    sphere('belly', (0, -0.006, 0.69), (0.205, 0.145, 0.17)),
    capsule('shoulders', (-0.21, 0.0, 0.985), (0.21, 0.0, 0.985), 0.09),
], 'tee', M['tee'], voxel=0.011, ratio=0.17)

sleeves = []
for s in (1, -1):
    side = 'l' if s > 0 else 'r'
    sleeves.append(fuse([sphere(f'shoulder_{side}', (0.29 * s, 0.0, 0.98), (0.1, 0.085, 0.1)), capsule(f'sleeve_{side}', (0.29 * s, 0.0, 0.98), (0.375 * s, 0.0, 0.845), 0.079)], f'sleeve_{side}', M['tee'], voxel=0.01, ratio=0.24))

arms = []
# In the resting pose fingers point down. The thumb sits outside, so raising the palm toward
# the camera puts a right-hand thumb on the viewer's right (toward the face).
PALM = Vector((0.468, -0.03, 0.567))
THUMB = Vector((0.554, -0.058, 0.56))
FINGERS = ((0.504, 0.519, 0.476), (0.480, 0.485, 0.458), (0.456, 0.450, 0.470), (0.432, 0.418, 0.492))
for s in (1, -1):
    side = 'l' if s > 0 else 'r'
    fore = capsule(f'fore_{side}', (0.385 * s, 0.0, 0.84), (0.455 * s, -0.02, 0.62), 0.054)
    hand = sphere(f'hand_{side}', (PALM.x * s, PALM.y, PALM.z), (0.062, 0.038, 0.057))
    fingers = [capsule(f'finger_{side}_{i}', (base * s, -0.03, 0.532), (tip * s, -0.033, z), 0.014 if i < 3 else 0.012, 16) for i, (base, tip, z) in enumerate(FINGERS)]
    thumb = capsule(f'thumb_{side}', (0.515 * s, -0.043, 0.584), (THUMB.x * s, THUMB.y, THUMB.z), 0.019, 16)
    arms.append(fuse([fore, hand, *fingers, thumb], f'arm_{side}', M['skin'], voxel=0.005, smooth=4, lump=0.0015, ratio=0.28))

jeans = fuse([
    sphere('pelvis', (0, 0.0, 0.57), (0.21, 0.145, 0.105)),
    capsule('leg_l', (0.12, 0.0, 0.56), (0.13, 0.0, 0.16), 0.085),
    capsule('leg_r', (-0.12, 0.0, 0.56), (-0.13, 0.0, 0.16), 0.085),
    sphere('cuff_l', (0.13, -0.005, 0.15), (0.092, 0.092, 0.035)),
    sphere('cuff_r', (-0.13, -0.005, 0.15), (0.092, 0.092, 0.035)),
], 'jeans', M['jeans'], voxel=0.011, ratio=0.22)

shoes = []
for s in (1, -1):
    side = 'l' if s > 0 else 'r'
    upper = fuse([sphere(f'shoe_{side}', (0.13 * s, -0.05, 0.075), (0.095, 0.155, 0.075)), sphere(f'toe_{side}', (0.13 * s, -0.14, 0.06), (0.085, 0.07, 0.055))], f'shoe_{side}', M['shoe'], voxel=0.008, ratio=0.24)
    sole = sphere(f'sole_{side}', (0.13 * s, -0.055, 0.022), (0.1, 0.165, 0.024), 32, 12)
    shoes.append((side, upper, lib.assign(lib.shade_smooth(sole), M['sole'])))

pack = fuse([
    sphere('pack_body', (0, 0.225, 0.84), (0.175, 0.085, 0.23)),
    sphere('pack_flap', (0, 0.247, 1.0), (0.155, 0.075, 0.07)),
    sphere('pack_pocket', (0, 0.305, 0.76), (0.11, 0.04, 0.09)),
], 'pack', M['pack'], voxel=0.01, ratio=0.22)

straps = []
for s in (1, -1):
    cu = bpy.data.curves.new(f'strap_{s}', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.018
    cu.bevel_resolution = 3
    sp = cu.splines.new('NURBS')
    pts = [(0.13 * s, 0.17, 1.0), (0.15 * s, 0.06, 1.085), (0.15 * s, -0.1, 1.03), (0.14 * s, -0.17, 0.9), (0.15 * s, -0.155, 0.74), (0.185 * s, 0.035, 0.66), (0.13 * s, 0.17, 0.66)]
    sp.points.add(len(pts) - 1)
    for p, c in zip(sp.points, pts):
        p.co = (*c, 1)
    sp.use_endpoint_u = True
    sp.order_u = 4
    ob = lib.link(bpy.data.objects.new(f'strap_{"l" if s > 0 else "r"}', cu))
    lib.activate(ob)
    bpy.ops.object.convert(target='MESH')
    straps.append(lib.assign(lib.shade_smooth(bpy.context.view_layer.objects.active), M['strap']))

# ---------------------------------------------------------------- rig
arm_data = bpy.data.armatures.new('VictorRig')
rig = lib.link(bpy.data.objects.new('Victor', arm_data))
lib.activate(rig)
bpy.ops.object.mode_set(mode='EDIT')
B = {}


def bone(name, head, tail, parent=None):
    b = arm_data.edit_bones.new(name)
    b.head, b.tail = Vector(head), Vector(tail)
    b.roll = 0
    if parent:
        b.parent = B[parent]
        b.use_connect = False
    B[name] = b


bone('root', (0, 0, 0), (0, 0.001, 0.25))
bone('hips', (0, 0, 0.56), (0, 0, 0.7), 'root')
bone('spine', (0, 0, 0.7), (0, 0, 0.88), 'hips')
bone('chest', (0, 0, 0.88), (0, 0, 1.04), 'spine')
bone('neck', (0, 0, 1.04), (0, 0, 1.14), 'chest')
bone('head', (0, 0, 1.14), (0, 0, 1.62), 'neck')
for s, side in ((1, 'L'), (-1, 'R')):
    bone(f'upperarm.{side}', (0.29 * s, 0, 0.98), (0.385 * s, 0, 0.84), 'chest')
    bone(f'forearm.{side}', (0.385 * s, 0, 0.84), (0.455 * s, -0.02, 0.62), f'upperarm.{side}')
    bone(f'hand.{side}', (0.455 * s, -0.02, 0.62), (0.47 * s, -0.035, 0.5), f'forearm.{side}')
    bone(f'thigh.{side}', (0.12 * s, 0, 0.56), (0.125 * s, 0, 0.35), 'hips')
    bone(f'shin.{side}', (0.125 * s, 0, 0.35), (0.13 * s, 0, 0.12), f'thigh.{side}')
    bone(f'foot.{side}', (0.13 * s, 0, 0.12), (0.13 * s, -0.13, 0.05), f'shin.{side}')
bpy.ops.object.mode_set(mode='OBJECT')

lib.weight_by_bones(head, rig, ['chest', 'neck', 'head'], power=5)
for o in [hair, *face]:
    lib.weight_by_bones(o, rig, ['head'], rigid='head')
lib.weight_by_bones(tee, rig, ['hips', 'spine', 'chest'], power=4)
for o, side in zip(sleeves, ('L', 'R')):
    lib.weight_by_bones(o, rig, [f'upperarm.{side}'], rigid=f'upperarm.{side}')
for o, side in zip(arms, ('L', 'R')):
    lib.weight_by_bones(o, rig, [f'upperarm.{side}', f'forearm.{side}', f'hand.{side}'], power=5)
lib.weight_by_bones(jeans, rig, ['hips', 'thigh.L', 'shin.L', 'thigh.R', 'shin.R'], power=4)
for side, upper, sole in shoes:
    for o in (upper, sole):
        lib.weight_by_bones(o, rig, [f'foot.{side.upper()}'], rigid=f'foot.{side.upper()}')
for o in [pack, *straps]:
    lib.weight_by_bones(o, rig, ['chest'], rigid='chest')

# ---------------------------------------------------------------- animation
AX = {'x': Vector((1, 0, 0)), 'y': Vector((0, 1, 0)), 'z': Vector((0, 0, 1))}


def local(bname, *rots):
    """Rotations about world axes (in the bone's rest frame) -> local Euler degrees."""
    Mr = rig.data.bones[bname].matrix_local.to_3x3()
    R = Matrix.Identity(3)
    for axis, deg in rots:
        R = Matrix.Rotation(math.radians(deg), 3, AX[axis]) @ R
    e = (Mr.inverted() @ R @ Mr).to_euler('XYZ')
    return tuple(math.degrees(a) for a in e)


def bone_name(k):
    return k[:-1] + '.' + k[-1] if k[-1] in 'LR' else k


def local_loc(bname, world_vec):
    """World-space offset -> the bone's local location (bones here have unposed parents)."""
    return tuple(rig.data.bones[bname].matrix_local.to_3x3().inverted() @ Vector(world_vec))


def P(**spec):
    """P(thighL=[('x',-25)], hips_loc=(0,0,-0.02)) -> pose dict for lib.key_pose.

    Rotations are about world axes; *_loc offsets are world-space (Blender Z-up)."""
    pose = {}
    for k, v in spec.items():
        if k.endswith('_loc'):
            n = bone_name(k[:-4])
            pose.setdefault(n, {})['loc'] = local_loc(n, v)
        else:
            n = bone_name(k)
            pose.setdefault(n, {})['rot'] = local(n, *v)
    return pose


ALL = ['root', 'hips', 'spine', 'chest', 'neck', 'head'] + [f'{b}.{s}' for b in ('upperarm', 'forearm', 'hand', 'thigh', 'shin', 'foot') for s in 'LR']


def neutral():
    return {b: {'rot': (0, 0, 0), 'loc': (0, 0, 0)} for b in ALL}


def keyframes(name, frames):
    act = lib.new_action(rig, name)
    for f, pose in frames:
        full = neutral()
        for b, v in pose.items():
            full[b].update(v)
        lib.key_pose(rig, f, full)
    lib.push_to_nla(rig, act)


REST_ARMS = dict(upperarmL=[('y', 6)], upperarmR=[('y', -6)])

keyframes('idle', [
    (0, P(**REST_ARMS, chest=[('x', 0)], head=[('z', 0)])),
    (12, P(upperarmL=[('y', 8), ('x', 3)], upperarmR=[('y', -8), ('x', -3)], chest=[('x', -2.5)], head=[('y', 3), ('z', 4)], hips_loc=(0, 0, 0.006))),
    (24, P(**REST_ARMS, chest=[('x', 0)], head=[('z', 0)])),
    (36, P(upperarmL=[('y', 8), ('x', -3)], upperarmR=[('y', -8), ('x', 3)], chest=[('x', -2.5)], head=[('y', -3), ('z', -4)], hips_loc=(0, 0, 0.006))),
    (48, P(**REST_ARMS, chest=[('x', 0)], head=[('z', 0)])),
])


def walk_pose(phase):
    """phase 0 = left foot forward contact, 0.25 = passing, 0.5 = right forward."""
    s = math.cos(phase * 2 * math.pi)
    lift_l = max(0.0, math.sin(phase * 2 * math.pi + math.pi))
    lift_r = max(0.0, math.sin(phase * 2 * math.pi))
    bob = abs(math.sin(phase * 2 * math.pi)) * 0.035 - 0.012
    return P(
        thighL=[('x', -26 * s)], thighR=[('x', 26 * s)],
        shinL=[('x', 8 + 40 * lift_l)], shinR=[('x', 8 + 40 * lift_r)],
        footL=[('x', -10 * lift_l)], footR=[('x', -10 * lift_r)],
        upperarmL=[('y', 8), ('x', 22 * s)], upperarmR=[('y', -8), ('x', -22 * s)],
        forearmL=[('x', -14)], forearmR=[('x', -14)],
        hips=[('z', 5 * s), ('y', 2 * s)], chest=[('z', -7 * s), ('x', -4)],
        head=[('z', 3 * s), ('x', 2)],
        hips_loc=(0, 0, bob),
    )


keyframes('walk', [(f, walk_pose(f / 24)) for f in range(0, 25, 2)])

def wave_pose(frame):
    """Raise, show the palm, wave three times, then lower and rest. Keep the elbow quiet."""
    up = max(0.0, min(1.0, frame / 14))
    down = max(0.0, min(1.0, (frame - 76) / 16))
    amount = up * up * (3 - 2 * up) * (1 - down * down * (3 - 2 * down))
    phase = 2 * math.pi * (frame - 18) / 18
    waving = max(0.0, min(1.0, (frame - 18) / 4, (72 - frame) / 4))
    waving = waving * waving * (3 - 2 * waving)
    swing = math.sin(phase) * waving
    # The wrist follows the forearm rather than all three joints reversing together.
    wrist = math.sin(phase - 0.5) * waving
    return P(
        upperarmR=[('y', -6 + 76 * amount), ('x', 12 * amount)],
        forearmR=[('y', (85 + 7 * swing) * amount)],
        handR=[('y', (8 + 18 * wrist) * amount)],
        upperarmL=[('y', 6)],
        chest=[('y', 2 * amount), ('z', 2 * amount)],
        head=[('y', -3 * amount), ('z', -3 * amount)],
    )


# Six seconds: a greeting followed by a relaxed pause, with matching resting endpoints.
keyframes('wave', [(f, wave_pose(f)) for f in range(0, 145, 2)])


def check_wave():
    """Run on every rebuild: an open palm beside the face, a steady elbow, and no loop jump."""
    rig.animation_data.action = bpy.data.actions['wave']
    elbows = []
    hands = []
    for frame in (0, 24, 30, 42, 48, 60, 66, 144):
        bpy.context.scene.frame_set(frame)
        bpy.context.view_layer.update()
        hand = rig.pose.bones['hand.R']
        if frame in (0, 144):
            hands.append(hand.matrix.copy())
            continue
        assert hand.head.x < -0.42 and hand.tail.z > 1.25, 'Wave must clear the face'
        assert hand.head.y < -0.03, 'Wave must stay in front of the shoulder'
        palm = hand.matrix.to_3x3() @ rig.data.bones['hand.R'].matrix_local.to_3x3().inverted() @ Vector((0, -1, 0))
        assert palm.y < -0.85, 'Palm must face the viewer'
        posed = hand.matrix @ rig.data.bones['hand.R'].matrix_local.inverted()
        center = posed @ Vector((-PALM.x, PALM.y, PALM.z))
        thumb = posed @ Vector((-THUMB.x, THUMB.y, THUMB.z))
        assert thumb.x > center.x, 'Right thumb must point toward the face when the palm faces the viewer'
        assert all((posed @ Vector((-tip, -0.033, z))).z > center.z for _, tip, z in FINGERS), 'Fingers must point up while waving'
        elbows.append(rig.pose.bones['forearm.R'].head.copy())
    assert max((p - elbows[0]).length for p in elbows) < 0.005, 'Elbow must stay still while waving'
    assert max(abs(hands[0][i][j] - hands[1][i][j]) for i in range(4) for j in range(4)) < 1e-5, 'Wave loop must close'
    rig.animation_data.action = None
    print('WAVE CHECK passed')


check_wave()

# Present: the screen stands on the figure's left (viewer's right); the left arm sweeps toward it.
keyframes('present', [
    (0, P(upperarmL=[('y', -70), ('z', -26)], forearmL=[('y', -10)], handL=[('y', -8)], chest=[('z', 10)], head=[('z', 24), ('y', 4)], upperarmR=[('y', -10), ('x', -8)], forearmR=[('x', -35)])),
    (24, P(upperarmL=[('y', -78), ('z', -30)], forearmL=[('y', -14)], handL=[('y', -12)], chest=[('z', 12)], head=[('z', 8), ('y', -3)], upperarmR=[('y', -10), ('x', -8)], forearmR=[('x', -35)], hips_loc=(0, 0, 0.008))),
    (48, P(upperarmL=[('y', -70), ('z', -26)], forearmL=[('y', -10)], handL=[('y', -8)], chest=[('z', 10)], head=[('z', 24), ('y', 4)], upperarmR=[('y', -10), ('x', -8)], forearmR=[('x', -35)])),
])

keyframes('hop', [
    (0, P(**REST_ARMS)),
    (4, P(thighL=[('x', -30)], thighR=[('x', -30)], shinL=[('x', 55)], shinR=[('x', 55)], footL=[('x', -25)], footR=[('x', -25)], hips_loc=(0, 0.02, -0.09), upperarmL=[('y', 10), ('x', 25)], upperarmR=[('y', -10), ('x', 25)], chest=[('x', 8)])),
    (8, P(upperarmL=[('y', 35), ('x', -30)], upperarmR=[('y', -35), ('x', -30)], shinL=[('x', 20)], shinR=[('x', 20)], hips_loc=(0, 0, 0.28), head=[('x', -6)])),
    (12, P(thighL=[('x', -22)], thighR=[('x', -22)], shinL=[('x', 40)], shinR=[('x', 40)], footL=[('x', -18)], footR=[('x', -18)], hips_loc=(0, 0.01, -0.06), upperarmL=[('y', 20)], upperarmR=[('y', -20)])),
    (16, P(**REST_ARMS)),
])

bpy.context.scene.frame_set(0)
parts = [head, hair, *face, tee, *sleeves, *arms, jeans, *[o for _, u, so in shoes for o in (u, so)], pack, *straps]
print('TRIS', sum(lib.tris(o) for o in parts), {o.name: lib.tris(o) for o in parts if lib.tris(o) > 2000})
# One skinned mesh: matte clay in vertex colours, glossy glasses, hair on its own.
body = lib.join(parts, 'VictorBody')
glossy = lib.material('clay_glossvc', '#ffffff', rough=0.2)
matte = lib.material('clay_vc', '#ffffff', rough=0.62)
lib.bake_vertex_colors(body, keep={'clay_hair', 'glass_lens'}, groups={'*': matte, 'clay_glasses': glossy})
assert any(m.name == 'glass_lens' for m in body.data.materials), 'Spectacles must keep their reflective material'
parts = [body]
print('BODY slots', [m.name for m in body.data.materials], 'tris', lib.tris(body))

os.makedirs(OUT, exist_ok=True)
lib.export_glb(os.path.join(OUT, 'victor.glb'), objects=[rig, *parts], animations=True)
print('EXPORTED', os.path.join(OUT, 'victor.glb'))

if PREVIEW:
    def pose_at(action_name, frame):
        rig.animation_data.action = bpy.data.actions[action_name]
        for t in rig.animation_data.nla_tracks:
            t.mute = True
        bpy.context.scene.frame_set(frame)

    rig.animation_data.action = None
    bpy.context.scene.frame_set(0)
    for pb in rig.pose.bones:
        pb.rotation_euler = (0, 0, 0)
        pb.location = (0, 0, 0)
    lib.preview(os.path.join(OUT, 'prev_front.png'), target=(0, 0, 1.0), dist=4.6, yaw=0, pitch=6)
    lib.preview(os.path.join(OUT, 'prev_34.png'), target=(0, 0, 1.0), dist=4.6, yaw=-35, pitch=10)
    lib.preview(os.path.join(OUT, 'prev_face.png'), target=(0, -0.1, 1.42), dist=1.9, yaw=-20, pitch=4)
    for act, f in (('walk', 0), ('walk', 6), ('wave', 24), ('present', 12), ('hop', 8)):
        pose_at(act, f)
        lib.preview(os.path.join(OUT, f'prev_{act}_{f}.png'), target=(0, 0, 1.0), dist=4.8, yaw=-60 if act == 'walk' else -25, pitch=8, size=(600, 600))
    # The wave as the hello camera sees it (nearly frontal, a little above), and from the side for depth.
    for f in (18, 24, 30, 42, 48, 72):
        pose_at('wave', f)
        lib.preview(os.path.join(OUT, f'prev_wave_front_{f}.png'), target=(0, 0, 1.1), dist=4.2, yaw=-7, pitch=13, size=(420, 420))
    pose_at('wave', 24)
    lib.preview(os.path.join(OUT, 'prev_wave_side.png'), target=(0, 0, 1.1), dist=4.2, yaw=-85, pitch=6, size=(420, 420))
    print('PREVIEWS done')
