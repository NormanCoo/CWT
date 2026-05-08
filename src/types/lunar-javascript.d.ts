declare module "lunar-javascript" {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getLunar(): Lunar;
  }

  export class Lunar {
    toString(): string;
    getJie(): string;
    getQi(): string;
    getJieQi(): string;
  }

  export class HolidayUtil {
    static getHoliday(
      year: number,
      month: number,
      day: number,
    ): { getName(): string; isWork(): boolean } | null;
  }
}
