import * as Popover from "@radix-ui/react-popover";
import dayjs from "dayjs";
import { useState } from "react";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { cn } from "src/common/utils/cn";
import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";

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

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type TaskDatePickerProps = {
  dueDate: Dayjs | null;
  colour?: Colour;
  isCompleted?: boolean;
  isCancelled?: boolean;
  onChange: (date: Dayjs | null) => void;
};

export const TaskDatePicker = ({
  dueDate,
  colour = colours.orange,
  isCompleted = false,
  isCancelled = false,
  onChange,
}: TaskDatePickerProps) => {
  const today = dayjs();
  const [displayYear, setDisplayYear] = useState(
    dueDate ? dueDate.year() : today.year(),
  );
  const [displayMonth, setDisplayMonth] = useState(
    dueDate ? dueDate.month() : today.month(),
  );

  const firstDay = dayjs()
    .year(displayYear)
    .month(displayMonth)
    .date(1)
    .day();
  const daysInMonth = dayjs()
    .year(displayYear)
    .month(displayMonth)
    .daysInMonth();

  const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
  const prevMonthYear = displayMonth === 0 ? displayYear - 1 : displayYear;
  const prevMonthDays = dayjs()
    .year(prevMonthYear)
    .month(prevMonth)
    .endOf("month")
    .date();

  const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
  const nextMonthYear = displayMonth === 11 ? displayYear + 1 : displayYear;

  type CalendarDay = { day: Dayjs; isCurrentMonth: boolean };
  const calendarDays: CalendarDay[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: dayjs().year(prevMonthYear).month(prevMonth).date(prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: dayjs().year(displayYear).month(displayMonth).date(d),
      isCurrentMonth: true,
    });
  }
  while (calendarDays.length < 42) {
    const nextDay = calendarDays.length - (firstDay + daysInMonth) + 1;
    calendarDays.push({
      day: dayjs().year(nextMonthYear).month(nextMonth).date(nextDay),
      isCurrentMonth: false,
    });
  }

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayYear((y) => y - 1);
      setDisplayMonth(11);
    } else {
      setDisplayMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayYear((y) => y + 1);
      setDisplayMonth(0);
    } else {
      setDisplayMonth((m) => m + 1);
    }
  };

  const isOverdue =
    dueDate && dueDate.isBefore(today, "day") && !isCompleted && !isCancelled;

  const trigger = dueDate ? (
    <button
      type="button"
      className={cn(
        "text-xs px-2 py-1 rounded-full transition-colors",
        isOverdue ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500",
      )}
    >
      {dueDate.format("MMM D, YYYY")}
    </button>
  ) : (
    <Button colour={colour} iconName="calendarDots" variant="ghost" size="sm" />
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-64 focus:outline-none z-50"
          sideOffset={6}
          align="end"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="ml-1 font-title text-sm text-slate-500">
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
                onClick={handleNextMonth}
                iconName="caretRight"
                variant="ghost"
                size="sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {DAY_NAMES.map((d) => (
              <span
                key={d}
                className="text-xs font-medium text-slate-500 text-center py-0.5"
              >
                {d}
              </span>
            ))}

            {calendarDays.map((calendarDay, index) => {
              const isSelected =
                dueDate && calendarDay.day.isSame(dueDate, "day");
              const isToday = calendarDay.day.isSame(today, "day");

              return (
                <Popover.Close asChild key={index}>
                  <button
                    type="button"
                    aria-label={calendarDay.day.format("MMMM D, YYYY")}
                    onClick={() => onChange(calendarDay.day)}
                    className={cn(
                      "h-7 w-full text-xs text-center leading-7 rounded-full cursor-pointer select-none transition-colors",
                      !calendarDay.isCurrentMonth && "text-slate-300",
                      calendarDay.isCurrentMonth &&
                        !isSelected &&
                        "text-slate-700",
                      isToday && !isSelected && colour.textPill,
                      isSelected && colour.background,
                      isSelected && "text-white",
                      !isSelected && `hover:${colour.backgroundPill}`,
                      !isSelected && `hover:${colour.textPill}`,
                    )}
                  >
                    {calendarDay.day.date()}
                  </button>
                </Popover.Close>
              );
            })}
          </div>

          {dueDate && (
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                aria-label={`Clear due date ${dueDate.format("MMMM D, YYYY")}`}
                onClick={() => onChange(null)}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear date
              </button>
            </div>
          )}

          <Popover.Arrow className="fill-slate-200" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
