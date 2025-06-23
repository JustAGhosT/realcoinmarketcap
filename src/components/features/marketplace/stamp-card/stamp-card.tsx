"use client"

import type React from "react"
import { useState } from "react"
import type { Stamp } from "@/src/types/stamps"
import { useCollection } from "@/src/hooks/use-collection"
import styles from "./stamp-card.module.css"

interface StampCardProps {
  stamp: Stamp
  showAddToCollection?: boolean
}

export const StampCard: React.FC<StampCardProps> = ({ stamp, showAddToCollection = false }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const { addToCollection, loading } = useCollection()

  const handleAddToCollection = async (condition: string, purchasePrice?: number) => {
    try {
      await addToCollection({
        stampId: stamp.id,
        condition: condition as any,
        quantity: 1,
        purchasePrice,
        notes: "",
      })
      setShowAddModal(false)
    } catch (error) {
      console.error("Failed to add to collection:", error)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "very_rare":
        return "#dc2626"
      case "rare":
        return "#ea580c"
      case "uncommon":
        return "#d97706"
      case "common":
        return "#059669"
      default:
        return "#6b7280"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {stamp.imageUrl ? (
          <img src={stamp.imageUrl || "/placeholder.svg"} alt={stamp.title} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span>📮</span>
            <p>No Image</p>
          </div>
        )}
        <div className={styles.rarityBadge} style={{ backgroundColor: getRarityColor(stamp.rarityLevel) }}>
          {stamp.rarityLevel.replace("_", " ").toUpperCase()}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{stamp.title}</h3>
          {stamp.saccNumber && <span className={styles.saccNumber}>SACC {stamp.saccNumber}</span>}
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Issue Date:</span>
            <span>{formatDate(stamp.issueDate)}</span>
          </div>

          {stamp.faceValue && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Face Value:</span>
              <span>R{stamp.faceValue.toFixed(2)}</span>
            </div>
          )}

          {stamp.category && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Category:</span>
              <span>{stamp.category.name}</span>
            </div>
          )}

          {stamp.seriesName && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Series:</span>
              <span>{stamp.seriesName}</span>
            </div>
          )}
        </div>

        {stamp.description && <p className={styles.description}>{stamp.description}</p>}

        {showAddToCollection && (
          <div className={styles.actions}>
            <button onClick={() => setShowAddModal(true)} className={styles.addButton} disabled={loading}>
              {loading ? "Adding..." : "Add to Collection"}
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddToCollectionModal
          stamp={stamp}
          onAdd={handleAddToCollection}
          onClose={() => setShowAddModal(false)}
          loading={loading}
        />
      )}
    </div>
  )
}

interface AddToCollectionModalProps {
  stamp: Stamp
  onAdd: (condition: string, purchasePrice?: number) => void
  onClose: () => void
  loading: boolean
}

const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ stamp, onAdd, onClose, loading }) => {
  const [condition, setCondition] = useState("very_fine")
  const [purchasePrice, setPurchasePrice] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(condition, purchasePrice ? Number.parseFloat(purchasePrice) : undefined)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Add to Collection</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="condition">Condition:</label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={styles.select}
            >
              <option value="mint">Mint</option>
              <option value="very_fine">Very Fine</option>
              <option value="fine">Fine</option>
              <option value="good">Good</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="purchasePrice">Purchase Price (optional):</label>
            <input
              type="number"
              id="purchasePrice"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={styles.input}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Adding..." : "Add to Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
