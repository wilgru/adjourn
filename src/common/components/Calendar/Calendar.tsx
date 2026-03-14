import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { cn } from "src/common/utils/cn";
import { jumpToDateAtom } from "src/tableOfContents/atoms/jumpToDateAtom";
import { useGetDatesWithUpdates } from "src/updates/hooks/useGetDatesWithUpdates";
import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";
import type { DateWithNotes } from "src/notes/Note.type";

type CalendarProps = {
  journalId: string;
  colour?: Colour;
};

type CalendarDay = {
  day: Dayjs;
  isCurrentMonth: boolean;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CalendarItem = {
  key: number;
  journalId: string;
  colour: Colour;
  datesWithUpdates: DateWithNotes[];
  today: Dayjs;
  calendarDay: CalendarDay;
  handleSelectDay: (calendarDay: CalendarDay) => void;
};

const CalendarItem = ({
  key,
  journalId,
  colour,
  datesWithUpdates,
  today,
  calendarDay,
  handleSelectDay,
}: CalendarItem) => {
  const dateWithNotes = datesWithUpdates.find((dateWithNotes) => {
    return calendarDay.day.isSame(dateWithNotes.created, "day");
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 items-center",
        !dateWithNotes && "pb-1.5",
      )}
    >
      <Link
        to="/$journalId/updates"
        params={{
          journalId: journalId,
        }}
        itemID="todo"
        key={key}
        className={cn(
          "h-6 w-6 text-sm text-center leading-6 rounded-full cursor-pointer select-none",
          // hover:bg-*-100 and hover:text-*-500 variants are safelisted in tailwind.config.js
          `hover:${colour.backgroundPill}`,
          `hover:${colour.textPill}`,
          !calendarDay.isCurrentMonth && "text-slate-400 bg-transparent",
        )}
        activeProps={{ className: cn(colour.backgroundPill, colour.textPill) }}
        inactiveProps={{
          className: cn(
            calendarDay.day.isSame(today, "day")
              ? colour.textPill
              : calendarDay.isCurrentMonth && "text-slate-700",
          ),
        }}
        onClick={() => handleSelectDay(calendarDay)}
        aria-hidden={false}
      >
        {calendarDay.day.date()}
      </Link>

      {dateWithNotes && (
        <div
          className={cn(
            "h-1 w-1 rounded-full",
            dateWithNotes.hasBookmarked ? colour.background : "bg-slate-400",
          )}
        />
      )}
    </div>
  );
};

export const Calendar = ({
  journalId,
  colour = colours.orange,
}: CalendarProps): JSX.Element => {
  const { datesWithUpdates } = useGetDatesWithUpdates();
  const [jumpToDate, setJumpToDate] = useAtom(jumpToDateAtom);

  const today = dayjs();
  const [displayYear, setDisplayYear] = useState(today.year());
  const [displayMonth, setDisplayMonth] = useState(today.month());

  // Get first day of the month (0 = Sunday)
  const firstDay = dayjs().year(displayYear).month(displayMonth).date(1).day();

  // Get number of days in the month
  const daysInMonth = dayjs()
    .year(displayYear)
    .month(displayMonth)
    .daysInMonth();

  // Previous month info
  const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
  const prevMonthYear = displayMonth === 0 ? displayYear - 1 : displayYear;
  const prevMonthDays = dayjs()
    .year(prevMonthYear)
    .month(prevMonth)
    .endOf("month")
    .date();

  // Next month info
  const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
  const nextMonthYear = displayMonth === 11 ? displayYear + 1 : displayYear;

  const calendarDays: CalendarDay[] = [];

  // Fill days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: dayjs()
        .year(prevMonthYear)
        .month(prevMonth)
        .date(prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  // Fill days of the current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: dayjs().year(displayYear).month(displayMonth).date(d),
      isCurrentMonth: true,
    });
  }
  // Fill days from next month
  while (calendarDays.length < 42) {
    const nextDay = calendarDays.length - (firstDay + daysInMonth) + 1;

    calendarDays.push({
      day: dayjs().year(nextMonthYear).month(nextMonth).date(nextDay),
      isCurrentMonth: false,
    });
  }

  const handleSelectDay = (day: CalendarDay) => {
    // If selecting a day from prev/next month, update the displayed month
    if (!day.isCurrentMonth) {
      setDisplayYear(day.day.year());
      setDisplayMonth(day.day.month());
    }
  };

  const handlePrevMonth = () => {
    setDisplayMonth((prevDisplayMonth) => {
      if (prevDisplayMonth === 0) {
        setDisplayYear((y) => y - 1);
        return 11;
      }
      return prevDisplayMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setDisplayMonth((prevDisplayMonth) => {
      if (prevDisplayMonth === 11) {
        setDisplayYear((y) => y + 1);
        return 0;
      }
      return prevDisplayMonth + 1;
    });
  };

  const handleThisMonth = () => {
    setDisplayYear(today.year());
    setDisplayMonth(today.month());
  };

  useEffect(() => {
    if (jumpToDate) {
      setDisplayYear(jumpToDate.year());
      setDisplayMonth(jumpToDate.month());

      setJumpToDate(null);
    }
  }, [jumpToDate, setJumpToDate]);

  return (
    <div className="px-2">
      <div className="flex justify-between items-center mb-2">
        <span className="ml-1 font-title text-md text-slate-400">
          {MONTH_NAMES[displayMonth]} {displayYear}
        </span>

        <div className="flex items-center gap-1">
          <Button
            onClick={handlePrevMonth}
            iconName="caretLeft"
            variant="ghost"
            size="sm"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="circle"
            onClick={handleThisMonth}
          />
          <Button
            onClick={handleNextMonth}
            iconName="caretRight"
            variant="ghost"
            size="sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <h3
            key={d}
            className="font-medium text-sm text-slate-700 text-center"
          >
            {d}
          </h3>
        ))}

        {calendarDays.map((calendarDay, index) => (
          <CalendarItem
            key={index}
            journalId={journalId}
            colour={colour}
            calendarDay={calendarDay}
            datesWithUpdates={datesWithUpdates}
            today={today}
            handleSelectDay={handleSelectDay}
          />
        ))}
      </div>
    </div>
  );
};
