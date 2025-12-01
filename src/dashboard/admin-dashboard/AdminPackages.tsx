import React, { useMemo, useState } from "react";

/** ---------------- Types ---------------- */
type Package = {
  id: string;
  name: string;
  price: string;
  category: string;
  storage: string;
  users: string;
  speed: string;
  security: string;
  support: string;
  description: string;
  created: string;
  status: "active" | "inactive";
};

/** --------------- Fake data (same as provided) --------------- */
const PACKAGES: Package[] = [
  { id: "PKG-1001", name: "Plan Básico", price: "39 USD/mes", category: "Pequeñas Empresas", storage: "20 GB", users: "3 Usuarios", speed: "Normal", security: "Protección estándar", support: "Soporte por Email", description: "Ideal para pequeños negocios y emprendedores en Cuba.", created: "2024-01-12", status: "active" },
  { id: "PKG-1002", name: "Plan Inicial", price: "49 USD/mes", category: "Pequeñas Empresas", storage: "50 GB", users: "5 Usuarios", speed: "Alta", security: "Firewall Básico", support: "Email + Chat", description: "Paquete con herramientas esenciales para la gestión diaria.", created: "2024-02-10", status: "active" },
  { id: "PKG-1003", name: "Plan Empresarial", price: "129 USD/mes", category: "Empresas Medianas", storage: "200 GB", users: "25 Usuarios", speed: "Premium", security: "Firewall Avanzado", support: "Soporte Prioritario", description: "Diseñado para empresas en crecimiento.", created: "2024-03-05", status: "active" },
  { id: "PKG-1004", name: "Plan Premium", price: "249 USD/mes", category: "Empresas Medianas", storage: "500 GB", users: "Ilimitados", speed: "Ultra", security: "Auditorías + Seguridad Avanzada", support: "Soporte 24/7", description: "Escalabilidad y automatización avanzada.", created: "2024-04-12", status: "active" },
  { id: "PKG-1005", name: "Suite Corporativa", price: "Precio Personalizado", category: "Grandes Organizaciones", storage: "Ilimitado", users: "Ilimitados", speed: "Ultra Max", security: "Cumplimiento GDPR + SOC2", support: "Equipo Dedicado 24/7", description: "Infraestructura dedicada para grandes compañías.", created: "2023-11-18", status: "active" },
  { id: "PKG-1006", name: "Plan Avanzado Internacional", price: "299 USD/mes", category: "Empresas Internacionales", storage: "1 TB", users: "50 Usuarios", speed: "Ultra Global", security: "Cifrado Multi-Región", support: "Soporte Multilingüe", description: "Conectividad global para operaciones fuera de Cuba.", created: "2024-06-01", status: "active" },
  { id: "PKG-1007", name: "Starter Light", price: "19 USD/mes", category: "Micro", storage: "5 GB", users: "1 Usuario", speed: "Básica", security: "SSL", support: "Email", description: "Muy económico para pruebas.", created: "2024-07-05", status: "inactive" },
  { id: "PKG-1008", name: "SMB Growth", price: "79 USD/mes", category: "Pequeñas Empresas", storage: "120 GB", users: "15 Usuarios", speed: "Mejorada", security: "Firewall", support: "Email + Chat", description: "Ideal para pymes que crecen rápido.", created: "2024-08-13", status: "active" },
  { id: "PKG-1009", name: "Cross-Border", price: "159 USD/mes", category: "Empresas Internacionales", storage: "300 GB", users: "40 Usuarios", speed: "Premium", security: "Cifrado", support: "Soporte Multilingüe", description: "Optimizado para envíos y operaciones internacionales.", created: "2024-09-20", status: "active" },
  { id: "PKG-1010", name: "Enterprise Plus", price: "499 USD/mes", category: "Grandes Organizaciones", storage: "2 TB", users: "Ilimitados", speed: "Ultra Max", security: "Enterprise Security", support: "Cuenta Dedicada", description: "Solución empresarial completa.", created: "2024-10-30", status: "active" },
  { id: "PKG-1011", name: "NonProfit Plan", price: "29 USD/mes", category: "ONG", storage: "100 GB", users: "10 Usuarios", speed: "Normal", security: "Protección estándar", support: "Soporte Email", description: "Descuentos para ONGs y organizaciones sociales.", created: "2024-11-21", status: "active" },
  { id: "PKG-1012", name: "Local SMB", price: "59 USD/mes", category: "Pequeñas Empresas", storage: "80 GB", users: "10 Usuarios", speed: "Alta", security: "Firewall", support: "Soporte Prioritario", description: "Fuerte en control y analíticas locales.", created: "2024-12-02", status: "active" },
];

