"use client"

import type React from "react"

// Types
interface PriceRange {
  era: string
  priceRange: string
  examples: string
}

interface CashFlowScenario {
  route: string
  timeInvestment: string
  realisticPayout: string
}

interface ConditionGrade {
  grade: string
  quickTest: string
  action: string
}

// Data
const stampGuideData = {
  priceRanges: [
    {
      era: "1974‑79",
      priceRange: "R10‑30",
      examples: "1974 wit‑kaart vouer, AG Visser digter‑stel",
    },
    {
      era: "1980‑89",
      priceRange: "R5‑25",
      examples: "1982 <strong>SASOL II</strong>‑fout, 1986 Lugvaart‑miniblaadjie",
    },
    {
      era: "1990‑93",
      priceRange: "R5‑15",
      examples: "Chroom‑ink definitiewe",
    },
    {
      era: "1994 Mandela",
      priceRange: "R20‑60+",
      examples: "Vlag‑ en Inaugurasie‑miniblaadjies (tot R120)",
    },
    {
      era: "1995‑2000",
      priceRange: "R5‑18",
      examples: "Groot‑Vyf & Flora miniblaadjies",
    },
  ],
  cashFlowScenarios: [
    {
      route: "Handelaarsprong",
      timeInvestment: "Een middag",
      realisticPayout: "R2 500‑3 500",
    },
    {
      route: "Naweek‑Vegter",
      timeInvestment: "2‑3 naweke",
      realisticPayout: "R4 500‑6 000",
    },
    {
      route: "Geduld‑Pro",
      timeInvestment: "Paar maande",
      realisticPayout: "Tot R8 000",
    },
  ],
  conditionGrades: [
    {
      grade: "VF/UNC",
      quickTest: "Skerp, helder, geen kreukels",
      action: "Lys individueel as duur",
    },
    {
      grade: "Fyn",
      quickTest: "Ligte kreukels/veroudering",
      action: "Goed vir bondels",
    },
    {
      grade: "Swak",
      quickTest: "Skeure, vlekke, adresses",
      action: "Skenk / kunsprojekte",
    },
  ],
}

