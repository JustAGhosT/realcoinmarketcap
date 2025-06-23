"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useI18n } from "@/src/hooks/use-i18n"
import styles from "./search-filters.module.css"

interface SearchFiltersProps {
  filters: {
    search: string
    category: string
    rarity: string
    yearFrom: string
    yearTo: string
    page: number
  }
  onFilterChange: (filters: Partial<SearchFiltersProps["filters"]>) => void
}

interface Category {
  id: number
  name: string
  description?: string
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const { t } = useI18n()
  const [categories, setCategories] = useState<Category[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleInputChange = (field: keyof SearchFiltersProps["filters"], value: string) => {
    onFilterChange({ [field]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      rarity: "",
      yearFrom: "",
      yearTo: "",
    })
  }

  const hasActiveFilters = filters.search || filters.category || filters.rarity || filters.yearFrom || filters.yearTo

  const rarityOptions = [
    { value: "common", label: "Common" },
    { value: "uncommon", label: "Uncommon" },
    { value: "rare", label: "Rare" },
    { value: "very_rare", label: "Very Rare" },
  ]

  const currentYear = new Date().getFullYear()
  const startYear = 1961

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
            placeholder={t("common.search") + " stamps..."}
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className={styles.searchField}
          />
          {filters.search && (
            <button
              onClick={() => handleInputChange("search", "")}
              className={styles.clearSearch}
              aria-label="Clear search"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button onClick={() => setIsExpanded(!isExpanded)} className={styles.filterToggle} aria-expanded={isExpanded}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
          {t("common.filter")}
          {hasActiveFilters && (
            <span className={styles.filterBadge}>{Object.values(filters).filter(Boolean).length - 1}</span>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedFilters}>
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label htmlFor="category" className={styles.filterLabel}>
                {t("stamps.category")}
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="rarity" className={styles.filterLabel}>
                {t("stamps.rarity")}
              </label>
              <select
                id="rarity"
                value={filters.rarity}
                onChange={(e) => handleInputChange("rarity", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Rarities</option>
                {rarityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="yearFrom" className={styles.filterLabel}>
                From Year
              </label>
              <select
                id="yearFrom"
                value={filters.yearFrom}
                onChange={(e) => handleInputChange("yearFrom", e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Any Year</option>
                {Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="yearTo" className={styles.filterLabel}>
                To Year
              </label>
              <select
                id="yearTo"
                value={filters.yearTo}
                onChange={(e) => handleInputChange("yearTo", e.target.value)}
                className={styles.filterSelect}
              >
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
