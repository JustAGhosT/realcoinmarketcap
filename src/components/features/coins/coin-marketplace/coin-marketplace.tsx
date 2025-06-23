"use client"

import type React from "react"
import { useState } from "react"
import { CoinCard } from "../coin-card/coin-card"
import { PhotoCapture } from "../../photo-capture/photo-capture"
import { useCoins } from "@/src/hooks/use-coins"
import { useAuth } from "@/src/hooks/use-auth"
import styles from "./coin-marketplace.module.css"

export const CoinMarketplace: React.FC = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    category: "",
    rarity: "",
    yearFrom: "",
    yearTo: "",
    page: 1,
  })
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)
  const [selectedCoinForPhoto, setSelectedCoinForPhoto] = useState<number | null>(null)

  const { coins, loading, error, pagination } = useCoins(filters)

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handlePhotoCapture = (coinId: number) => {
    setSelectedCoinForPhoto(coinId)
    setShowPhotoCapture(true)
  }

  const handlePhotosComplete = (photos: any[]) => {
    console.log("Photos captured:", photos)
    setShowPhotoCapture(false)
    setSelectedCoinForPhoto(null)
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error Loading Coins</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.marketplace}>
      <div className={styles.header}>
        <h1>Coin Marketplace</h1>
        <p>Discover and collect coins from around the world</p>
      </div>

      <CoinSearchFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading coins...</p>
        </div>
      ) : (
        <>
          <div className={styles.results}>
            <p>{pagination?.total || 0} coins found</p>
          </div>

          <div className={styles.grid}>
            {coins.map((coin) => (
              <div key={coin.id} className={styles.coinCardWrapper}>
                <CoinCard coin={coin} showAddToCollection={!!user} />
                <div className={styles.cardActions}>
                  <button onClick={() => handlePhotoCapture(coin.id)} className={styles.photoButton}>
                    📸 Take Photo
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={styles.pageButton}
              >
                Previous
              </button>

              <span className={styles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showPhotoCapture && selectedCoinForPhoto && (
        <PhotoCapture
          itemType="coin"
          itemId={selectedCoinForPhoto}
          onPhotosCapture={handlePhotosComplete}
          onClose={() => setShowPhotoCapture(false)}
        />
      )}
    </div>
  )
}

interface CoinSearchFiltersProps {
  filters: {
    search: string
    country: string
    category: string
    rarity: string
    yearFrom: string
    yearTo: string
  }
  onFilterChange: (filters: Partial<CoinSearchFiltersProps["filters"]>) => void
}

const CoinSearchFilters: React.FC<CoinSearchFiltersProps> = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    "circulation",
    "commemorative",
    "proof",
    "bullion",
    "pattern",
    "error",
    "ancient",
    "medieval",
    "modern",
  ]

  const rarities = ["common", "uncommon", "scarce", "rare", "very_rare", "extremely_rare"]

  const countries = [
    "South Africa",
    "United States",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "Canada",
    "China",
    "India",
  ]

  const currentYear = new Date().getFullYear()
  const startYear = 1800

  const handleInputChange = (field: keyof CoinSearchFiltersProps["filters"], value: string) => {
    onFilterChange({ [field]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: "",
      country: "",
      category: "",
      rarity: "",
      yearFrom: "",
      yearTo: "",
    })
  }

  const hasActiveFilters =
    filters.search || filters.country || filters.category || filters.rarity || filters.yearFrom || filters.yearTo

  return (
    <div className={styles.filters}>
      <div className={styles.searchSection}>
        <div className={styles.searchInput}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search coins..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className={styles.searchField}
          />
          {filters.search && (
            <button onClick={() => handleInputChange("search", "")} className={styles.clearSearch}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button onClick={() => setIsExpanded(!isExpanded)} className={styles.filterToggle}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
          Filter
          {hasActiveFilters && (
            <span className={styles.filterBadge}>{Object.values(filters).filter(Boolean).length}</span>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedFilters}>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label>Country</label>
              <select value={filters.country} onChange={(e) => handleInputChange("country", e.target.value)}>
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Category</label>
              <select value={filters.category} onChange={(e) => handleInputChange("category", e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Rarity</label>
              <select value={filters.rarity} onChange={(e) => handleInputChange("rarity", e.target.value)}>
                <option value="">All Rarities</option>
                {rarities.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity.replace("_", " ").charAt(0).toUpperCase() + rarity.replace("_", " ").slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>From Year</label>
              <select value={filters.yearFrom} onChange={(e) => handleInputChange("yearFrom", e.target.value)}>
                <option value="">Any Year</option>
                {Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>To Year</label>
              <select value={filters.yearTo} onChange={(e) => handleInputChange("yearTo", e.target.value)}>
                <option value="">Any Year</option>
                {Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
                  .filter((year) => !filters.yearFrom || year >= Number.parseInt(filters.yearFrom))
                  .map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className={styles.filterActions}>
              <button onClick={clearFilters} className={styles.clearButton}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
