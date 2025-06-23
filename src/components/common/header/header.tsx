import type React from "react"
import styles from "./header.module.css"

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Missie SeëlSoektog 🚀</h1>
        <p className={styles.subtitle}>Ma se Pos‑Avontuurgids om First‑Day Covers (1974‑2000) in Kontant te Omskep</p>
      </div>
    </header>
  )
}
