import { NextResponse } from "next/server"

export async function GET() {
  const translations = {
    common: {
      loading: "Loading",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      next: "Next",
      previous: "Previous",
      close: "Close",
    },
    navigation: {
      home: "Home",
      marketplace: "Marketplace",
      collection: "My Collection",
      themes: "Themes",
      nft: "NFT",
      profile: "Profile",
      settings: "Settings",
    },
    stamps: {
      title: "Title",
      description: "Description",
      category: "Category",
      rarity: "Rarity",
      condition: "Condition",
      price: "Price",
      addToCollection: "Add to Collection",
      mintAsNFT: "Mint as NFT",
    },
    themes: {
      createTheme: "Create Theme",
      generateWithAI: "Generate with AI",
      customizeTheme: "Customize Theme",
      previewTheme: "Preview Theme",
      saveTheme: "Save Theme",
      themeCategories: "Theme Categories",
    },
    nft: {
      mint: "Mint",
      transfer: "Transfer",
      list: "List for Sale",
      buy: "Buy",
      collection: "NFT Collection",
      marketplace: "NFT Marketplace",
    },
  }

  return NextResponse.json(translations)
}
