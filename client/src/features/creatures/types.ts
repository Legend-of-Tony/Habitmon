import type { EAR_VARIANTS, HABITMON_PALETTES, HORN_VARIANTS, TAIL_VARIANTS } from '../../threeJS/habitmonConfig'
export type Creature = {
  id: number
  user_id: number
  xp: number
  ear_variant: keyof typeof EAR_VARIANTS
  tail_variant: keyof typeof TAIL_VARIANTS | null
  horn_variant: keyof typeof HORN_VARIANTS | null
  palette_variant: keyof typeof HABITMON_PALETTES
  eye_index: number
  mouth_index: number
  created_at: string
  updated_at: string
}
