export const CustomerLocation = {
  unitedStates: "unitedStates",
  europe: "europe",
  asia: "asia",
} as const;

export type CustomerLocation =
  (typeof CustomerLocation)[keyof typeof CustomerLocation];
