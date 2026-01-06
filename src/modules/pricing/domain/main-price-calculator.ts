import { CustomerLocation } from "../../shared/contracts/customer/model/constants.ts";
import type { PriceCalculator } from "../../shared/contracts/pricing/domain/price-calculator.ts";
import type {
  PriceCalculationParams,
  PriceCalculationResult,
} from "../../shared/contracts/pricing/model/types.ts";

export class MainPriceCalculator implements PriceCalculator {
  calculate(params: PriceCalculationParams): PriceCalculationResult {
    const unitPriceMinor = Math.floor(
      params.unitPriceMinor * this.#locationMultiplier(params.location)
    );
    const lineTotalMinor = unitPriceMinor * params.quantity;

    return {
      unitPriceMinor,
      lineTotalMinor,
    };
  }

  #locationMultiplier(location: CustomerLocation): number {
    switch (location) {
      case CustomerLocation.unitedStates:
        return 1;
      case CustomerLocation.europe:
        return 1.15;
      case CustomerLocation.asia:
        return 0.95;
      default:
        throw new Error(`Unsupported customer location: ${location}`);
    }
  }
}
