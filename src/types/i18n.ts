export type SupportedLanguage =
  | "en"
  | "af"
  | "zu"
  | "xh"
  | "st"
  | "tn"
  | "ss"
  | "ve"
  | "ts"
  | "nr"
  | "nso"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "zh"
  | "ja"
  | "ko"
  | "ar"
  | "hi"
  | "ru"

export interface LanguageConfig {
  code: SupportedLanguage
  name: string
  nativeName: string
  flag: string
  rtl: boolean
}

export interface TranslationKeys {
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    create: string
    search: string
    filter: string
    sort: string
    next: string
    previous: string
    close: string
  }
  navigation: {
    home: string
    marketplace: string
    collection: string
    themes: string
    nft: string
    profile: string
    settings: string
  }
  stamps: {
    title: string
    description: string
    category: string
    rarity: string
    condition: string
    price: string
    addToCollection: string
    mintAsNFT: string
  }
  themes: {
    createTheme: string
    generateWithAI: string
    customizeTheme: string
    previewTheme: string
    saveTheme: string
    themeCategories: string
  }
  nft: {
    mint: string
    transfer: string
    list: string
    buy: string
    collection: string
    marketplace: string
  }
}
