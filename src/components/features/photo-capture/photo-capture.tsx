"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { photoCaptureService } from "@/src/services/photo-capture.service"
import type { PhotoCaptureSettings, CapturedPhoto, PhotoSession } from "@/src/types/photo-capture"
import styles from "./photo-capture.module.css"

interface PhotoCaptureProps {
  itemType: "stamp" | "coin" | "banknote" | "cover"
  itemId: number
  onPhotosCapture?: (photos: CapturedPhoto[]) => void
  onClose?: () => void
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ itemType, itemId, onPhotosCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [session, setSession] = useState<PhotoSession | null>(null)
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([])
  const [settings, setSettings] = useState<PhotoCaptureSettings>({
    resolution: "1080p",
    format: "JPEG",
    quality: 90,
    lighting: "auto",
    background: "white",
    gridLines: true,
    autoFocus: true,
    flashMode: "auto",
    stabilization: true,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeCamera()
    return () => {
      photoCaptureService.stopCamera()
    }
  }, [])

  const initializeCamera = async () => {
    try {
      setError(null)
      const stream = await photoCaptureService.initializeCamera()

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsInitialized(true)

        // Create photo session
        const newSession = await photoCaptureService.createPhotoSession(itemType, itemId)
        setSession(newSession)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize camera")
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !session) return

    try {
      setIsCapturing(true)
      const photo = await photoCaptureService.capturePhoto(videoRef.current, settings)

      // Add to session
      const updatedSession = await photoCaptureService.addPhotoToSession(session.id, photo)
      setSession(updatedSession)
      setCapturedPhotos((prev) => [...prev, photo])

      // Flash effect
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")!
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }, 100)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to capture photo")
    } finally {
      setIsCapturing(false)
    }
  }

  const deletePhoto = (photoId: string) => {
    setCapturedPhotos((prev) => prev.filter((p) => p.id !== photoId))
    if (session) {
      setSession({
        ...session,
        photos: session.photos.filter((p) => p.id !== photoId),
      })
    }
  }

  const completeSession = async () => {
    if (!session) return

    try {
      const completedSession = await photoCaptureService.completeSession(session.id)
      onPhotosCapture?.(completedSession.photos)
      onClose?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete session")
    }
  }

  const updateSettings = (newSettings: Partial<PhotoCaptureSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>Camera Error</h3>
        <p>{error}</p>
        <button onClick={initializeCamera} className={styles.retryButton}>
          Retry
        </button>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.photoCapture}>
      <div className={styles.header}>
        <h2>Photo Capture - {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</h2>
        <div className={styles.headerActions}>
          <button onClick={() => setShowSettings(!showSettings)} className={styles.settingsButton}>
            ⚙️ Settings
          </button>
          {onClose && (
            <button onClick={onClose} className={styles.closeButton}>
              ✕
            </button>
          )}
        </div>
      </div>

      {showSettings && (
        <SettingsPanel settings={settings} onUpdate={updateSettings} onClose={() => setShowSettings(false)} />
      )}

      <div className={styles.cameraContainer}>
        <div className={styles.videoWrapper}>
          <video ref={videoRef} className={styles.video} autoPlay playsInline muted />

          {settings.gridLines && (
            <div className={styles.gridOverlay}>
              <div className={styles.gridLine} style={{ left: "33.33%" }} />
              <div className={styles.gridLine} style={{ left: "66.66%" }} />
              <div className={styles.gridLine} style={{ top: "33.33%" }} />
              <div className={styles.gridLine} style={{ top: "66.66%" }} />
            </div>
          )}

          <canvas ref={canvasRef} className={styles.flashOverlay} width={1920} height={1080} />

          <div className={styles.cameraControls}>
            <button onClick={capturePhoto} disabled={!isInitialized || isCapturing} className={styles.captureButton}>
              {isCapturing ? "📸" : "⚪"}
            </button>
          </div>
        </div>

        <div className={styles.photoPreview}>
          <h3>Captured Photos ({capturedPhotos.length})</h3>
          <div className={styles.photoGrid}>
            {capturedPhotos.map((photo) => (
              <PhotoPreviewItem key={photo.id} photo={photo} onDelete={() => deletePhoto(photo.id)} />
            ))}
          </div>

          {capturedPhotos.length > 0 && (
            <div className={styles.sessionActions}>
              <button onClick={completeSession} className={styles.completeButton}>
                Complete Session ({capturedPhotos.length} photos)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface SettingsPanelProps {
  settings: PhotoCaptureSettings
  onUpdate: (settings: Partial<PhotoCaptureSettings>) => void
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onClose }) => {
  return (
    <div className={styles.settingsPanel}>
      <div className={styles.settingsHeader}>
        <h3>Camera Settings</h3>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingGroup}>
          <label>Resolution</label>
          <select value={settings.resolution} onChange={(e) => onUpdate({ resolution: e.target.value as any })}>
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
            <option value="4K">4K</option>
            <option value="8K">8K</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label>Format</label>
          <select value={settings.format} onChange={(e) => onUpdate({ format: e.target.value as any })}>
            <option value="JPEG">JPEG</option>
            <option value="PNG">PNG</option>
            <option value="WEBP">WEBP</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label>Quality ({settings.quality}%)</label>
          <input
            type="range"
            min="50"
            max="100"
            value={settings.quality}
            onChange={(e) => onUpdate({ quality: Number.parseInt(e.target.value) })}
          />
        </div>

        <div className={styles.settingGroup}>
          <label>Lighting</label>
          <select value={settings.lighting} onChange={(e) => onUpdate({ lighting: e.target.value as any })}>
            <option value="auto">Auto</option>
            <option value="daylight">Daylight</option>
            <option value="tungsten">Tungsten</option>
            <option value="fluorescent">Fluorescent</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label>Background</label>
          <select value={settings.background} onChange={(e) => onUpdate({ background: e.target.value as any })}>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="gray">Gray</option>
          </select>
        </div>

        <div className={styles.settingGroup}>
          <label>
            <input
              type="checkbox"
              checked={settings.gridLines}
              onChange={(e) => onUpdate({ gridLines: e.target.checked })}
            />
            Grid Lines
          </label>
        </div>

        <div className={styles.settingGroup}>
          <label>
            <input
              type="checkbox"
              checked={settings.autoFocus}
              onChange={(e) => onUpdate({ autoFocus: e.target.checked })}
            />
            Auto Focus
          </label>
        </div>

        <div className={styles.settingGroup}>
          <label>
            <input
              type="checkbox"
              checked={settings.stabilization}
              onChange={(e) => onUpdate({ stabilization: e.target.checked })}
            />
            Stabilization
          </label>
        </div>
      </div>
    </div>
  )
}

interface PhotoPreviewItemProps {
  photo: CapturedPhoto
  onDelete: () => void
}

const PhotoPreviewItem: React.FC<PhotoPreviewItemProps> = ({ photo, onDelete }) => {
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    const url = URL.createObjectURL(photo.originalFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [photo.originalFile])

  return (
    <div className={styles.photoPreviewItem}>
      <img src={imageUrl || "/placeholder.svg"} alt="Captured photo" className={styles.previewImage} />
      <div className={styles.photoInfo}>
        <span className={styles.photoSize}>{(photo.originalFile.size / 1024 / 1024).toFixed(1)}MB</span>
        <span className={styles.photoDimensions}>
          {photo.metadata.width}×{photo.metadata.height}
        </span>
      </div>
      <button onClick={onDelete} className={styles.deleteButton}>
        🗑️
      </button>
    </div>
  )
}
