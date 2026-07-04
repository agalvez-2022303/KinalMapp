import { getAllCheckpoints } from './kinal-data'

export interface TestCheckpointQR {
  id: string
  label: string
  description: string
}

/** Checkpoints validos para el escaner (texto plano del QR) */
export const TEST_CHECKPOINTS: TestCheckpointQR[] = getAllCheckpoints()
