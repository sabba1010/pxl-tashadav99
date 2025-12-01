import React, { useMemo, useState } from "react";

/**
 * AdminReports.es.react.tsx
 * Responsive reports page adapted to Spanish (Cuba) and mobile-first layout.
 * Theme color: #166534
 */

type ReportRow = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  type: "Revenue" | "Delivery" | "Pickup";
  amount: number; // for Revenue rows; for others treat as count
  reference?: string; // order id / invoice
  customer?: string;
  note?: string;
};

const THEME = {
  green: "#166534",
};

const FAKE_REPORTS: ReportRow[] = [
  { id: "R-1001", date: "2025-01-12", type: "Revenue", amount: 1200, reference: "INV-1001", customer: "Empresa A" },
  { id: "R-1002", date: "2025-01-11", type: "Delivery", amount: 34, reference: "DLV-2001", customer: "Cliente B" },
  { id: "R-1003", date: "2025-01-11", type: "Pickup", amount: 7, reference: "PK-3001", customer: "Cliente C" },
  { id: "R-1004", date: "2025-01-10", type: "Revenue", amount: 850, reference: "INV-1002", customer: "Empresa D" },
  { id: "R-1005", date: "2025-01-09", type: "Delivery", amount: 21, reference: "DLV-2002", customer: "Cliente E" },
  { id: "R-1006", date: "2025-01-08", type: "Revenue", amount: 4300, reference: "INV-1003", customer: "Empresa F" },
  { id: "R-1007", date: "2024-12-29", type: "Pickup", amount: 12, reference: "PK-3002", customer: "Cliente G" },
  { id: "R-1008", date: "2024-12-21", type: "Revenue", amount: 900, reference: "INV-1004", customer: "Empresa H" },
  { id: "R-1009", date: "2024-11-30", type: "Delivery", amount: 48, reference: "DLV-2003", customer: "Cliente I" },
  { id: "R-1010", date: "2024-10-15", type: "Revenue", amount: 700, reference: "INV-1005", customer: "Empresa J" },
  { id: "R-1011", date: "2025-01-07", type: "Delivery", amount: 15, reference: "DLV-2004", customer: "Cliente K" },
  { id: "R-1012", date: "2025-01-06", type: "Pickup", amount: 5, reference: "PK-3003", customer: "Cliente L" },
  { id: "R-1013", date: "2024-12-05", type: "Revenue", amount: 1200, reference: "INV-1006", customer: "Empresa M" },
  { id: "R-1014", date: "2024-12-01", type: "Delivery", amount: 60, reference: "DLV-2005", customer: "Cliente N" },
  { id: "R-1015", date: "2024-11-20", type: "Pickup", amount: 9, reference: "PK-3004", customer: "Cliente O" },
];

function formatDate(d: string) {
  const dt = new Date(d + "T00:00:00");
  // use Cuban Spanish locale
  return dt.toLocaleDateString("es-CU", { year: "numeric", month: "short", day: "numeric" });
}

