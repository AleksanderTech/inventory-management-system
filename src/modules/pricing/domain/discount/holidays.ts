import { toDateKeyInTimeZone } from "../../../shared/utils/time.ts";
import { DiscountTimeZone, PolishBankHolidayMonthDays } from "../../model/constants.ts";

export function IsPolishBankHoliday(date: Date): boolean {
  const dateKey = toDateKeyInTimeZone(date, DiscountTimeZone);
  return PolishBankHolidayMonthDays.some((monthDay) => dateKey.endsWith(monthDay));
}
