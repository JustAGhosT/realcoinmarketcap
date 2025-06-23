import type { StampGuideData } from "@/src/types/stamp-guide"

export const stampGuideData: StampGuideData = {
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
