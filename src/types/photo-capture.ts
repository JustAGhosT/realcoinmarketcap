export interface PhotoCaptureSettings {
  resolution: PhotoResolution
  format: PhotoFormat
  quality: number // 0-100
  lighting: LightingMode
  background: BackgroundType
  gridLines: boolean
  autoFocus: boolean
  flashMode: FlashMode
  stabilization: boolean
}

export type PhotoResolution = "720p" | "1080p" | "4K" | "8K"
export type PhotoFormat = "JPEG" | "PNG" | "WEBP" | "RAW"
export type LightingMode = "auto" | "daylight" | "tungsten" | "fluorescent" | "custom"
export type BackgroundType = "white" | "black" | "gray" | "transparent" | "custom"
export type FlashMode = "auto" | "on" | "off" | "fill"

export interface CapturedPhoto {
  id: string
  originalFile: File
  processedUrl?: string
  thumbnailUrl?: string
  metadata: PhotoMetadata
  settings: PhotoCaptureSettings
  timestamp: string
}

export interface PhotoMetadata {
  width: number
  height: number
  fileSize: number
  deviceInfo?: {
    camera: string
    lens?: string
    iso?: number
    aperture?: string
    shutterSpeed?: string
    focalLength?: string
  }
  location?: {
    latitude: number
    longitude: number
  }
  lighting?: {
    colorTemperature: number
    brightness: number
    contrast: number
  }
}

export interface PhotoSession {
  id: string
  itemType: "stamp" | "coin" | "banknote" | "cover"
  itemId: number
  photos: CapturedPhoto[]
  settings: PhotoCaptureSettings
  status: "active" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface PhotoProcessingOptions {
  autoEnhance: boolean
  removeBackground: boolean
  adjustLighting: boolean
  sharpen: boolean
  colorCorrection: boolean
  watermark?: {
    text: string
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
    opacity: number
  }
}
