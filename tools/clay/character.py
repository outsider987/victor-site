"""Clay Victor: modelled, rigged and animated procedurally, exported as victor.glb.

Appearance follows Ironvale's approved_fr_native.png scholar: black hair, reflective round
spectacles, short ivory mantle and a charcoal coat with brass trim.

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
    'tee': lib.material('clay_tee', '#302c26', rough=0.66),
    'jeans': lib.material('clay_jeans', '#24212b', rough=0.7),
    'shoe': lib.material('clay_shoe', '#775039', rough=0.55),
    'sole': lib.material('clay_sole', '#3e2a24', rough=0.6),
    'eye': lib.material('clay_eye', '#f8f4ec', rough=0.35),
    'pupil': lib.material('clay_pupil', '#141216', rough=0.25),
    'glasses': lib.material('clay_glasses', '#141318', rough=0.22),
    'lens': lib.material('glass_lens', '#d6e7fa', rough=0.1, metal=0.55),
    'ivory': lib.material('clay_ivory', '#ddd0b9', rough=0.75),
    'gold': lib.material('clay_trim', '#b58c43', rough=0.48, metal=0.25),
    'mouth': lib.material('clay_mouth', '#6a2a30', rough=0.5),
    'brow': lib.material('clay_brow', '#1c1a20', rough=0.55),
    'belt': lib.material('clay_belt', '#694329', rough=0.65),
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


def cloth(name, rows, mat):
    """Thin clay cloth from rows of points, shared by the mantle and split coat panels."""
    cols = len(rows[0])
    faces = [(j * cols + i, (j + 1) * cols + i, (j + 1) * cols + i + 1, j * cols + i + 1) for j in range(len(rows) - 1) for i in range(cols - 1)]
    data = bpy.data.meshes.new(name)
    data.from_pydata([p for row in rows for p in row], [], faces)
    o = lib.link(bpy.data.objects.new(name, data))
    lib.modifier(o, 'SOLIDIFY', thickness=0.018, offset=0)
    return lib.assign(lib.shade_smooth(o), mat)


# ---------------------------------------------------------------- head
HEAD = Vector((0, 0, 1.42))
head = fuse([
    sphere('skull', HEAD, (0.37, 0.345, 0.385)),
    sphere('cheeks', HEAD + Vector((0, -0.07, -0.1)), (0.315, 0.27, 0.23)),
    sphere('nose', HEAD + Vector((0, -0.345, -0.05)), (0.062, 0.07, 0.07)),
    sphere('ear_l', HEAD + Vector((0.355, 0.0, -0.02)), (0.05, 0.075, 0.1)),
    sphere('ear_r', HEAD + Vector((-0.355, 0.0, -0.02)), (0.05, 0.075, 0.1)),
    capsule('neck', (0, 0.01, 1.0), (0, 0.01, 1.12), 0.1),
], 'head', M['skin'], voxel=0.009, ratio=0.09)

# Bowl cut: a shell over the skull, rim high at the front, low at the nape.
hair = lib.prim('sphere', 'hair', loc=HEAD + Vector((0, 0.012, 0.04)), segments=60, ring_count=40, radius=1)
hair.scale = (0.398, 0.374, 0.412)
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

# The approved scholar's large, opaque silver-blue spectacles and quiet expression.
face = []
for s in (1, -1):
    ec = HEAD + Vector((0.128 * s, -0.302, 0.012))
    eye = sphere(f'eye_{"l" if s > 0 else "r"}', ec, (0.063, 0.045, 0.069), 32, 20)
    face.append(lib.assign(eye, M['eye']))
    pupil = sphere(f'pupil_{"l" if s > 0 else "r"}', HEAD + Vector((0.121 * s, -0.344, 0.0)), (0.029, 0.016, 0.033), 24, 14)
    face.append(lib.assign(pupil, M['pupil']))
    lid = sphere(f'lid_{"l" if s > 0 else "r"}', ec + Vector((0, -0.002, 0.004)), (0.069, 0.051, 0.074), 32, 20)
    lbm = bmesh.new()
    lbm.from_mesh(lid.data)
    bmesh.ops.delete(lbm, geom=[v for v in lbm.verts if v.co.z < ec.z + 0.016], context='VERTS')
    lbm.to_mesh(lid.data)
    lbm.free()
    lib.modifier(lid, 'SOLIDIFY', thickness=0.008, offset=1)
    face.append(lib.assign(lib.shade_smooth(lid), M['skin']))
    brow = capsule(f'brow_{"l" if s > 0 else "r"}', HEAD + Vector((0.07 * s, -0.33, 0.1)), HEAD + Vector((0.19 * s, -0.305, 0.09)), 0.018, 12)
    face.append(lib.assign(lib.shade_smooth(brow), M['brow']))
    rim = lib.prim('torus', f'rim_{"l" if s > 0 else "r"}', loc=HEAD + Vector((0.145 * s, -0.372, 0.005)), rot=(math.radians(90), 0, 0), major_radius=0.125, minor_radius=0.011, major_segments=48, minor_segments=12)
    lib.apply_transform(rim)
    face.append(lib.assign(lib.shade_smooth(rim), M['glasses']))
    lens = sphere(f'lens_{"l" if s > 0 else "r"}', HEAD + Vector((0.145 * s, -0.378, 0.005)), (0.118, 0.018, 0.118), 40, 24)
    face.append(lib.assign(lib.shade_smooth(lens), M['lens']))
    temple = capsule(f'temple_{"l" if s > 0 else "r"}', HEAD + Vector((0.268 * s, -0.36, 0.02)), HEAD + Vector((0.36 * s, 0.02, 0.0)), 0.011, 10)
    face.append(lib.assign(lib.shade_smooth(temple), M['glasses']))
for s in (1, -1):
    blush = sphere(f'blush_{"l" if s > 0 else "r"}', HEAD + Vector((0.222 * s, -0.262, -0.118)), (0.05, 0.02, 0.031), 24, 12)
    face.append(lib.assign(lib.shade_smooth(blush), lib.material('clay_blush', '#e3a092', rough=0.6)))
bridge = capsule('bridge', HEAD + Vector((0.04, -0.385, 0.025)), HEAD + Vector((-0.04, -0.385, 0.025)), 0.011, 10)
face.append(lib.assign(lib.shade_smooth(bridge), M['glasses']))

for s in (1, -1):
    smile = capsule(f'smile_{s}', HEAD + Vector((0, -0.336, -0.185)), HEAD + Vector((0.055 * s, -0.327, -0.176)), 0.008, 12)
    face.append(lib.assign(lib.shade_smooth(smile), M['mouth']))

# Bring the head-to-body ratio closer to the approved sprite, keeping the existing neck joint.
for o in [head, hair, *face]:
    for v in o.data.vertices:
        v.co = Vector((0, 0, 1.09)) + (v.co - Vector((0, 0, 1.09))) * 0.86

# ---------------------------------------------------------------- body
tee = fuse([
    sphere('chest', (0, 0.0, 0.87), (0.29, 0.215, 0.25)),
    sphere('belly', (0, -0.012, 0.69), (0.275, 0.21, 0.17)),
    capsule('shoulders', (-0.21, 0.0, 0.985), (0.21, 0.0, 0.985), 0.1),
], 'tee', M['tee'], voxel=0.011, ratio=0.17)

sleeves = []
for s in (1, -1):
    side = 'l' if s > 0 else 'r'
    sleeves.append(fuse([sphere(f'shoulder_{side}', (0.29 * s, 0.0, 0.98), (0.108, 0.105, 0.108)), capsule(f'sleeve_{side}', (0.29 * s, 0.0, 0.98), (0.375 * s, 0.0, 0.845), 0.094)], f'sleeve_{side}', M['tee'], voxel=0.01, ratio=0.24))

arms = []
forearms = []
cuffs = []
# In the resting pose fingers point down. The thumb sits outside, so raising the palm toward
# the camera puts a right-hand thumb on the viewer's right (toward the face).
PALM = Vector((0.468, -0.03, 0.567))
THUMB = Vector((0.554, -0.058, 0.56))
FINGERS = ((0.504, 0.519, 0.476), (0.480, 0.485, 0.458), (0.456, 0.450, 0.470), (0.432, 0.418, 0.492))
for s in (1, -1):
    side = 'l' if s > 0 else 'r'
    fore = capsule(f'fore_{side}', (0.385 * s, 0.0, 0.84), (0.455 * s, -0.02, 0.62), 0.062)
    forearms.append(lib.assign(lib.shade_smooth(fore), M['tee']))
    hand = sphere(f'hand_{side}', (PALM.x * s, PALM.y, PALM.z), (0.062, 0.038, 0.057))
    fingers = [capsule(f'finger_{side}_{i}', (base * s, -0.03, 0.532), (tip * s, -0.033, z), 0.014 if i < 3 else 0.012, 16) for i, (base, tip, z) in enumerate(FINGERS)]
    thumb = capsule(f'thumb_{side}', (0.515 * s, -0.043, 0.584), (THUMB.x * s, THUMB.y, THUMB.z), 0.019, 16)
    arms.append(fuse([hand, *fingers, thumb], f'hand_{side}', M['skin'], voxel=0.005, smooth=4, lump=0.0015, ratio=0.28))
    cuff = lib.prim('torus', f'cuff_{side}', loc=(0.455 * s, -0.02, 0.628), major_radius=0.064, minor_radius=0.009, major_segments=32, minor_segments=8)
    cuff.rotation_euler = Vector((0.07 * s, -0.02, -0.22)).to_track_quat('Z', 'Y').to_euler()
    cuffs.append(lib.assign(lib.shade_smooth(lib.apply_transform(cuff)), M['gold']))

jeans = fuse([
    sphere('pelvis', (0, 0.0, 0.57), (0.265, 0.2, 0.13)),
    capsule('leg_l', (0.12, 0.0, 0.56), (0.13, 0.0, 0.16), 0.1),
    capsule('leg_r', (-0.12, 0.0, 0.56), (-0.13, 0.0, 0.16), 0.1),
], 'jeans', M['jeans'], voxel=0.011, ratio=0.22)

shoes = []
for s in (1, -1):
    side = 'l' if s > 0 else 'r'
    upper = fuse([sphere(f'shoe_{side}', (0.13 * s, -0.05, 0.075), (0.095, 0.155, 0.075)), sphere(f'toe_{side}', (0.13 * s, -0.14, 0.06), (0.085, 0.07, 0.055))], f'shoe_{side}', M['shoe'], voxel=0.008, ratio=0.24)
    sole = sphere(f'sole_{side}', (0.13 * s, -0.055, 0.022), (0.1, 0.165, 0.024), 32, 12)
    shoes.append((side, upper, lib.assign(lib.shade_smooth(sole), M['sole'])))

# Short ivory mantle, split coat tails and restrained brass details from the approved reference.
mantle = []
rows = []
for j in range(10):
    t = j / 9
    rows.append([((0.12 + 0.31 * t) * math.sin(a), -(0.12 + 0.16 * t) * math.cos(a), 1.09 - 0.17 * t * t + 0.015 * math.cos(2 * a) * t) for a in (0.14 + (2 * math.pi - 0.28) * i / 48 for i in range(49))])
mantle.append(cloth('ivory_mantle', rows, M['ivory']))
mantle.append(lib.assign(sphere('brooch', (0, -0.23, 1.015), (0.026, 0.016, 0.037), 16, 10), M['gold']))
trim = [lib.assign(capsule('coat_placket', (0, -0.214, 0.94), (0, -0.217, 0.69), 0.012, 12), M['gold'])]
tails = []
for s, side in ((1, 'L'), (-1, 'R')):
    angles = [0.12 + (math.pi - 0.16) * i / 20 for i in range(21)]
    rows = [[(s * rx * math.sin(a), -ry * math.cos(a), z) for a in angles] for z, rx, ry in ((0.65, 0.245, 0.20), (0.52, 0.26, 0.208), (0.42, 0.28, 0.215), (0.32, 0.30, 0.22))]
    if s < 0:
        rows = [list(reversed(row)) for row in rows]
    tail = cloth(f'coat_tail_{side}', rows, M['tee'])
    curve = bpy.data.curves.new(f'coat_hem_{side}', 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth, curve.bevel_resolution = 0.012, 3
    line = curve.splines.new('POLY')
    line.points.add(len(rows[-1]) - 1)
    for point, co in zip(line.points, rows[-1]):
        point.co = (*co, 1)
    edge = lib.link(bpy.data.objects.new(f'coat_hem_{side}', curve))
    lib.activate(edge)
    bpy.ops.object.convert(target='MESH')
    edge = bpy.context.view_layer.objects.active
    border = capsule(f'coat_edge_{side}', (0.03 * s, -0.198, 0.65), (0.036 * s, -0.218, 0.32), 0.011, 12)
    tails.append((side, lib.assign(lib.shade_smooth(tail), M['tee']), lib.assign(lib.shade_smooth(edge), M['gold']), lib.assign(lib.shade_smooth(border), M['gold'])))
    boot = capsule(f'boot_{side}', (0.13 * s, 0, 0.11), (0.13 * s, 0, 0.26), 0.107, 24)
    trim.append(lib.assign(lib.shade_smooth(boot), M['shoe']))
belt = lib.prim('torus', 'belt', loc=(0, 0, 0.645), major_radius=0.265, minor_radius=0.025, major_segments=48, minor_segments=12)
belt.scale.y = 0.79
lib.apply_transform(belt)
trim.append(lib.assign(lib.shade_smooth(belt), M['belt']))
trim.append(lib.assign(sphere('buckle', (0, -0.235, 0.645), (0.041, 0.016, 0.032), 16, 10), M['gold']))

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
for fore, cuff, side in zip(forearms, cuffs, ('L', 'R')):
    for o in (fore, cuff):
        lib.weight_by_bones(o, rig, [f'forearm.{side}'], rigid=f'forearm.{side}')
lib.weight_by_bones(jeans, rig, ['hips', 'thigh.L', 'shin.L', 'thigh.R', 'shin.R'], power=4)
for side, upper, sole in shoes:
    for o in (upper, sole):
        lib.weight_by_bones(o, rig, [f'foot.{side.upper()}'], rigid=f'foot.{side.upper()}')
for o in mantle:
    lib.weight_by_bones(o, rig, ['chest'], rigid='chest')
for o in trim:
    if o.name.startswith('boot_'):
        side = o.name[-1]
        lib.weight_by_bones(o, rig, [f'shin.{side}', f'foot.{side}'], power=5)
    else:
        b = 'hips' if o.name in ('belt', 'buckle') else 'chest'
        lib.weight_by_bones(o, rig, [b], rigid=b)
for side, *parts in tails:
    for o in parts:
        lib.weight_by_bones(o, rig, ['hips', f'thigh.{side}'], power=5)

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
parts = [head, hair, *face, tee, *sleeves, *forearms, *cuffs, *arms, jeans, *[o for _, u, so in shoes for o in (u, so)], *mantle, *trim, *[o for _, *items in tails for o in items]]
print('TRIS', sum(lib.tris(o) for o in parts), {o.name: lib.tris(o) for o in parts if lib.tris(o) > 2000})
# One skinned mesh: matte clay in vertex colours, glossy eyes and glasses, hair on its own.
body = lib.join(parts, 'VictorBody')
glossy = lib.material('clay_glossvc', '#ffffff', rough=0.2)
matte = lib.material('clay_vc', '#ffffff', rough=0.62)
lib.bake_vertex_colors(body, keep={'clay_hair', 'glass_lens'}, groups={'*': matte, 'clay_glasses': glossy, 'clay_eye': glossy, 'clay_pupil': glossy})
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
