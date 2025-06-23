import { stampGuideData } from "@/src/lib/stamp-guide-data"
import type { StampGuideData } from "@/src/types/stamp-guide"

export const useStampGuideData = (): StampGuideData => {
  return stampGuideData
}
