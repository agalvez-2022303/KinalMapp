import { mapPOIs } from './kinal-data'

export interface TestCheckpointQR {
  id: string
  label: string
  description: string
}

/** Checkpoints validos para el escaner (texto plano del QR) */
export const TEST_CHECKPOINTS: TestCheckpointQR[] = mapPOIs
  .filter((p) => p.type === 'checkpoint' && p.checkpointId)
  .map((p) => ({
    id: p.checkpointId!,
    label: p.label,
    description: p.description,
  }))
