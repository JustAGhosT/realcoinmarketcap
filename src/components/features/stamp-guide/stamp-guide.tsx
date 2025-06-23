import type React from "react"
import { StampGuideLayout } from "@/src/components/layouts/stamp-guide-layout"
import { Section } from "@/src/components/common/section"
import { DataTable } from "@/src/components/common/data-table"
import { useStampGuideData } from "@/src/hooks/use-stamp-guide-data"
import styles from "./stamp-guide.module.css"

export const StampGuide: React.FC = () => {
  const { priceRanges, cashFlowScenarios, conditionGrades } = useStampGuideData()

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
    <StampGuideLayout>
      {/* Intro Quote */}
      <Section>
        <blockquote className={styles.quote}>
          <p>
            <strong>Missiedoel:</strong> Verander daardie stofrige seël‑albums in vakansiegeld{" "}
            <strong>met selfvertroue én ŉ glimlag</strong>. Elke koevert dra ŉ storie – en stories verkoop! 💌💰
          </p>
        </blockquote>
      </Section>

      {/* Know Your Treasure */}
      <Section title="1. Ken Jou Skat 💎" variant="card">
        <ul className={styles.treasureList}>
          <li>
            <strong>First‑Day Cover (FDC):</strong> ŉ Spesiale koevert wat op die vrystellingsdag van die seël
            afgestempel is – versamelaars is mal oor hierdie "verjaardag‑stempe".
          </li>
          <li>
            Ons het <strong>± 300 koeverte</strong> van <strong>1974‑2000</strong>, reeds netjies in deursigtige sleeves
            – puik begin!
          </li>
        </ul>
        <div className={styles.proTip}>
          💡 Kopskuif: Dink aan elke koevert as ŉ klein tydmasjien; jy verkoop vir iemand anders ŉ retoerkaartjie na
          daardie dag.
        </div>
      </Section>

      {/* Money Map */}
      <Section title="2. Die Geld‑Kaart 🗺️">
        <DataTable columns={priceColumns} data={priceRanges} />

        <h3 className={styles.subheading}>Kontantvloei‑Scenario's</h3>
        <DataTable columns={cashFlowColumns} data={cashFlowScenarios} />
      </Section>

      {/* Gold Mining */}
      <Section title="3. Gouddelwery 101 – Sorteer soos ŉ Pro 🥇" variant="card">
        <h3 className={styles.subheading}>⭐ Trek die Ster‑Koeverte Uit</h3>
        <ol className={styles.starList}>
          <li>1994 Mandela‑ en nuwe vlag‑miniblaadjies</li>
          <li>
            1982 <strong>SASOL II</strong> fluoresserende‑ink foute
          </li>
          <li>1970's wit‑kaart vouers of getekende digterreekse</li>
        </ol>

        <h3 className={styles.subheading}>📦 Bondel die Res per Tema</h3>
        <p>
          Wild • Lugvaart • Sport • Nywerheid • Spoorweë – stel pakkies van <strong>10‑25</strong> bymekaar.
          Versamelaars hou van keurversamelings.
        </p>
        <div className={styles.proTip}>💡 Pro‑Wenk: Tema = drome. Iemand se "lugvaart‑jeug" bring ekstra bieë.</div>
      </Section>

      {/* Condition Test */}
      <Section title="4. Blits‑Kondisie‑Toets 🔍">
        <DataTable columns={conditionColumns} data={conditionGrades} />
        <div className={styles.proTip}>🧤 Hanteer net aan die kante; handskoene = jou superheld‑cape.</div>
      </Section>

      {/* Photography */}
      <Section title="5. Wys‑Af Fotografie 📸" variant="card">
        <ol className={styles.photographyList}>
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
    </StampGuideLayout>
  )
}
