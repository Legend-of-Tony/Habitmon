import creatureUrl from '../assets/models/baby-habitmon.glb?url'
import roomUrl from '../assets/models/habitmon_room.glb?url'
import eyesUrl from '../assets/textures/habitmon_eyes.png?url'
import mouthsUrl from '../assets/textures/habitmon_mouths.png?url'
export const HABITMON_ASSETS = { creatureUrl, roomUrl, eyesUrl, mouthsUrl }
export const ATLAS_COLUMNS = 4
export const ATLAS_ROWS = 4
export const SPAWN_NODE = 'HabitmonSpawn'
export const EAR_VARIANTS = { ear_1: ['ear_1'], ear_2: ['ear_2'], ear_3: ['ear_3'] } as const
export const TAIL_VARIANTS = { tail_1: ['tail_1'], tail_2: ['tail_2'] } as const
export const HORN_VARIANTS = { horn_1: ['horn_1'] } as const
export const HABITMON_PALETTES = {
  ocean: { primary: '#2dd1e7', accent: '#e7e7e7' },
  berry: { primary: '#db70bd', accent: '#f8d9ed' },
  moss: { primary: '#7bc66a', accent: '#dff0ad' },
  sunset: { primary: '#f28c52', accent: '#ffe0a3' },
  lavender: { primary: '#9b83e3', accent: '#eadcff' },
} as const
export const PALETTE_MATERIALS = {
  primary: ['body', 'Ear'],
  accent: ['Accent'],
} as const
// Material names avoid GLTFLoader's renaming of duplicate mouth nodes.
export const FACE_MATERIALS = { eyes: 'eye', mouth: 'mouth' } as const
// Current GLB face UVs occupy a single cell-sized region. Disable after
// re-exporting face planes with full 0–1 UVs.
export const NORMALIZE_FACE_UVS = true
