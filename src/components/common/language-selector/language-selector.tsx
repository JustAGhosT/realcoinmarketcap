"use client"

import type React from "react"
import { useState } from "react"
import { useI18n } from "@/src/hooks/use-i18n"
import styles from "./language-selector.module.css"

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages, loading } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find((lang) => lang.code === language)

  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode as any)
    setIsOpen(false)
  }

  if (loading || !currentLanguage) {
    return (
      <div className={styles.skeleton}>
        <div className={styles.skeletonFlag}></div>
        <div className={styles.skeletonText}></div>
      </div>
    )
  }

  return (
    <div className={styles.selector}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.name}>{currentLanguage.nativeName}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`${styles.option} ${lang.code === language ? styles.selected : ""}`}
              role="option"
              aria-selected={lang.code === language}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <div className={styles.langInfo}>
                <span className={styles.nativeName}>{lang.nativeName}</span>
                <span className={styles.englishName}>{lang.name}</span>
              </div>
              {lang.code === language && (
                <svg className={styles.checkmark} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </div>
  )
}