/** ---------------- Helpers ---------------- */
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString();
}

function parseNumericPrice(price: string) {
  const m = price.match(/[\d,.]+/);
  if (!m) return Number.POSITIVE_INFINITY;
  return Number(String(m[0]).replace(/,/g, ""));
}

/** -------------- Responsive Component -------------- */
export default function AdminPackagesResponsive() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(6);
  const [sortBy, setSortBy] = useState<keyof Package | "price">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Package | null>(null);

  const categories = useMemo(() => ["all", ...Array.from(new Set(PACKAGES.map(p => p.category)))], []);
  const statuses = useMemo(() => ["all", "active", "inactive"], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PACKAGES.filter(p => {
      const matchesQ = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQ && matchesCategory && matchesStatus;
    });

    // sort
    list = list.sort((a, b) => {
      if (sortBy === "price") {
        const pa = parseNumericPrice(a.price);
        const pb = parseNumericPrice(b.price);
        return sortDir === "asc" ? pa - pb : pb - pa;
      }
      const aVal = String((a as any)[sortBy]);
      const bVal = String((b as any)[sortBy]);
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return list;
  }, [query, categoryFilter, statusFilter, sortBy, sortDir]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  function toggleSort(col: keyof Package | "price") {
    if (sortBy === col) setSortDir(prev => prev === "asc" ? "desc" : "asc");
    else { setSortBy(col as any); setSortDir("asc"); }
  }

  return (
    <div className="p-6 bg-[#f7faf7] min-h-screen">
      <div className=" mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Packages</h2>
            <p className="text-sm text-gray-500">Shining Company — Paquetes (verde dashboard)</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre, categoría..."
              className="px-3 py-2 border rounded-md shadow-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setQuery(""); setCategoryFilter("all"); setStatusFilter("all"); setPage(1); }}
                className="px-3 py-2 border rounded-md"
              >
                Reset
              </button>

              <button
                onClick={() => alert("Nueva acción: Create package (simulado)")}
                className="px-4 py-2 bg-[#166534] text-white rounded-md shadow hover:bg-[#14572b] transition"
              >
                New Package
              </button>
            </div>
          </div>
        </div>

        {/* KPI cards (small) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">Total Paquetes</div>
            <div className="text-2xl font-bold text-[#166534]">{PACKAGES.length}</div>
            <div className="text-xs text-gray-400 mt-1">Paquetes en catálogo</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">Activos</div>
            <div className="text-2xl font-bold text-green-600">{PACKAGES.filter(p=>p.status==="active").length}</div>
            <div className="text-xs text-gray-400 mt-1">Paquetes disponibles</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">Categorías</div>
            <div className="text-2xl font-bold text-[#166534]">{categories.length - 1}</div>
            <div className="text-xs text-gray-400 mt-1">Tipos de paquetes</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-xs text-gray-500">Ingresos (ej.)</div>
            <div className="text-2xl font-bold text-indigo-700">$ { (PACKAGES.length * 120).toLocaleString() }</div>
            <div className="text-xs text-gray-400 mt-1">Estimado (fake)</div>
          </div>
        </div>

        {/* Filters row */}
        <div className="bg-white rounded-lg p-4 shadow mb-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex gap-3 flex-wrap items-center">
              <div>
                <label className="text-xs text-gray-500">Categoría</label>
                <select value={categoryFilter} onChange={(e)=>{ setCategoryFilter(e.target.value); setPage(1); }} className="ml-2 px-3 py-2 border rounded-md">
                  {categories.map(c => <option key={c} value={c}>{c === "all" ? "Todas" : c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Estado</label>
                <select value={statusFilter} onChange={(e)=>{ setStatusFilter(e.target.value); setPage(1); }} className="ml-2 px-3 py-2 border rounded-md">
                  {statuses.map(s => <option key={s} value={s}>{s === "all" ? "Todos" : s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Ordenar por</label>
                <select value={String(sortBy)} onChange={(e)=>{ const v = e.target.value as any; setSortBy(v); setSortDir("asc"); }} className="ml-2 px-3 py-2 border rounded-md">
                  <option value="name">Nombre</option>
                  <option value="created">Fecha</option>
                  <option value="price">Precio</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="text-sm text-gray-500">Vista rápida</div>
              <button onClick={()=>{ setSortDir('asc'); setSortBy('name'); }} className="px-3 py-2 border rounded-md">A→Z</button>
              <button onClick={()=>{ setSortDir('desc'); setSortBy('name'); }} className="px-3 py-2 border rounded-md">Z→A</button>
            </div>
          </div>
        </div>

        {/* Desktop table (md and up) */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#166534] text-white">
              <tr>
                <th className="text-left p-4">Paquete</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4 cursor-pointer" onClick={()=>toggleSort("price")}>Precio {sortBy==="price" ? (sortDir==="asc" ? "▲" : "▼") : ""}</th>
                <th className="text-left p-4">Usuarios</th>
                <th className="text-left p-4">Almacenamiento</th>
                <th className="text-left p-4">Creado</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {paged.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#166534] text-white flex items-center justify-center font-semibold">{p.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                      <div>
                        <div className="font-medium text-gray-800">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.description}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-700">{p.category}</td>
                  <td className="p-4 font-semibold">{p.price}</td>
                  <td className="p-4">{p.users}</td>
                  <td className="p-4">{p.storage}</td>
                  <td className="p-4">{fmtDate(p.created)}</td>

                  <td className="p-4">
                    {p.status === "active" ? (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Activo</span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactivo</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button onClick={()=>setSelected(p)} className="px-3 py-1 border rounded-md text-sm">Detalles</button>
                      <button onClick={()=>alert(`Edit ${p.name} (simulado)`)} className="px-3 py-1 bg-[#166534] text-white rounded-md text-sm hover:bg-[#14572b]">Editar</button>
                    </div>
                  </td>
                </tr>
              ))}

              {paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">No se encontraron paquetes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards (smaller screens) */}
        <div className="md:hidden space-y-3">
          {paged.map(p => (
            <article key={p.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#166534] text-white flex items-center justify-center font-semibold">{p.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                  <div>
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category} • {fmtDate(p.created)}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">{p.price}</div>
                  <div className="text-xs mt-1">
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full ${p.status==='active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">{p.description}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-700">
                <div className="px-2 py-1 border rounded">Usuarios: {p.users}</div>
                <div className="px-2 py-1 border rounded">Almac.: {p.storage}</div>
                <div className="px-2 py-1 border rounded">Vel.: {p.speed}</div>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={()=>setSelected(p)} className="px-3 py-1 border rounded-md text-sm">Detalles</button>
                <button onClick={()=>alert(`Edit ${p.name} (simulado)`)} className="px-3 py-1 bg-[#166534] text-white rounded-md text-sm hover:bg-[#14572b]">Editar</button>
              </div>
            </article>
          ))}

          {paged.length === 0 && (
            <div className="text-center text-gray-500">No se encontraron paquetes.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-3">
          <div className="text-sm text-gray-600">Showing {total === 0 ? 0 : start + 1} - {Math.min(start + perPage, total)} of {total}</div>
          <div className="flex items-center gap-2">
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border rounded-md disabled:opacity-50">Prev</button>
            <div className="flex gap-1">
              {Array.from({length: pageCount}).map((_, i) => (
                <button key={i} onClick={()=>setPage(i+1)} className={`px-3 py-1 rounded-md ${page===i+1 ? 'bg-[#166534] text-white' : 'border'}`}>{i+1}</button>
              ))}
            </div>
            <button disabled={page===pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
          </div>
        </div>

      </div>

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.category} • {selected.price}</p>
              </div>
              <div>
                <button onClick={()=>setSelected(null)} className="text-gray-600">✕</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700">Detalles</h4>
                <ul className="text-sm text-gray-700 mt-2 space-y-1">
                  <li><b>Usuarios:</b> {selected.users}</li>
                  <li><b>Almacenamiento:</b> {selected.storage}</li>
                  <li><b>Velocidad:</b> {selected.speed}</li>
                  <li><b>Seguridad:</b> {selected.security}</li>
                  <li><b>Soporte:</b> {selected.support}</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700">Descripción</h4>
                <p className="text-sm text-gray-700 mt-2">{selected.description}</p>
                <div className="mt-4 text-sm text-gray-500"><b>Creado:</b> {fmtDate(selected.created)}</div>
                <div className="mt-1 text-sm">
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full ${selected.status==='active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{selected.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={()=>setSelected(null)} className="px-4 py-2 border rounded-md">Cerrar</button>
              <button onClick={()=>alert(`Comprar ${selected.name} (simulado)`)} className="px-4 py-2 bg-[#166534] text-white rounded-md hover:bg-[#14572b]">Contratar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
