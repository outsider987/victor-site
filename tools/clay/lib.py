"""Shared helpers for building the clay assets in Blender (run headless).

Everything here is procedural so the models can be rebuilt from source:
    blender --background --factory-startup --python character.py -- <out_dir>
"""
import math
import os
import random
import sys

import bpy
import bmesh
from mathutils import Euler, Matrix, Quaternion, Vector


def args():
    return sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.render.fps = 24


def srgb(hex_color):
    """'#rrggbb' -> linear RGB tuple for Blender colour sockets."""
    h = hex_color.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((v / 12.92) if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c)


def material(name, color, rough=0.62, metal=0.0, sss=0.0, emit=None, emit_strength=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    nodes = m.node_tree.nodes
    bsdf = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
    bsdf.inputs['Base Color'].default_value = (*srgb(color), 1)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if sss:
        bsdf.inputs['Subsurface Weight'].default_value = sss
        bsdf.inputs['Subsurface Radius'].default_value = (0.3, 0.12, 0.08)
    if emit:
        bsdf.inputs['Emission Color'].default_value = (*srgb(emit), 1)
        bsdf.inputs['Emission Strength'].default_value = emit_strength
    m.diffuse_color = (*srgb(color), 1)
    return m


def link(obj, collection=None):
    (collection or bpy.context.scene.collection).objects.link(obj)
    return obj


def activate(obj):
    for o in bpy.context.view_layer.objects:
        o.select_set(False)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)


def assign(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj


def metaball(name, elements, resolution=0.018, threshold=0.6):
    """Blend simple volumes like pressed clay. elements: dicts with type, co, r, size, rot, stiff, neg."""
    mb = bpy.data.metaballs.new(name + '_mb')
    mb.resolution = resolution
    mb.render_resolution = resolution
    mb.threshold = threshold
    obj = link(bpy.data.objects.new(name, mb))
    for e in elements:
        el = mb.elements.new(type=e.get('type', 'BALL'))
        el.co = Vector(e['co'])
        el.radius = e.get('r', 0.2)
        el.stiffness = e.get('stiff', 2.0)
        el.use_negative = e.get('neg', False)
        if 'size' in e:
            sx, sy, sz = e['size']
            el.size_x, el.size_y, el.size_z = sx, sy, sz
        if 'rot' in e:
            el.rotation = Euler(e['rot']).to_quaternion()
    activate(obj)
    bpy.ops.object.convert(target='MESH')
    mesh = bpy.context.view_layer.objects.active
    mesh.name = name
    return mesh


def prim(kind, name, loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1), **kw):
    ops = {
        'sphere': bpy.ops.mesh.primitive_uv_sphere_add,
        'ico': bpy.ops.mesh.primitive_ico_sphere_add,
        'cube': bpy.ops.mesh.primitive_cube_add,
        'cyl': bpy.ops.mesh.primitive_cylinder_add,
        'cone': bpy.ops.mesh.primitive_cone_add,
        'torus': bpy.ops.mesh.primitive_torus_add,
        'plane': bpy.ops.mesh.primitive_plane_add,
    }
    ops[kind](location=loc, rotation=rot, **kw)
    o = bpy.context.view_layer.objects.active
    o.name = name
    o.scale = scale
    return o


def apply_transform(obj, location=True):
    activate(obj)
    bpy.ops.object.transform_apply(location=location, rotation=True, scale=True)
    return obj


def modifier(obj, kind, apply=True, **props):
    m = obj.modifiers.new(kind.lower(), kind)
    for k, v in props.items():
        setattr(m, k, v)
    if apply:
        activate(obj)
        bpy.ops.object.modifier_apply(modifier=m.name)
    return obj


def soften(obj, bevel=0.0, subdiv=2, smooth=True):
    """Round a hard primitive into a pressed-clay form."""
    apply_transform(obj)
    if bevel:
        modifier(obj, 'BEVEL', width=bevel, segments=3, limit_method='ANGLE')
    if subdiv:
        modifier(obj, 'SUBSURF', levels=subdiv, render_levels=subdiv)
    if smooth:
        shade_smooth(obj)
    return obj


