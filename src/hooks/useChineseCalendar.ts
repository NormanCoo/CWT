import { useMemo } from "react";
import { Solar, HolidayUtil } from "lunar-javascript";

interface ChineseCalendarInfo {
  solarTerms: Map<string, string>;
  holidays: Map<string, string>;
  getLunarDate: (date: Date) => string | null;
}

export function useChineseCalendar(
  startDate: Date,
  endDate: Date,
): ChineseCalendarInfo {
  return useMemo(() => {
    const solarTerms = new Map<string, string>();
    const holidays = new Map<string, string>();

    const current = new Date(startDate);
    while (current <= endDate) {
      const y = current.getFullYear();
      const m = current.getMonth() + 1;
      const d = current.getDate();
      const ds = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      try {
        // Solar term (节气)
        const solar = Solar.fromYmd(y, m, d);
        const jieQi = solar.getLunar().getJieQi();
        if (jieQi) {
          solarTerms.set(ds, jieQi);
        }

        // Holiday (法定假日)
        const holiday = HolidayUtil.getHoliday(y, m, d);
        if (holiday) {
          holidays.set(ds, holiday.getName());
        }
      } catch {
        // ignore
      }

      current.setDate(current.getDate() + 1);
    }

    return {
      solarTerms,
      holidays,
      getLunarDate: (date: Date) => {
        try {
          const solar = Solar.fromYmd(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
          );
          const lunar = solar.getLunar();
          return lunar.toString();
        } catch {
          return null;
        }
      },
    };
  }, [startDate, endDate]);
}
