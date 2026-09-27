"""Clay UI bead: one hand-rolled ball of white plasticine on transparent film, exported as ui-bead.png.

The page tints it per use (bead colours, tag pins, the loader, the scroll cue) by multiplying a
colour through it, so every small sphere on the page is the same rendered clay as the set.

    blender --background --factory-startup --python ui.py -- <out_dir>
"""
import math
import os
import sys

import bpy
from mathutils import Euler

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402

out_dir = lib.args()[0] if lib.args() else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
os.makedirs(out_dir, exist_ok=True)
lib.reset()

# A ball rolled between the palms: slightly squashed, never quite round.
bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=1.0)
ball = bpy.context.active_object
ball.name = 'Bead'
ball.scale = (1.0, 0.97, 0.92)
lib.apply_transform(ball)
lib.lumps(ball, strength=0.035, size=0.45, seed=3)
lib.lumps(ball, strength=0.012, size=0.16, seed=8)
lib.soften(ball, subdiv=1)

# White clay: matte, a touch of sheen, fingerprint dimples in the bump.
mat = lib.material('ui_clay', '#f1ece4', rough=0.66, sss=0.05)
nodes, links = mat.node_tree.nodes, mat.node_tree.links
bsdf = nodes.get('Principled BSDF')
bsdf.inputs['Sheen Weight'].default_value = 0.25
coord = nodes.new('ShaderNodeTexCoord')
prints = nodes.new('ShaderNodeTexWave')
prints.wave_type = 'RINGS'
prints.inputs['Scale'].default_value = 3.2
prints.inputs['Distortion'].default_value = 6.0
prints.inputs['Detail'].default_value = 2.0
dents = nodes.new('ShaderNodeTexNoise')
dents.inputs['Scale'].default_value = 9.0
dents.inputs['Detail'].default_value = 3.0
mix = nodes.new('ShaderNodeMix')
mix.data_type = 'FLOAT'
mix.inputs['Factor'].default_value = 0.35
bump = nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = 0.22
bump.inputs['Distance'].default_value = 0.03
links.new(coord.outputs['Object'], prints.inputs['Vector'])
links.new(coord.outputs['Object'], dents.inputs['Vector'])
links.new(dents.outputs['Fac'], mix.inputs['A'])
links.new(prints.outputs['Fac'], mix.inputs['B'])
links.new(mix.outputs['Result'], bump.inputs['Height'])
links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
lib.assign(ball, mat)

# Warm key from the upper left, a cool fill, a thin rim: the set's own light.
def area(name, energy, size, loc, rot, color='#ffffff'):
    light = lib.link(bpy.data.objects.new(name, bpy.data.lights.new(name, 'AREA')))
    light.data.energy = energy
    light.data.size = size
    light.data.color = lib.srgb(color)
    light.location = loc
    light.rotation_euler = Euler([math.radians(a) for a in rot])
    return light

area('Key', 260, 2.5, (-2.6, -3.2, 3.0), (48, 0, -38), '#ffe2c2')
area('Fill', 70, 3.0, (3.4, -2.6, 0.4), (84, 0, 52), '#cfe3ff')
area('Rim', 90, 1.5, (1.4, 3.0, 2.4), (-52, 0, 155), '#fff4e0')

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = scene.render.resolution_y = 256
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'Standard'
world = bpy.data.worlds.new('ui')
scene.world = world
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.32, 0.3, 0.3, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.55

cam = lib.link(bpy.data.objects.new('Cam', bpy.data.cameras.new('Cam')))
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 2.28
cam.location = (0, -6, 0)
cam.rotation_euler = Euler((math.radians(90), 0, 0))
scene.camera = cam

scene.render.filepath = os.path.join(out_dir, 'ui-bead.png')
bpy.ops.render.render(write_still=True)
print('rendered', scene.render.filepath)
