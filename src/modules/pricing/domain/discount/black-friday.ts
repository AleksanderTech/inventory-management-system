import { toDateKeyInTimeZone, isSameDateInTimeZone } from "../../../shared/utils/time.ts";
import { DiscountTimeZone } from "../../model/constants.ts";

export function IsBlackFriday(date: Date): boolean {
  const year = Number(toDateKeyInTimeZone(date, DiscountTimeZone).slice(0, 4));
  const bf = getBlackFridayDate(year);
  return isSameDateInTimeZone(date, bf, DiscountTimeZone);
}

function getBlackFridayDate(year: number): Date {
  const novemberFirst = new Date(Date.UTC(year, 10, 1));
  const firstDay = novemberFirst.getUTCDay();
  const thursday = 4;
  const offset = (thursday - firstDay + 7) % 7;
  const fourthThursday = 1 + offset + 7 * 3;
  const blackFriday = fourthThursday + 1;
  return new Date(Date.UTC(year, 10, blackFriday));
}
