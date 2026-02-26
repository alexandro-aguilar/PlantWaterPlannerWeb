import type { PlantIdentification } from '../services/identifyService'

export type IdentifyResultLocationState = {
  plant: PlantIdentification
  imageFile: File
  fileName: string
}
