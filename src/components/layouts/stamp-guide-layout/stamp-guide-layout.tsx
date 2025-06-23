import type React from "react"
import { Header } from "@/src/components/common/header"
import styles from "./stamp-guide-layout.module.css"

interface StampGuideLayoutProps {
  children: React.ReactNode
}

export const StampGuideLayout: React.FC<StampGuideLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  )
}
