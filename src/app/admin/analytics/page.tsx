"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Ticket, Wallet, Trophy, MapPin } from "lucide-react";

/* ======================== Mock Data ======================== */
type EventRow = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  sport: string;
  venue: string;
  ticketsSold: number;
  capacity: number;
  revenue: number; // in PHP
};

const TOP_EVENTS: EventRow[] = [
  { id: "1", name: "NCF vs ADNU", date: "2025-08-01", sport: "Basketball", venue: "ADNU Gym", ticketsSold: 420, capacity: 500, revenue: 210000 },
  { id: "2", name: "USI vs UNC", date: "2025-08-02", sport: "Volleyball", venue: "USI Court", ticketsSold: 320, capacity: 400, revenue: 112000 },
  { id: "3", name: "ADNU vs UNC", date: "2025-08-05", sport: "Basketball", venue: "UNC Dome", ticketsSold: 480, capacity: 550, revenue: 240000 },
  { id: "4", name: "NCF vs USI", date: "2025-08-07", sport: "Volleyball", venue: "NCF Arena", ticketsSold: 260, capacity: 350, revenue: 91000 },
  { id: "5", name: "All-Star Skills", date: "2025-08-10", sport: "Basketball", venue: "Civic Center", ticketsSold: 390, capacity: 600, revenue: 175500 },
];

const SALES_TREND = [
  { label: "Aug 01", tickets: 420, revenue: 210000 },
  { label: "Aug 02", tickets: 320, revenue: 112000 },
  { label: "Aug 03", tickets: 180, revenue: 54000 },
  { label: "Aug 04", tickets: 220, revenue: 77000 },
  { label: "Aug 05", tickets: 480, revenue: 240000 },
  { label: "Aug 06", tickets: 200, revenue: 70000 },
  { label: "Aug 07", tickets: 260, revenue: 91000 },
  { label: "Aug 08", tickets: 150, revenue: 52500 },
  { label: "Aug 09", tickets: 210, revenue: 73500 },
  { label: "Aug 10", tickets: 390, revenue: 175500 },
];

const TICKETS_BY_SPORT = [
  { name: "Basketball", value: 1290 },
  { name: "Volleyball", value: 580 },
  { name: "Futsal", value: 210 },
];

const THIS_MONTH = { revenue: 961000, tickets: 2830 };
const LAST_MONTH = { revenue: 812000, tickets: 2440 };

/* ======================== Utils ======================== */
const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);

const pctChange = (current: number, prev: number) => (prev === 0 ? 100 : ((current - prev) / prev) * 100);