function downloadCSV(rows: ReportRow[]) {
  const header = ["id", "date", "type", "amount", "reference", "customer", "note"];
  const csv = [
    header.join(","),
    ...rows.map(r =>
      [
        r.id,
        r.date,
        r.type,
        String(r.amount),
        r.reference ?? "",
        r.customer ?? "",
        r.note ? `"${String(r.note).replace(/"/g, '""')}"` : ""
      ].join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `informes_export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const [from, setFrom] = useState<string>("2024-11-01");
  const [to, setTo] = useState<string>("2025-01-31");
  const [typeFilter, setTypeFilter] = useState<"All" | ReportRow["type"]>("All");
  const [search, setSearch] = useState<string>("");

  // pagination
  const [page, setPage] = useState<number>(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    const f = new Date(from + "T00:00:00");
    const t = new Date(to + "T23:59:59");

    return FAKE_REPORTS.filter(r => {
      const rd = new Date(r.date + "T00:00:00");
      if (rd < f || rd > t) return false;
      if (typeFilter !== "All" && r.type !== typeFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        (r.reference ?? "").toLowerCase().includes(q) ||
        (r.customer ?? "").toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    }).sort((a,b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [from, to, typeFilter, search]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  // KPIs for filtered set
  const kpi = useMemo(() => {
    const revenue = filtered.filter(r => r.type === "Revenue").reduce((s, r) => s + r.amount, 0);
    const deliveries = filtered.filter(r => r.type === "Delivery").reduce((s, r) => s + r.amount, 0);
    const pickups = filtered.filter(r => r.type === "Pickup").reduce((s, r) => s + r.amount, 0);
    return { revenue, deliveries, pickups };
  }, [filtered]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className=" mx-auto ">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Informes</h1>
            <p className="text-sm text-gray-600 mt-1">Resumen y detalles — filtra por fecha, tipo o busca registros.</p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="text-sm text-gray-500 text-right">
              <div>Administrador: <span className="font-medium">Arif Hossain</span></div>
              <div className="text-xs text-gray-400">Último acceso: {new Date("2025-01-10").toLocaleDateString("es-CU")}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Desde</label>
              <input aria-label="Desde" type="date" value={from} onChange={(e)=>{ setFrom(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-md" />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Hasta</label>
              <input aria-label="Hasta" type="date" value={to} onChange={(e)=>{ setTo(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-md" />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-gray-500">Tipo</label>
              <select aria-label="Tipo" value={typeFilter} onChange={(e)=>{ setTypeFilter(e.target.value as any); setPage(1); }} className="px-3 py-2 border rounded-md bg-white">
                <option value="All">Todos</option>
                <option value="Revenue">Ingresos</option>
                <option value="Delivery">Entrega</option>
                <option value="Pickup">Recogida</option>
              </select>
            </div>

            <div className="flex flex-col sm:col-span-2 md:col-span-2">
              <label className="text-xs text-gray-500">Buscar</label>
              <input aria-label="Buscar" placeholder="buscar por id, referencia, cliente..." value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(1); }} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 gap-3">
            <div className="text-sm text-gray-600">Mostrando <span className="font-medium">{total}</span> resultados</div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setFrom("2024-11-01"); setTo("2025-01-31"); setTypeFilter("All"); setSearch(""); setPage(1); }} className="px-3 py-2 border rounded-md text-sm">Restablecer</button>
              <button onClick={() => downloadCSV(filtered)} style={{ background: THEME.green }} className="px-3 py-2 rounded-md text-white text-sm">Exportar CSV</button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow flex flex-col">
            <div className="text-xs text-gray-500">Ingresos totales</div>
            <div className="text-2xl font-bold" style={{ color: THEME.green }}>${kpi.revenue.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-2">Suma de ingresos en el rango filtrado</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow flex flex-col">
            <div className="text-xs text-gray-500">Total entregas</div>
            <div className="text-2xl font-bold text-gray-800">{kpi.deliveries}</div>
            <div className="text-xs text-gray-400 mt-2">Cantidad de entregas</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow flex flex-col">
            <div className="text-xs text-gray-500">Solicitudes de recogida</div>
            <div className="text-2xl font-bold text-gray-800">{kpi.pickups}</div>
            <div className="text-xs text-gray-400 mt-2">Cantidad de recogidas</div>
          </div>
        </div>

        {/* Table for md+ and Cards for small screens */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop / tablet table */}
          <div className="hidden md:block">
            <table className="min-w-full">
              <thead className="bg-[#166534] text-white">
                <tr>
                  <th className="p-3 text-left text-sm">Fecha</th>
                  <th className="p-3 text-left text-sm">ID</th>
                  <th className="p-3 text-left text-sm">Tipo</th>
                  <th className="p-3 text-left text-sm">Referencia</th>
                  <th className="p-3 text-left text-sm">Cliente</th>
                  <th className="p-3 text-right text-sm">Monto</th>
                  <th className="p-3 text-center text-sm">Acción</th>
                </tr>
              </thead>

              <tbody>
                {paged.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm">{formatDate(r.date)}</td>
                    <td className="p-3 font-medium">{r.id}</td>
                    <td className="p-3 text-sm">{r.type === 'Revenue' ? 'Ingresos' : r.type === 'Delivery' ? 'Entrega' : 'Recogida'}</td>
                    <td className="p-3 text-sm">{r.reference ?? "-"}</td>
                    <td className="p-3 text-sm">{r.customer ?? "-"}</td>
                    <td className={`p-3 text-right text-sm ${r.type === "Revenue" ? "text-green-700" : "text-gray-800"}`}>
                      {r.type === "Revenue" ? `$${r.amount.toLocaleString()}` : r.amount}
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => alert(JSON.stringify(r, null, 2))} style={{ background: THEME.green }} className="text-white px-3 py-1 rounded-md text-sm">
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}

                {paged.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">No hay registros que coincidan con los filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="block md:hidden p-3">
            {paged.map(r => (
              <article key={r.id} className="border rounded-lg p-3 mb-3 shadow-sm bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-500">{formatDate(r.date)}</div>
                    <div className="font-medium">{r.id} · <span className="text-sm text-gray-600">{r.customer ?? '-'}</span></div>
                    <div className="text-sm text-gray-600 mt-1">{r.reference ?? '-'}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${r.type === 'Revenue' ? 'text-green-700' : 'text-gray-800'}`}>
                      {r.type === 'Revenue' ? `$${r.amount.toLocaleString()}` : r.amount}
                    </div>
                    <div className="text-xs text-gray-500">{r.type === 'Revenue' ? 'Ingresos' : r.type === 'Delivery' ? 'Entrega' : 'Recogida'}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => alert(JSON.stringify(r, null, 2))} style={{ background: THEME.green }} className="text-white px-3 py-1 rounded-md text-sm">Ver</button>
                  <button onClick={() => navigator.clipboard?.writeText(r.reference ?? r.id)} className="px-3 py-1 border rounded-md text-sm">Copiar ref</button>
                </div>
              </article>
            ))}

            {paged.length === 0 && (
              <div className="p-6 text-center text-gray-500">No hay registros que coincidan con los filtros.</div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
          <div className="text-sm text-gray-600">Mostrando {start + 1}-{Math.min(start + perPage, total)} de {total}</div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded-md disabled:opacity-50">Anterior</button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button key={i} onClick={() => setPage(i+1)} className={`px-3 py-1 rounded-md ${page===i+1 ? "bg-[#166534] text-white" : "border"}`}>{i+1}</button>
              ))}
            </div>
            <button disabled={page === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))} className="px-3 py-1 border rounded-md disabled:opacity-50">Siguiente</button>
          </div>
        </div>

      </div>
    </div>
  );
}
