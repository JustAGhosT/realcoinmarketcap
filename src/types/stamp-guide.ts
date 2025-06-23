export interface PriceRange {
  era: string
  priceRange: string
  examples: string
}

export interface CashFlowScenario {
  route: string
  timeInvestment: string
  realisticPayout: string
}

export interface ConditionGrade {
  grade: string
  quickTest: string
  action: string
}

export interface StampGuideData {
  priceRanges: PriceRange[]
  cashFlowScenarios: CashFlowScenario[]
  conditionGrades: ConditionGrade[]
}
