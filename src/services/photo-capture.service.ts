import { BaseService } from "./base.service"
import type {
  PhotoCaptureSettings,
  CapturedPhoto,
  PhotoSession,
  PhotoProcessingOptions,
  PhotoMetadata,
} from "@/src/types/photo-capture"

export class PhotoCaptureService extends BaseService {
  private mediaStream: MediaStream | null = null
  private currentSession: PhotoSession | null = null

  async initializeCamera(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const defaultConstraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment", // Use back camera on mobile
          focusMode: "continuous",
          ...constraints?.video,
        },
        audio: false,
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia(defaultConstraints)
      return this.mediaStream
    } catch (error) {
      console.error("Failed to initialize camera:", error)
      throw new Error("Camera access denied or not available")
    }
  }

  async getCameraCapabilities(): Promise<MediaTrackCapabilities | null> {
    if (!this.mediaStream) return null

    const videoTrack = this.mediaStream.getVideoTracks()[0]
    return videoTrack?.getCapabilities() || null
  }

  async updateCameraSettings(settings: Partial<MediaTrackConstraints>): Promise<void> {
    if (!this.mediaStream) throw new Error("Camera not initialized")

    const videoTrack = this.mediaStream.getVideoTracks()[0]
    if (videoTrack) {
      await videoTrack.applyConstraints(settings)
    }
  }

  async capturePhoto(videoElement: HTMLVideoElement, settings: PhotoCaptureSettings): Promise<CapturedPhoto> {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Set canvas dimensions based on resolution
    const dimensions = this.getResolutionDimensions(settings.resolution)
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

    // Apply image processing
    if (settings.lighting !== "auto") {
      this.applyLightingAdjustments(ctx, canvas, settings.lighting)
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), this.getFormatMimeType(settings.format), settings.quality / 100)
    })

    // Create file from blob
    const file = new File([blob], `photo_${Date.now()}.${settings.format.toLowerCase()}`, {
      type: blob.type,
    })

    // Extract metadata
    const metadata = await this.extractMetadata(file, canvas)

    const capturedPhoto: CapturedPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: file,
      metadata,
      settings,
      timestamp: new Date().toISOString(),
    }

    return capturedPhoto
  }

  async processPhoto(photo: CapturedPhoto, options: PhotoProcessingOptions): Promise<CapturedPhoto> {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Load image
    const img = new Image()
    img.crossOrigin = "anonymous"

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Apply processing options
        if (options.autoEnhance) {
          this.applyAutoEnhance(ctx, canvas)
        }

        if (options.adjustLighting) {
          this.applyLightingCorrection(ctx, canvas)
        }

        if (options.sharpen) {
          this.applySharpen(ctx, canvas)
        }

        if (options.colorCorrection) {
          this.applyColorCorrection(ctx, canvas)
        }

        if (options.removeBackground) {
          await this.removeBackground(ctx, canvas)
        }

        if (options.watermark) {
          this.applyWatermark(ctx, canvas, options.watermark)
        }

        // Convert processed image to blob
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error("Failed to process image"))
              return
            }

            const processedFile = new File([blob], photo.originalFile.name, {
              type: blob.type,
            })

            // Upload processed image and get URL
            const processedUrl = await this.uploadPhoto(processedFile)
            const thumbnailUrl = await this.generateThumbnail(processedFile)

            resolve({
              ...photo,
              processedUrl,
              thumbnailUrl,
            })
          },
          photo.originalFile.type,
          photo.settings.quality / 100,
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(photo.originalFile)
    })
  }

  async createPhotoSession(itemType: string, itemId: number): Promise<PhotoSession> {
    const session: PhotoSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemType: itemType as any,
      itemId,
      photos: [],
      settings: this.getDefaultSettings(),
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.currentSession = session
    return session
  }

  async addPhotoToSession(sessionId: string, photo: CapturedPhoto): Promise<PhotoSession> {
    if (!this.currentSession || this.currentSession.id !== sessionId) {
      throw new Error("Invalid session")
    }

    this.currentSession.photos.push(photo)
    this.currentSession.updatedAt = new Date().toISOString()

    return this.currentSession
  }

  async completeSession(sessionId: string): Promise<PhotoSession> {
    if (!this.currentSession || this.currentSession.id !== sessionId) {
      throw new Error("Invalid session")
    }

    this.currentSession.status = "completed"
    this.currentSession.updatedAt = new Date().toISOString()

    // Save session to backend
    await this.post("/photo-sessions", this.currentSession)

    const completedSession = this.currentSession
    this.currentSession = null
    return completedSession
  }

  async uploadPhoto(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("photo", file)

    const response = await fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload photo")
    }

    const { url } = await response.json()
    return url
  }

  async generateThumbnail(file: File, size = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        const aspectRatio = img.width / img.height
        canvas.width = size
        canvas.height = size / aspectRatio

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to generate thumbnail"))
              return
            }

            const thumbnailFile = new File([blob], `thumb_${file.name}`, {
              type: "image/jpeg",
            })

            this.uploadPhoto(thumbnailFile).then(resolve).catch(reject)
          },
          "image/jpeg",
          0.8,
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }
  }

  private getResolutionDimensions(resolution: string) {
    const resolutions = {
      "720p": { width: 1280, height: 720 },
      "1080p": { width: 1920, height: 1080 },
      "4K": { width: 3840, height: 2160 },
      "8K": { width: 7680, height: 4320 },
    }
    return resolutions[resolution as keyof typeof resolutions] || resolutions["1080p"]
  }

  private getFormatMimeType(format: string): string {
    const mimeTypes = {
      JPEG: "image/jpeg",
      PNG: "image/png",
      WEBP: "image/webp",
      RAW: "image/raw",
    }
    return mimeTypes[format as keyof typeof mimeTypes] || "image/jpeg"
  }

  private async extractMetadata(file: File, canvas: HTMLCanvasElement): Promise<PhotoMetadata> {
    return {
      width: canvas.width,
      height: canvas.height,
      fileSize: file.size,
      deviceInfo: {
        camera: "Web Camera",
        iso: 100,
        aperture: "f/2.8",
        shutterSpeed: "1/60",
        focalLength: "24mm",
      },
    }
  }

  private applyLightingAdjustments(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mode: string): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    let adjustment = { r: 1, g: 1, b: 1 }

    switch (mode) {
      case "daylight":
        adjustment = { r: 1.1, g: 1.0, b: 0.9 }
        break
      case "tungsten":
        adjustment = { r: 0.8, g: 0.9, b: 1.2 }
        break
      case "fluorescent":
        adjustment = { r: 0.9, g: 1.1, b: 1.0 }
        break
    }

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * adjustment.r) // Red
      data[i + 1] = Math.min(255, data[i + 1] * adjustment.g) // Green
      data[i + 2] = Math.min(255, data[i + 2] * adjustment.b) // Blue
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private applyAutoEnhance(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    // Apply basic auto-enhancement (contrast, brightness)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Increase contrast slightly
      data[i] = Math.min(255, (data[i] - 128) * 1.1 + 128)
      data[i + 1] = Math.min(255, (data[i + 1] - 128) * 1.1 + 128)
      data[i + 2] = Math.min(255, (data[i + 2] - 128) * 1.1 + 128)
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private applyLightingCorrection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    // Apply gamma correction for better lighting
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const gamma = 1.2

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.pow(data[i] / 255, 1 / gamma) * 255
      data[i + 1] = Math.pow(data[i + 1] / 255, 1 / gamma) * 255
      data[i + 2] = Math.pow(data[i + 2] / 255, 1 / gamma) * 255
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private applySharpen(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    // Apply unsharp mask filter
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height

    const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]

    const newData = new Uint8ClampedArray(data)

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c
              sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
            }
          }
          const idx = (y * width + x) * 4 + c
          newData[idx] = Math.max(0, Math.min(255, sum))
        }
      }
    }

    const newImageData = new ImageData(newData, width, height)
    ctx.putImageData(newImageData, 0, 0)
  }

  private applyColorCorrection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    // Apply basic color correction
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Slight color balance adjustment
      data[i] = Math.min(255, data[i] * 1.05) // Red
      data[i + 1] = Math.min(255, data[i + 1] * 1.0) // Green
      data[i + 2] = Math.min(255, data[i + 2] * 0.95) // Blue
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private async removeBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): Promise<void> {
    // Simple background removal (would use AI in production)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Simple edge detection and background removal
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // If pixel is close to white/gray background, make it transparent
      if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = 0 // Make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private applyWatermark(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    watermark: { text: string; position: string; opacity: number },
  ): void {
    ctx.save()
    ctx.globalAlpha = watermark.opacity
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "16px Arial"

    const textMetrics = ctx.measureText(watermark.text)
    let x = 10,
      y = 30

    switch (watermark.position) {
      case "top-right":
        x = canvas.width - textMetrics.width - 10
        y = 30
        break
      case "bottom-left":
        x = 10
        y = canvas.height - 10
        break
      case "bottom-right":
        x = canvas.width - textMetrics.width - 10
        y = canvas.height - 10
        break
      case "center":
        x = (canvas.width - textMetrics.width) / 2
        y = canvas.height / 2
        break
    }

    ctx.fillText(watermark.text, x, y)
    ctx.restore()
  }

  private getDefaultSettings(): PhotoCaptureSettings {
    return {
      resolution: "1080p",
      format: "JPEG",
      quality: 90,
      lighting: "auto",
      background: "white",
      gridLines: true,
      autoFocus: true,
      flashMode: "auto",
      stabilization: true,
    }
  }
}

// Export the service instance
export const photoCaptureService = new PhotoCaptureService()
