import {
  discountPercentByReason,
  DiscountReason,
} from "../../../shared/contracts/pricing/model/constants.ts";
import type {
  DiscountPolicyParams,
  DiscountPolicyResult,
} from "../../../shared/contracts/pricing/model/types.ts";
import { HolidayDiscountCategoriesList, NoDiscount } from "../../model/constants.ts";
import type { DiscountRule } from "../../model/types.ts";
import { IsBlackFriday } from "./black-friday.ts";
import { IsPolishBankHoliday } from "./holidays.ts";

export const DiscountRules: DiscountRule[] = [
  volumeDiscountRule,
  blackFridayDiscountRule,
  holidayDiscountRule,
];

const volumeDiscountThresholds = [
  { minUnits: 50, reason: DiscountReason.volume50 },
  { minUnits: 10, reason: DiscountReason.volume10 },
  { minUnits: 5, reason: DiscountReason.volume5 },
];

const sortedVolumeDiscountThresholds = [...volumeDiscountThresholds].sort(
  (a, b) => b.minUnits - a.minUnits
);

function volumeDiscountRule(params: DiscountPolicyParams): DiscountPolicyResult {
  const matched = sortedVolumeDiscountThresholds.find((rule) => params.totalUnits >= rule.minUnits);

  return matched
    ? {
        percent: discountPercentByReason[matched.reason],
        reason: matched.reason,
      }
    : NoDiscount;
}

function blackFridayDiscountRule(params: DiscountPolicyParams): DiscountPolicyResult {
  return IsBlackFriday(params.date)
    ? {
        percent: discountPercentByReason[DiscountReason.blackFriday],
        reason: DiscountReason.blackFriday,
      }
    : NoDiscount;
}

function holidayDiscountRule(params: DiscountPolicyParams): DiscountPolicyResult {
  if (!IsPolishBankHoliday(params.date)) return NoDiscount;
  if (!params.categories.some((c) => HolidayDiscountCategoriesList.includes(c))) {
    return NoDiscount;
  }

  return {
    percent: discountPercentByReason[DiscountReason.holidaySale],
    reason: DiscountReason.holidaySale,
  };
}
