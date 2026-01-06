import type {
  DiscountPolicyParams,
  DiscountPolicyResult,
} from "../../shared/contracts/pricing/model/types.ts";

export type DiscountRule = (params: DiscountPolicyParams) => DiscountPolicyResult;
