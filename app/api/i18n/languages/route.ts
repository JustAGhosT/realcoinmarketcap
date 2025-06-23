import { NextResponse } from "next/server"

export async function GET() {
  const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", rtl: false },
    { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", rtl: false },
    { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", rtl: false },
    { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦", rtl: false },
    { code: "st", name: "Sotho", nativeName: "Sesotho", flag: "🇿🇦", rtl: false },
    { code: "tn", name: "Tswana", nativeName: "Setswana", flag: "🇿🇦", rtl: false },
    { code: "ss", name: "Swati", nativeName: "siSwati", flag: "🇿🇦", rtl: false },
    { code: "ve", name: "Venda", nativeName: "Tshivenḓa", flag: "🇿🇦", rtl: false },
    { code: "ts", name: "Tsonga", nativeName: "Xitsonga", flag: "🇿🇦", rtl: false },
    { code: "nr", name: "Ndebele", nativeName: "isiNdebele", flag: "🇿🇦", rtl: false },
    { code: "nso", name: "Northern Sotho", nativeName: "Sepedi", flag: "🇿🇦", rtl: false },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", rtl: false },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", rtl: false },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", rtl: false },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", rtl: false },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", rtl: false },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", rtl: false },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", rtl: false },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", rtl: false },
  ]

  return NextResponse.json({ languages })
}
