import type { DiscountPolicyParams, DiscountPolicyResult } from "../model/types.ts";

export interface DiscountPolicy {
  resolve(ctx: DiscountPolicyParams): DiscountPolicyResult;
}