def shade_smooth(obj):
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


_tex_cache = {}


def lumps(obj, strength=0.012, size=0.18, seed=0):
    """Hand-pressed unevenness: low-frequency displacement along normals."""
    key = (size, seed)
    tex = _tex_cache.get(key)
    if tex is None:
        tex = bpy.data.textures.new(f'lumps_{size}_{seed}', 'CLOUDS')
        tex.noise_scale = size
        tex.noise_depth = 1
        tex.noise_basis = 'ORIGINAL_PERLIN'
        _tex_cache[key] = tex
    m = obj.modifiers.new('lumps', 'DISPLACE')
    m.texture = tex
    m.strength = strength
    m.mid_level = 0.5
    m.texture_coords = 'OBJECT' if False else 'LOCAL'
    activate(obj)
    bpy.ops.object.modifier_apply(modifier=m.name)
    return obj


def remesh_smooth(obj, voxel=0.012, smooth_iter=6, factor=0.6):
    modifier(obj, 'REMESH', mode='VOXEL', voxel_size=voxel, use_smooth_shade=True)
    modifier(obj, 'SMOOTH', factor=factor, iterations=smooth_iter)
    return shade_smooth(obj)


def decimate(obj, ratio):
    if ratio < 1:
        modifier(obj, 'DECIMATE', ratio=ratio)
    return obj


def join(objs, name):
    activate(objs[0])
    for o in objs[1:]:
        o.select_set(True)
    bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    o.name = name
    return o


def tris(obj):
    return sum(len(p.vertices) - 2 for p in obj.data.polygons)


def point_segment_distance(p, a, b):
    ab = b - a
    t = max(0.0, min(1.0, (p - a).dot(ab) / max(ab.length_squared, 1e-9)))
    return (a + ab * t - p).length


def weight_by_bones(mesh, rig, bones, power=6.0, rigid=None):
    """Skin a mesh by proximity to bone segments, blending the two nearest.

    bones: bone names that may influence this mesh. rigid: bind wholly to one bone.
    """
    mw = mesh.matrix_world
    arm = rig.data
    segs = {b: (rig.matrix_world @ arm.bones[b].head_local, rig.matrix_world @ arm.bones[b].tail_local) for b in bones}
    groups = {b: mesh.vertex_groups.get(b) or mesh.vertex_groups.new(name=b) for b in bones}
    for v in mesh.data.vertices:
        if rigid:
            groups[rigid].add([v.index], 1.0, 'REPLACE')
            continue
        p = mw @ v.co
        ds = sorted(((point_segment_distance(p, *segs[b]), b) for b in bones))[:2]
        w = [1.0 / (max(d, 1e-4) ** power) for d, _ in ds]
        s = sum(w)
        for (d, b), wi in zip(ds, w):
            groups[b].add([v.index], wi / s, 'REPLACE')
    mesh.parent = rig
    mod = mesh.modifiers.new('rig', 'ARMATURE')
    mod.object = rig
    return mesh


def key_pose(rig, frame, pose):
    """pose: {bone: {'rot': (x,y,z) degrees, 'loc': (x,y,z)}}"""
    for bname, v in pose.items():
        pb = rig.pose.bones[bname]
        pb.rotation_mode = 'XYZ'
        if 'rot' in v:
            pb.rotation_euler = Euler([math.radians(a) for a in v['rot']])
            pb.keyframe_insert('rotation_euler', frame=frame)
        if 'loc' in v:
            pb.location = Vector(v['loc'])
            pb.keyframe_insert('location', frame=frame)
        if 'scale' in v:
            pb.scale = Vector(v['scale'])
            pb.keyframe_insert('scale', frame=frame)


def new_action(rig, name):
    rig.animation_data_create()
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    rig.animation_data.action = act
    return act


