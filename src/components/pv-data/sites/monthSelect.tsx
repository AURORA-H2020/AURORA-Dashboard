"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/routing";
import { monthNames } from "@/lib/constants/common-constants";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const getYearsBetween = (date: Date): string[] => {
  const startYear = date.getFullYear();
  const currentYear = new Date().getFullYear();
  const years: string[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString());
  }

  return years;
};

const MonthSelect = ({ earliestDate }: { earliestDate: Date }) => {
  const t = useTranslations();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCreateQueryString();

  const queryMonth = searchParams.get("month");
  const queryDate = queryMonth ? new Date(queryMonth) : new Date();

  const [month, setMonth] = useState(monthNames[queryDate.getMonth()]);
  const [year, setYear] = useState(queryDate.getFullYear().toString());

  const validYears = getYearsBetween(earliestDate);

  useEffect(() => {
    const queryMonth = `${year}-${(monthNames.indexOf(month) + 1).toString().padStart(2, "0")}`;
    router.replace(pathname + "?" + createQueryString("month", queryMonth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return (
    <div className="flex gap-2">
      <Select onValueChange={setMonth} value={month}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {monthNames.map((month, index) => {
            const isDisabled =
              new Date(Number(year), index + 1) < earliestDate ||
              new Date(Number(year), index) > new Date();
            return (
              <SelectItem key={month} value={month} disabled={isDisabled}>
                {t(month)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select onValueChange={setYear} value={year}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {validYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthSelect;