// Components
interface Column {
  key: string
  header: string
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, string>[]
  className?: string
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, className = "" }) => {
  return (
    <div className="overflow-x-auto my-4">
      <table className={`min-w-full border border-gray-300 bg-white ${className}`}>
        <thead className="bg-indigo-700 text-yellow-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`py-2 px-3 text-left font-semibold ${column.className || ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : ""}>
              {columns.map((column) => (
                <td key={column.key} className="py-2 px-3" dangerouslySetInnerHTML={{ __html: row[column.key] }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface SectionProps {
  children: React.ReactNode
  title?: string
  variant?: "default" | "card"
  className?: string
}

const Section: React.FC<SectionProps> = ({ children, title, variant = "default", className = "" }) => {
  const sectionClass = variant === "card" ? "bg-white rounded-xl shadow-md p-6 my-6" : "py-6"

  return (
    <section className={`${sectionClass} ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-4 text-gray-900">{title}</h2>}
      {children}
    </section>
  )
}

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-700 text-yellow-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-2">Missie SeëlSoektog 🚀</h1>
        <p className="text-xl">Ma se Pos‑Avontuurgids om First‑Day Covers (1974‑2000) in Kontant te Omskep</p>
      </div>
    </header>
  )
}

export default function StampGuide() {
  const { priceRanges, cashFlowScenarios, conditionGrades } = stampGuideData

  const priceColumns = [
    { key: "era", header: "Era" },
    { key: "priceRange", header: "Tipiese Rand (per stuk)" },
    { key: "examples", header: '"Held"‑Voorbeelde' },
  ]

  const cashFlowColumns = [
    { key: "route", header: "Roete" },
    { key: "timeInvestment", header: "Tydsbelegging" },
    { key: "realisticPayout", header: "Realistiese Uitbetaling" },
  ]

  const conditionColumns = [
    { key: "grade", header: "Graad" },
    { key: "quickTest", header: "3‑Sekonde‑Toets" },
    { key: "action", header: "Aksie" },
  ]

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-900 font-sans leading-relaxed">
      <Header />

      <main className="max-w-4xl mx-auto px-4">
        {/* Intro Quote */}
        <Section>
          <blockquote className="border-l-4 border-indigo-700 pl-4 italic text-lg my-6">
            <p>
              <strong>Missiedoel:</strong> Verander daardie stofrige seël‑albums in vakansiegeld{" "}
              <strong>met selfvertroue én ŉ glimlag</strong>. Elke koevert dra ŉ storie – en stories verkoop! 💌💰
            </p>
          </blockquote>
        </Section>

        {/* Know Your Treasure */}
        <Section title="1. Ken Jou Skat 💎" variant="card">
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              <strong>First‑Day Cover (FDC):</strong> ŉ Spesiale koevert wat op die vrystellingsdag van die seël
              afgestempel is – versamelaars is mal oor hierdie "verjaardag‑stempe".
            </li>
            <li>
              Ons het <strong>± 300 koeverte</strong> van <strong>1974‑2000</strong>, reeds netjies in deursigtige
              sleeves – puik begin!
            </li>
          </ul>
          <div className="text-indigo-700 font-semibold">
            💡 Kopskuif: Dink aan elke koevert as ŉ klein tydmasjien; jy verkoop vir iemand anders ŉ retoerkaartjie na
            daardie dag.
          </div>
        </Section>

        {/* Money Map */}
        <Section title="2. Die Geld‑Kaart 🗺️">
          <DataTable columns={priceColumns} data={priceRanges} />

          <h3 className="text-xl font-semibold mt-6 mb-2">Kontantvloei‑Scenario's</h3>
          <DataTable columns={cashFlowColumns} data={cashFlowScenarios} />
        </Section>

        {/* Gold Mining */}
        <Section title="3. Gouddelwery 101 – Sorteer soos ŉ Pro 🥇" variant="card">
          <h3 className="text-xl font-semibold mb-2">⭐ Trek die Ster‑Koeverte Uit</h3>
          <ol className="list-decimal list-inside mb-4 space-y-1">
            <li>1994 Mandela‑ en nuwe vlag‑miniblaadjies</li>
            <li>
              1982 <strong>SASOL II</strong> fluoresserende‑ink foute
            </li>
            <li>1970's wit‑kaart vouers of getekende digterreekse</li>
          </ol>

          <h3 className="text-xl font-semibold mb-2">📦 Bondel die Res per Tema</h3>
          <p className="mb-3">
            Wild • Lugvaart • Sport • Nywerheid • Spoorweë – stel pakkies van <strong>10‑25</strong> bymekaar.
            Versamelaars hou van keurversamelings.
          </p>
          <div className="text-indigo-700 font-semibold">
            💡 Pro‑Wenk: Tema = drome. Iemand se "lugvaart‑jeug" bring ekstra bieë.
          </div>
        </Section>

        {/* Condition Test */}
        <Section title="4. Blits‑Kondisie‑Toets 🔍">
          <DataTable columns={conditionColumns} data={conditionGrades} />
          <div className="text-indigo-700 font-semibold mt-3">
            🧤 Hanteer net aan die kante; handskoene = jou superheld‑cape.
          </div>
        </Section>

        {/* Photography */}
        <Section title="5. Wys‑Af Fotografie 📸" variant="card">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Skandeer/fotografeer op 600 dpi</strong>, voor & agter.
            </li>
            <li>Gebruik natuurlike lig; vermy harde skadu's.</li>
            <li>Plaas ŉ liniaal in die raam vir skaal.</li>
            <li>
              Voeg <strong>SACC‑katalogus nommers</strong> by in die beskrywing.
            </li>
          </ol>
        </Section>
      </main>
    </div>
  )
}
