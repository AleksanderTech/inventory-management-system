export const DiscountReason = {
  none: "NONE",
  volume5: "VOLUME_5",
  volume10: "VOLUME_10",
  volume50: "VOLUME_50",
  blackFriday: "BLACK_FRIDAY",
  holidaySale: "HOLIDAY_SALE",
} as const;

export type DiscountReason = (typeof DiscountReason)[keyof typeof DiscountReason];

export const discountPercentByReason: Record<DiscountReason, number> = {
  [DiscountReason.none]: 0,
  [DiscountReason.volume5]: 10,
  [DiscountReason.volume10]: 20,
  [DiscountReason.volume50]: 30,
  [DiscountReason.blackFriday]: 25,
  [DiscountReason.holidaySale]: 15,
};