function TrendBadge({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
      title="vs previous period"
    >
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

/* ======================== Small UI Bits ======================== */
function RangeChips({
  value,
  onChange,
}: {
  value: "7d" | "14d" | "30d";
  onChange: (v: "7d" | "14d" | "30d") => void;
}) {
  const base = "rounded-full px-3 py-1.5 text-xs font-medium transition";
  const active = "bg-white text-gray-900 shadow";
  const idle = "text-white/80 hover:text-white";
  return (
    <div className="flex items-center gap-2">
      {(["7d", "14d", "30d"] as const).map((k) => (
        <button key={k} onClick={() => onChange(k)} className={`${base} ${value === k ? active : idle}`}>
          {k}
        </button>
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  change,
  icon,
}: {
  title: string;
  value: string;
  hint?: string;
  change?: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#071689]/10 p-2 text-[#071689]">{icon}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>

      <div className="mt-2 flex items-end gap-2">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {typeof change === "number" && <TrendBadge value={change} />}
      </div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

/* ======================== Page ======================== */
export default function AnalyticsPage() {
  const [range, setRange] = useState<"7d" | "14d" | "30d">("14d");

  const totals = useMemo(() => {
    const totalRevenue = TOP_EVENTS.reduce((s, e) => s + e.revenue, 0);
    const totalTickets = TOP_EVENTS.reduce((s, e) => s + e.ticketsSold, 0);

    // Top sport by ticket count
    const bySport = new Map<string, number>();
    TOP_EVENTS.forEach((e) => bySport.set(e.sport, (bySport.get(e.sport) ?? 0) + e.ticketsSold));
    const topSport = [...bySport.entries()].sort((a, b) => b[1] - a[1])[0];

    // Top venue by ticket count
    const byVenue = new Map<string, number>();
    TOP_EVENTS.forEach((e) => byVenue.set(e.venue, (byVenue.get(e.venue) ?? 0) + e.ticketsSold));
    const topVenue = [...byVenue.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      totalRevenue,
      totalTickets,
      topSportName: topSport?.[0] ?? "—",
      topSportTickets: topSport?.[1] ?? 0,
      topVenueName: topVenue?.[0] ?? "—",
      topVenueTickets: topVenue?.[1] ?? 0,
    };
  }, []);

  const revenueChange = useMemo(() => pctChange(THIS_MONTH.revenue, LAST_MONTH.revenue), []);
  const ticketsChange = useMemo(() => pctChange(THIS_MONTH.tickets, LAST_MONTH.tickets), []);

  // Fake slice for the range (just trims the demo data)
  const trendData = useMemo(() => {
    if (range === "7d") return SALES_TREND.slice(-7);
    if (range === "14d") return SALES_TREND.slice(-10); // we have 10 days mock
    return SALES_TREND;
  }, [range]);

  return (
    <div className="space-y-6 pt-6">
      {/* Gradient Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#071689] via-[#1A2DB3] to-[#7AA2FF] px-6 py-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="mt-1 text-sm text-white/80">
              Quick snapshot of revenue, ticket sales, and event performance.
            </p>
          </div>
          <RangeChips value={range} onChange={setRange} />
        </div>
      </div>

      {/* Top KPIs */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={peso(totals.totalRevenue)}
          change={revenueChange}
          icon={<Wallet className="h-5 w-5" />}
        />

        <StatCard
          title="Total Tickets Sold"
          value={totals.totalTickets.toLocaleString()}
          change={ticketsChange}
          icon={<Ticket className="h-5 w-5" />}
        />
        <StatCard
          title="Top-Selling Sport"
          value={totals.topSportName}
          icon={<Trophy className="h-5 w-5" />}
        />
        <StatCard
          title="Top Venue"
          value={totals.topVenueName}
          icon={<MapPin className="h-5 w-5" />}
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Area: Sales Trend */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Sales Trend</h2>
            <p className="text-sm text-gray-500">Tickets and revenue over recent dates</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A2DB3" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1A2DB3" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tickGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#071689" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#071689" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(val: any, name) => (name === "revenue" ? peso(val as number) : val)} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="tickets"
                  name="Tickets"
                  stroke="#071689"
                  fill="url(#tickGrad)"
                  strokeWidth={2}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#1A2DB3"
                  fill="url(#revGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut: Tickets by Sport */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Tickets by Sport</h2>
            <p className="text-sm text-gray-500">Share of tickets sold by sport</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip formatter={(val: any) => `${(val as number).toLocaleString()} tickets`} />
                <Legend />
                <Pie data={TICKETS_BY_SPORT} innerRadius={60} outerRadius={110} dataKey="value" nameKey="name" label>
                  {TICKETS_BY_SPORT.map((entry, i) => (
                    <Cell key={entry.name} fill={["#071689", "#1A2DB3", "#7AA2FF"][i % 3]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Top Events Table */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Top Events</h2>
          <p className="text-sm text-gray-500">Best performers by sales and attendance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-2 font-medium">Event</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Sport</th>
                <th className="px-4 py-2 font-medium">Venue</th>
                <th className="px-4 py-2 font-medium">Tickets Sold</th>
                <th className="px-4 py-2 font-medium">Attendance</th>
                <th className="px-4 py-2 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {TOP_EVENTS.map((e, idx) => {
                const rate = e.capacity ? Math.round((e.ticketsSold / e.capacity) * 100) : 0;
                return (
                  <tr key={e.id} className={idx !== TOP_EVENTS.length - 1 ? "border-b" : ""}>
                    <td className="px-4 py-3 text-gray-900">{e.name}</td>
                    <td className="px-4 py-3 text-gray-700">{e.date}</td>
                    <td className="px-4 py-3 text-gray-700">{e.sport}</td>
                    <td className="px-4 py-3 text-gray-700">{e.venue}</td>
                    <td className="px-4 py-3 text-gray-700">{e.ticketsSold.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#071689]"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{rate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{peso(e.revenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
