"use client"

import type React from "react"

import { useState } from "react"
import { AuthProvider } from "@/src/hooks/use-auth"
import { I18nProvider } from "@/src/hooks/use-i18n"
import { ThemeProvider } from "@/src/hooks/use-theme"
import { CountryDetectionProvider } from "@/src/hooks/use-country-detection"
import { CoinMarketplace } from "@/src/components/features/coins/coin-marketplace/coin-marketplace"
import { Marketplace } from "@/src/components/features/marketplace/marketplace"
import { LanguageSelector } from "@/src/components/common/language-selector/language-selector"
import { CountrySelector } from "@/src/components/common/country-selector/country-selector"
import { ThemeGenerator } from "@/src/components/features/themes/theme-generator/theme-generator"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "stamps" | "coins" | "about">("home")

  return (
    <CountryDetectionProvider>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        🚀 AI-Powered Collectibles Platform
                      </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CountrySelector />
                      <LanguageSelector />
                      <AuthButtons />
                    </div>
                  </div>
                </div>
              </nav>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
                  <TabButton
                    active={activeTab === "home"}
                    onClick={() => setActiveTab("home")}
                    icon="🏠"
                    label="Home"
                  />
                  <TabButton
                    active={activeTab === "stamps"}
                    onClick={() => setActiveTab("stamps")}
                    icon="📮"
                    label="Stamps"
                  />
                  <TabButton
                    active={activeTab === "coins"}
                    onClick={() => setActiveTab("coins")}
                    icon="🪙"
                    label="Coins"
                  />
                  <TabButton
                    active={activeTab === "about"}
                    onClick={() => setActiveTab("about")}
                    icon="ℹ️"
                    label="About"
                  />
                </div>

                <main>
                  {activeTab === "home" && <HomeContent />}
                  {activeTab === "stamps" && <StampsContent />}
                  {activeTab === "coins" && <CoinsContent />}
                  {activeTab === "about" && <AboutContent />}
                </main>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </CountryDetectionProvider>
  )
}

// Auth buttons component that uses the auth context
const AuthButtons = () => {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 dark:text-gray-300">Welcome, {user.name}</span>
        <button onClick={logout} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          Logout
        </button>
      </div>
    )
  }

  return (
    <>
      <button className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Login</button>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
        Register
      </button>
    </>
  )
}

// Tab button component
interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: string
  label: string
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
      active
        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    {icon} {label}
  </button>
)

// Content components
const HomeContent = () => (
  <div className="space-y-6">
    <div className="text-center py-12">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to the Collectibles Platform</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Discover, collect, and trade stamps and coins from around the world
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">📮 Stamp Collection</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Browse thousands of stamps from different countries, eras, and themes. Build your collection with rare
            finds.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">🪙 Coin Collection</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Explore coins from various countries and time periods. Professional grading and detailed specifications.
          </p>
        </div>
      </div>
    </div>
  </div>
)

const StampsContent = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <ThemeGenerator />
    </div>
    <Marketplace />
  </div>
)

const CoinsContent = () => (
  <div className="space-y-6">
    <CoinMarketplace />
  </div>
)

const AboutContent = () => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Our Platform</h2>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Our AI-powered collectibles platform brings together stamp and coin enthusiasts from around the world. Whether
          you're a seasoned collector or just starting your journey, we provide the tools and community to help you
          discover, authenticate, and trade collectibles.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4">
          <li>Professional photo capture system</li>
          <li>AI-powered authentication and valuation</li>
          <li>Global marketplace with secure transactions</li>
          <li>Multi-language support</li>
          <li>Country-specific collections and recommendations</li>
          <li>NFT integration for digital collectibles</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Technology</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Built with modern web technologies including Next.js, TypeScript, and AI integration to provide the best
          possible experience for collectors worldwide.
        </p>
      </div>
    </div>
  </div>
)

// Import useAuth at the top level where it's needed
import { useAuth } from "@/src/hooks/use-auth"
