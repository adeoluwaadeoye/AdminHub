"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type PayStatus = "completed" | "failed" | "pending";

type Payment = {
  id: string;
  name: string;
  amount: number;
  method: string;
  status: PayStatus;
  date: string;
};

const payments: Payment[] = [
  { id: "TXN001", name: "Alice Johnson",  amount: 120,  method: "Visa",       status: "completed", date: "Apr 1" },
  { id: "TXN002", name: "Bob Smith",      amount: 75,   method: "Mastercard", status: "pending",   date: "Apr 2" },
  { id: "TXN003", name: "Carol White",    amount: 340,  method: "PayPal",     status: "failed",    date: "Apr 3" },
  { id: "TXN004", name: "David Brown",    amount: 200,  method: "Visa",       status: "completed", date: "Apr 4" },
  { id: "TXN005", name: "Eva Green",      amount: 89,   method: "Stripe",     status: "completed", date: "Apr 5" },
  { id: "TXN006", name: "Frank Lee",      amount: 450,  method: "Mastercard", status: "pending",   date: "Apr 6" },
];

const chartData = [
  { month: "Nov", amount: 8400  },
  { month: "Dec", amount: 12000 },
  { month: "Jan", amount: 9800  },
  { month: "Feb", amount: 14200 },
  { month: "Mar", amount: 11600 },
  { month: "Apr", amount: 16800 },
];

const statusConfig: Record<PayStatus, { icon: React.ReactNode; style: string; label: string }> = {
  completed: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, style: "bg-green-100 text-green-700", label: "Completed" },
  failed:    { icon: <XCircle      className="h-3.5 w-3.5" />, style: "bg-red-100 text-red-600",     label: "Failed"    },
  pending:   { icon: <Clock        className="h-3.5 w-3.5" />, style: "bg-yellow-100 text-yellow-700", label: "Pending" },
};

type Filter = "all" | PayStatus;

export default function PaymentOverview() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const counts = {
    completed: payments.filter((p) => p.status === "completed").length,
    pending:   payments.filter((p) => p.status === "pending").length,
    failed:    payments.filter((p) => p.status === "failed").length,
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5 space-y-5">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-base">Payment Overview</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transaction history & trends
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
            <TrendingUp className="h-4 w-4" />
            +18% this month
          </div>
        </div>

        {/* STAT PILLS */}
        <div className="grid grid-cols-3 gap-3">
          {(["completed", "pending", "failed"] as PayStatus[]).map((s) => {
            const cfg = statusConfig[s];
            return (
              <div key={s} className={`rounded-xl p-3 text-center ${cfg.style} bg-opacity-60`}>
                <p className="text-lg font-bold">{counts[s]}</p>
                <p className="text-[11px] capitalize">{s}</p>
              </div>
            );
          })}
        </div>

        {/* TOTAL */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900">
          <p className="text-sm text-muted-foreground">Total Collected</p>
          <p className="text-xl font-bold text-indigo-600">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>

        {/* CHART */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            6-Month Trend
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* FILTER */}
        <div className="flex gap-1 rounded-lg border p-1 w-fit">
          {(["all", "completed", "pending", "failed"] as Filter[]).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "ghost"}
              className="text-xs h-7 px-3 capitalize"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* TRANSACTIONS */}
        <div className="space-y-2">
          {filtered.map((p) => {
            const cfg = statusConfig[p.status];
            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-100">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.method} · {p.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">${p.amount}</p>
                  <Badge className={`text-[10px] px-2 py-0 gap-1 flex items-center ${cfg.style}`}>
                    {cfg.icon}
                    {cfg.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}