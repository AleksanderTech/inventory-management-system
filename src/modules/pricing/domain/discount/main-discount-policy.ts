import type { DiscountPolicy } from "../../../shared/contracts/pricing/domain/discount-policy.ts";
import type {
  DiscountPolicyParams,
  DiscountPolicyResult,
} from "../../../shared/contracts/pricing/model/types.ts";
import { NoDiscount } from "../../model/constants.ts";
import type { DiscountRule } from "../../model/types.ts";

export class MainDiscountPolicy implements DiscountPolicy {
  #rules;

  constructor(rules: DiscountRule[]) {
    this.#rules = rules;
  }

  resolve(params: DiscountPolicyParams): DiscountPolicyResult {
    const discountPolicy = this.#rules.map((rule) => rule(params));
    return this.#maxDiscount(discountPolicy);
  }

  #maxDiscount(list: DiscountPolicyResult[]): DiscountPolicyResult {
    return list.reduce((best, cur) => (cur.percent > best.percent ? cur : best), NoDiscount);
  }
}