def push_to_nla(rig, act):
    track = rig.animation_data.nla_tracks.new()
    track.name = act.name
    strip = track.strips.new(act.name, int(act.frame_range[0]), act)
    strip.name = act.name
    track.mute = True
    rig.animation_data.action = None


def bake_vertex_colors(obj, keep, groups):
    """Collapse plain clay materials into vertex colours to cut draw calls.

    keep: material names that stay separate slots. groups: {material name: target material}
    for materials that merge into a different vertex-colour material (e.g. glossy parts)."""
    me = obj.data
    attr = me.color_attributes.get('Col') or me.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER')
    me.color_attributes.active_color = attr
    slots = [s.material for s in obj.material_slots]
    default_vc = groups['*']
    targets = []
    for m in slots:
        if m is None:
            targets.append(default_vc)
        elif m.name in keep:
            targets.append(m)
        else:
            targets.append(groups.get(m.name, default_vc))
    new_mats = list(dict.fromkeys(targets))
    remap = []
    for poly in me.polygons:
        m = slots[poly.material_index] if poly.material_index < len(slots) else None
        col = (*m.diffuse_color[:3], 1.0) if m is not None else (1.0, 1.0, 1.0, 1.0)
        for li in poly.loop_indices:
            attr.data[li].color = col
        remap.append(new_mats.index(targets[poly.material_index] if poly.material_index < len(targets) else default_vc))
    # Clearing the slots resets every polygon to slot 0, so indices are written after the new slots exist.
    me.materials.clear()
    for m in new_mats:
        me.materials.append(m)
    for poly, idx in zip(me.polygons, remap):
        poly.material_index = idx
    return obj


def export_glb(path, objects=None, animations=True):
    if objects is not None:
        for o in bpy.context.view_layer.objects:
            o.select_set(o in objects)
    kw = dict(
        filepath=path,
        export_format='GLB',
        use_selection=objects is not None,
        export_apply=True,
        export_yup=True,
        export_animations=animations,
        export_extras=True,
        export_vertex_color='ACTIVE',
    )
    if animations:
        kw.update(export_animation_mode='NLA_TRACKS', export_force_sampling=True, export_frame_step=1)
    bpy.ops.export_scene.gltf(**kw)


def preview(path, target=(0, 0, 1), dist=4.2, yaw=25, pitch=8, size=(900, 900), lens=55, focus_obj=None):
    """Quick EEVEE portrait for checking a model."""
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x, scene.render.resolution_y = size
    scene.render.film_transparent = False
    world = bpy.data.worlds.get('preview') or bpy.data.worlds.new('preview')
    scene.world = world
    bg = world.node_tree.nodes.get('Background')
    bg.inputs['Color'].default_value = (*srgb('#2a6b72'), 1)
    bg.inputs['Strength'].default_value = 0.6
    cam = bpy.data.objects.get('PreviewCam')
    if cam is None:
        cam = link(bpy.data.objects.new('PreviewCam', bpy.data.cameras.new('PreviewCam')))
        key = link(bpy.data.objects.new('Key', bpy.data.lights.new('Key', 'AREA')))
        key.data.energy = 900
        key.data.size = 3
        key.location = (3.2, -3.5, 4.2)
        key.rotation_euler = Euler((math.radians(52), 0, math.radians(40)))
        rim = link(bpy.data.objects.new('Rim', bpy.data.lights.new('Rim', 'AREA')))
        rim.data.energy = 500
        rim.data.size = 2
        rim.data.color = srgb('#b9e6ff')
        rim.location = (-3, 3, 3.5)
        rim.rotation_euler = Euler((math.radians(-50), 0, math.radians(-140)))
    cam.data.lens = lens
    t = Vector(target)
    y, p = math.radians(yaw), math.radians(pitch)
    cam.location = t + Vector((math.sin(y) * math.cos(p), -math.cos(y) * math.cos(p), math.sin(p))) * dist
    direction = t - cam.location
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    scene.camera = cam
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
