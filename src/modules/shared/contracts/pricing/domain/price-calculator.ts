import type { PriceCalculationParams, PriceCalculationResult } from "../model/types.ts";

export interface PriceCalculator {
  calculate(ctx: PriceCalculationParams): PriceCalculationResult;
}
