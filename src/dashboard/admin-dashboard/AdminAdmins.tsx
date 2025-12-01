import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useCurrentUser } from "../../context/useCurrentUser";

/** PRIMARY THEME COLOR */
const PRIMARY = "#166534"; // as you requested (#166534)

/** ---------- SINGLE ADMIN ---------- */
const ADMIN = {
  id: "a1",
  name: "Arif Hossain",
  email: "arif@shining.co",
  role: "Super",
  status: "active",
  joined: "2021-06-02",
  lastLogin: "2025-01-10 09:12",
  revenueHandled: 12500,
};

/** Quick metrics (fake) */
const QUICK = {
  usersCount: 1284,
  parcelsDelivered: 7523,
  pickupRequests: 42,
};

/** Monthly revenue for chart (fake) */
const REVENUE_MONTHS = [
  { month: "Aug", revenue: 4800 },
  { month: "Sep", revenue: 5200 },
  { month: "Oct", revenue: 6100 },
  { month: "Nov", revenue: 7300 },
  { month: "Dec", revenue: 9000 },
  { month: "Jan", revenue: 11000 },
];

/** Income table rows (fake) */
type IncomeRow = {
  id: string;
  date: string; // ISO date or '2025-01-10'
  amount: number;
  type: "Delivery Fee" | "Subscription" | "Refund";
  orderId?: string;
  customer?: string;
  note?: string;
};

const INCOME_DATA: IncomeRow[] = [
  {
    id: "i1",
    date: "2025-01-12",
    amount: 1200,
    type: "Delivery Fee",
    orderId: "ORD-1001",
    customer: "Customer A",
  },
  {
    id: "i2",
    date: "2025-01-11",
    amount: 2500,
    type: "Subscription",
    orderId: "SUB-901",
    customer: "Company B",
  },
  {
    id: "i3",
    date: "2024-12-29",
    amount: -50,
    type: "Refund",
    orderId: "REF-77",
    customer: "Customer C",
  },
  {
    id: "i4",
    date: "2024-12-21",
    amount: 900,
    type: "Delivery Fee",
    orderId: "ORD-098",
    customer: "Customer D",
  },
  {
    id: "i5",
    date: "2024-11-30",
    amount: 4500,
    type: "Subscription",
    orderId: "SUB-812",
    customer: "Company E",
  },
  {
    id: "i6",
    date: "2024-10-15",
    amount: 700,
    type: "Delivery Fee",
    orderId: "ORD-777",
    customer: "Customer F",
  },
  {
    id: "i7",
    date: "2025-01-09",
    amount: 350,
    type: "Delivery Fee",
    orderId: "ORD-1102",
    customer: "Customer G",
  },
  {
    id: "i8",
    date: "2024-12-05",
    amount: 1200,
    type: "Delivery Fee",
    orderId: "ORD-1008",
    customer: "Customer H",
  },
];

/** Helper: format date */
function fmtDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

/** Convert date to month key e.g., "Jan-2025" */
function monthKey(d: string) {
  const dt = new Date(d);
  return `${dt.toLocaleString(undefined, {
    month: "short",
  })}-${dt.getFullYear()}`;
}

/** Main component */
export default function AdminAdmins() {
  const LoginUser = useCurrentUser();
  console.log(LoginUser);
  // Income filters
  const [filterMonth, setFilterMonth] = useState<string>("all"); // monthKey or 'all'
  const [filterType, setFilterType] = useState<string>("all"); // Delivery Fee / Subscription / Refund
  const [search, setSearch] = useState<string>("");

  // derive month options from INCOME_DATA
  const months = useMemo(() => {
    const set = new Set<string>();
    INCOME_DATA.forEach((r) => set.add(monthKey(r.date)));
    return Array.from(set).sort((a, b) => {
      // sort by year-month descending
      const pa = a.split("-");
      const pb = b.split("-");
      const da = new Date(pa[1] + " " + pa[0] + " 1");
      const db = new Date(pb[1] + " " + pb[0] + " 1");
      return db.getTime() - da.getTime();
    });
  }, []);

  // filter rows
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return INCOME_DATA.filter((r) => {
      if (filterMonth !== "all" && monthKey(r.date) !== filterMonth)
        return false;
      if (filterType !== "all" && r.type !== filterType) return false;
      if (!q) return true;
      return (
        r.orderId?.toLowerCase().includes(q) ||
        r.customer?.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filterMonth, filterType, search]);

  const totalFiltered = useMemo(
    () => filteredRows.reduce((s, r) => s + r.amount, 0),
    [filteredRows]
  );

  return (
    <div className="p-6 bg-[#f7faf7] min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600">
              Single-admin dashboard — quick overview & income table
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Logged in as</div>
            <div className="font-medium">
              {LoginUser?.name} — {LoginUser?.email}
            </div>
          </div>
        </div>

        {/* Quick cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">
              {QUICK.usersCount}
            </div>
            <div className="text-xs text-gray-400 mt-1">Registered users</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">Parcels Delivered</div>
            <div className="text-2xl font-bold text-gray-900">
              {QUICK.parcelsDelivered}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total deliveries</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">Pickup Requests</div>
            <div className="text-2xl font-bold text-gray-900">
              {QUICK.pickupRequests}
            </div>
            <div className="text-xs text-gray-400 mt-1">Pending pickups</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">Income (filtered)</div>
            <div className="text-2xl font-bold" style={{ color: PRIMARY }}>
              ${totalFiltered.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Sum of visible rows
            </div>
          </div>
        </div>

        {/* Charts + filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* chart */}
          <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium text-gray-900">
                Monthly Revenue
              </h3>
              <div className="text-sm text-gray-500">Last 6 months</div>
            </div>

            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={REVENUE_MONTHS}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={PRIMARY}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* filters */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-medium mb-3 text-gray-900">Filters</h4>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Month
                </label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="all">All months</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="all">All types</option>
                  <option value="Delivery Fee">Delivery Fee</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Refund">Refund</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Search
                </label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Order ID, customer, or type..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setFilterMonth("all");
                    setFilterType("all");
                    setSearch("");
                  }}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Income table */}
        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-gray-900">Income table</h3>
            <div className="text-sm text-gray-500">
              Showing {filteredRows.length} rows — Total:{" "}
              <span style={{ color: PRIMARY }}>
                ${totalFiltered.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-2">Date</th>
                  <th className="p-2">Order</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Type</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{fmtDate(row.date)}</td>
                    <td className="p-2">{row.orderId ?? "—"}</td>
                    <td className="p-2">{row.customer ?? "—"}</td>
                    <td className="p-2">{row.type}</td>
                    <td
                      className={`p-2 text-right ${
                        row.amount < 0 ? "text-red-600" : ""
                      }`}
                    >
                      <span
                        style={{ color: row.amount < 0 ? undefined : PRIMARY }}
                      >
                        ${row.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer quick actions */}
        <div className="flex gap-3">
          <button
            onClick={() => alert("Export CSV (simulated)")}
            className="px-4 py-2 border rounded-md"
            style={{ borderColor: PRIMARY, color: PRIMARY }}
          >
            Export CSV
          </button>
          <button
            onClick={() => alert("Download report (simulated)")}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: PRIMARY }}
          >
            Download report
          </button>
        </div>
      </div>
    </div>
  );
}
