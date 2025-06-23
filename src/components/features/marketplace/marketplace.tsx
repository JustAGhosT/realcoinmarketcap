"use client"

import type React from "react"
import { useState } from "react"
import { StampCard } from "./stamp-card/stamp-card"
import { SearchFilters } from "./search-filters/search-filters"
import { useStamps } from "@/src/hooks/use-stamps"
import { useAuth } from "@/src/hooks/use-auth"
import styles from "./marketplace.module.css"

export const Marketplace: React.FC = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    rarity: "",
    yearFrom: "",
    yearTo: "",
    page: 1,
  })

  const { stamps, loading, error, pagination } = useStamps(filters)

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error Loading Stamps</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.marketplace}>
      <div className={styles.header}>
        <h1>Stamp Marketplace</h1>
        <p>Discover and collect South African stamps from 1961 to present</p>
      </div>

      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading stamps...</p>
        </div>
      ) : (
        <>
          <div className={styles.results}>
            <p>{pagination?.total || 0} stamps found</p>
          </div>

          <div className={styles.grid}>
            {stamps.map((stamp) => (
              <StampCard key={stamp.id} stamp={stamp} showAddToCollection={!!user} />
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
    </div>
  )
}
