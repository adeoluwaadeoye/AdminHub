"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

type EventType = "meeting" | "deadline" | "payment" | "maintenance";

type CalEvent = {
  date: number;
  title: string;
  type: EventType;
};

const eventColors: Record<EventType, string> = {
  meeting: "bg-blue-100 text-blue-700",
  deadline: "bg-red-100 text-red-700",
  payment: "bg-green-100 text-green-700",
  maintenance: "bg-yellow-100 text-yellow-700",
};

const mockEvents: CalEvent[] = [
  { date: 3, title: "Team standup", type: "meeting" },
  { date: 7, title: "Q2 report deadline", type: "deadline" },
  { date: 10, title: "Payroll processed", type: "payment" },
  { date: 14, title: "Product review", type: "meeting" },
  { date: 18, title: "Server maintenance", type: "maintenance" },
  { date: 21, title: "Invoice due", type: "payment" },
  { date: 25, title: "Sprint planning", type: "meeting" },
  { date: 28, title: "Deploy deadline", type: "deadline" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarSchedule() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (d: number) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const eventsForDay = (d: number) =>
    mockEvents.filter((e) => e.date === d);

  const selectedEvents = selected ? eventsForDay(selected) : [];

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <p className="font-semibold text-base">
              {MONTHS[month]} {year}
            </p>
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrent(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrent(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* DAY LABELS */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] text-muted-foreground py-1 font-medium">
              {d}
            </div>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasEvent = eventsForDay(day).length > 0;
            const isSelected = selected === day;

            return (
              <button
                key={day}
                onClick={() => setSelected(day)}
                className={`
                  relative mx-auto h-9 w-9 flex items-center justify-center rounded-full
                  text-sm transition-colors
                  ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}
                  ${isToday(day) && !isSelected ? "border border-primary text-primary font-semibold" : ""}
                `}
              >
                {day}
                {hasEvent && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-primary"
                      }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* SELECTED DAY EVENTS */}
        <div className="mt-4 border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {selected
              ? `Events on ${MONTHS[month]} ${selected}`
              : "Select a day to see events"}
          </p>

          {selectedEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground">No events.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((e, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-sm">{e.title}</p>
                  <Badge className={`text-[10px] px-2 py-0 ${eventColors[e.type]}`}>
                    {e.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}