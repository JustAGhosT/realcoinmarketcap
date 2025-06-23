import type React from "react"
import styles from "./section.module.css"

interface SectionProps {
  children: React.ReactNode
  title?: string
  variant?: "default" | "card"
  className?: string
}

export const Section: React.FC<SectionProps> = ({ children, title, variant = "default", className = "" }) => {
  const sectionClass = variant === "card" ? `${styles.section} ${styles.card}` : styles.section

  return (
    <section className={`${sectionClass} ${className}`}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </section>
  )
}
