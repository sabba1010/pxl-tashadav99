import React, { useMemo, useState } from "react";

/*
  Consolidate.client.cuba.tsx
  - Client flow localized for Cuba (Spanish labels) + Cuban locations
  - Fake shipments originate from Cuban cities; UI texts in Spanish (Cuban-friendly)
*/

type Shipment = {
  id: string;
  lockerId: string;
  name: string;
  origin: string;
  weightKg: number;
  volumeM3: number;
  receivedAt: string;
  status: "Recibido" | "En Casillero" | "Consolidado";
  note?: string;
};

const FAKE_SHIPMENTS: Shipment[] = [
  { id: "SHP-CU-1001", lockerId: "XG15STV", name: "Caja Electrónica", origin: "La Habana", weightKg: 4.2, volumeM3: 0.02, receivedAt: "2025-01-09", status: "Recibido" },
  { id: "SHP-CU-1002", lockerId: "AB93HRT", name: "Ropa", origin: "Santiago de Cuba", weightKg: 2.5, volumeM3: 0.015, receivedAt: "2025-01-10", status: "Recibido" },
  { id: "SHP-CU-1003", lockerId: "XG15STV", name: "Cristalería (frágil)", origin: "Camagüey", weightKg: 6.0, volumeM3: 0.04, receivedAt: "2025-01-07", status: "En Casillero" },
  { id: "SHP-CU-1004", lockerId: "LP22AAA", name: "Libros", origin: "Holguín", weightKg: 3.1, volumeM3: 0.025, receivedAt: "2025-01-11", status: "Recibido" },
  { id: "SHP-CU-1005", lockerId: "MK11ZZZ", name: "Zapatos", origin: "Pinar del Río", weightKg: 1.8, volumeM3: 0.01, receivedAt: "2025-01-12", status: "Recibido" },
];

/* Helpers */
function fmtDate(d: string) { return new Date(d).toLocaleDateString(); }
function rndId(prefix = "CNL") { return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; }

/* Fee model (localized currency: USD shown but feel free to adapt) */
const CITY_TIERS: Record<string, number> = {
  "La Habana": 0,
  "Santiago de Cuba": 1,
  "Camagüey": 1,
  "Holguín": 1,
  "Pinar del Río": 1,
  "Matanzas": 1,
  "Bayamo": 2
};

function calcConsolidationFee(totalKg: number, totalVol: number) {
  const base = 10;
  const perKg = 1.2 * totalKg;
  const volSurcharge = totalVol > 0.05 ? 18 : 0;
  const insurance = Math.ceil(totalKg / 5) * 2;
  return Math.round((base + perKg + volSurcharge + insurance) * 100) / 100;
}

function calcDeliveryFee(totalKg: number, destCity: string, type: "normal" | "express") {
  const tier = CITY_TIERS[destCity] ?? 1;
  const base = 15 + tier * 5; // base en USD
  const perKg = 2.0 * totalKg;
  const speedMultiplier = type === "express" ? 1.4 : 1.0;
  const fee = (base + perKg) * speedMultiplier;
  return Math.round(fee * 100) / 100;
}

export default function ConsolidateClientCuba() {
  const [shipments, setShipments] = useState<Shipment[]>(FAKE_SHIPMENTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [notes, setNotes] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [consolidatedResult, setConsolidatedResult] = useState<null | { id: string; items: string[]; fee: number }>(null);

  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliveryDest, setDeliveryDest] = useState<string>("Santiago de Cuba");
  const [deliveryType, setDeliveryType] = useState<"normal" | "express">("normal");
  const [deliveryOrder, setDeliveryOrder] = useState<null | { id: string; consolidatedId: string; dest: string; fee: number }>(null);

  const available = shipments.filter(s => s.status === "Recibido" || s.status === "En Casillero");

  function toggle(id: string) { setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
  function toggleSelectAll() { if (selectAll) { setSelectedIds([]); setSelectAll(false); } else { setSelectedIds(available.map(s => s.id)); setSelectAll(true); } }

  const selectedItems = shipments.filter(s => selectedIds.includes(s.id));

  const totals = useMemo(() => {
    const totalKg = selectedItems.reduce((a, b) => a + b.weightKg, 0);
    const totalVol = selectedItems.reduce((a, b) => a + b.volumeM3, 0);
    const fee = calcConsolidationFee(totalKg, totalVol);
    return { totalKg: Math.round(totalKg * 100) / 100, totalVol: Math.round(totalVol * 1000) / 1000, fee };
  }, [selectedItems]);

  function handleConsolidate() {
    if (selectedItems.length < 2) { alert("Seleccione al menos 2 envíos para consolidar."); return; }
    setConfirmModalOpen(true);
  }

  function confirmConsolidation() {
    const id = rndId("CNL");
    setShipments(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, status: "Consolidado" } : s));
    setConsolidatedResult({ id, items: selectedIds.slice(), fee: totals.fee });
    setSelectedIds([]); setSelectAll(false); setNotes(""); setConfirmModalOpen(false); setDeliveryOpen(true);
  }

  function createDeliveryRequest() {
    if (!consolidatedResult) return alert("Primero consolide los paquetes.");
    const fee = calcDeliveryFee(totals.totalKg || 1, deliveryDest, deliveryType);
    const orderId = rndId("DEL");
    setDeliveryOrder({ id: orderId, consolidatedId: consolidatedResult.id, dest: deliveryDest, fee });
    setDeliveryOpen(false);
    alert(`Orden creada: ${orderId} — destino: ${deliveryDest} — tarifa: $${fee}`);
  }

  function downloadManifestFor(conId?: string) {
    const cid = conId ?? consolidatedResult?.id; if (!cid) return;
    const manifest = { consolidatedId: cid, items: consolidatedResult?.items ?? [], fee: consolidatedResult?.fee ?? 0, createdAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${cid}_manifest.json`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#166534]">Consolidar Envíos (Cliente)</h1>
            <p className="text-sm text-gray-500">Seleccione los paquetes recibidos en La Habana y únalos para envío a otras ciudades de Cuba.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { setSelectedIds([]); setSelectAll(false); }} className="px-3 py-2 border rounded-md">Limpiar</button>
            <button onClick={toggleSelectAll} className="px-3 py-2 border rounded-md">{selectAll ? "Deseleccionar todo" : "Seleccionar todo"}</button>
            <button onClick={handleConsolidate} className="px-4 py-2 bg-[#166534] text-white rounded-md">Crear caja consolidada</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Envíos disponibles ({available.length})</h3>
                <div className="text-sm text-gray-500">Seleccione 2 o más para consolidar</div>
              </div>

              <div className="hidden md:block">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 w-12"><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
                      <th className="p-3">ID</th>
                      <th className="p-3">Descripción</th>
                      <th className="p-3">Origen</th>
                      <th className="p-3">Peso (kg)</th>
                      <th className="p-3">Volumen (m³)</th>
                      <th className="p-3">Recibido</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {available.map(s => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="p-3"><input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggle(s.id)} /></td>
                        <td className="p-3 font-medium">{s.id}</td>
                        <td className="p-3">{s.name}</td>
                        <td className="p-3">{s.origin}</td>
                        <td className="p-3">{s.weightKg}</td>
                        <td className="p-3">{s.volumeM3}</td>
                        <td className="p-3">{fmtDate(s.receivedAt)}</td>
                        <td className="p-3">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {available.map(s => (
                  <div key={s.id} className="bg-gray-50 border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.id} • {s.origin}</div>
                        <div className="text-xs text-gray-500 mt-1">Recibido: {fmtDate(s.receivedAt)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{s.weightKg} kg</div>
                        <div className="text-xs text-gray-500">{s.volumeM3} m³</div>
                        <div className="mt-2"><input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggle(s.id)} /></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500">Items seleccionados</div>
                <div className="text-2xl font-bold text-[#166534]">{selectedIds.length}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500">Peso total (kg)</div>
                <div className="text-2xl font-bold">{totals.totalKg}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500">Volumen total (m³)</div>
                <div className="text-2xl font-bold">{totals.totalVol}</div>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold">Resumen de consolidación</h4>
            <div className="mt-3 text-sm text-gray-500">Items seleccionados</div>
            <ul className="mt-2 text-sm space-y-1">
              {selectedItems.length === 0 && <li className="text-gray-400">No hay items seleccionados</li>}
              {selectedItems.map(s => (
                <li key={s.id} className="flex items-center justify-between">
                  <div>{s.id} • {s.name}</div>
                  <div className="text-sm text-gray-500">{s.weightKg} kg</div>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t pt-3">
              <div className="flex items-center justify-between text-sm text-gray-600"><div>Peso total</div><div>{totals.totalKg} kg</div></div>
              <div className="flex items-center justify-between text-sm text-gray-600 mt-1"><div>Volumen total</div><div>{totals.totalVol} m³</div></div>
              <div className="flex items-center justify-between text-sm font-semibold mt-3"><div>Tarifa estimada</div><div>${totals.fee}</div></div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-500">Notas para el almacén</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full mt-2 border rounded p-2" placeholder="Fragile, manejar con cuidado..." rows={3} />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button onClick={handleConsolidate} className="px-3 py-2 bg-[#166534] text-white rounded-md">Proceder a consolidar</button>
              <button onClick={() => { setSelectedIds([]); setNotes(""); }} className="px-3 py-2 border rounded-md">Reiniciar</button>

              {consolidatedResult && (
                <div className="mt-3 text-sm">
                  <div className="font-medium">Última consolidación:</div>
                  <div className="mt-1">ID: <span className="font-semibold">{consolidatedResult.id}</span></div>
                  <div className="mt-1">Items: {consolidatedResult.items.join(', ')}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => downloadManifestFor(consolidatedResult.id)} className="px-3 py-2 border rounded-md">Descargar manifiesto</button>
                    <button onClick={() => navigator.clipboard?.writeText(consolidatedResult.id)} className="px-3 py-2 border rounded-md">Copiar ID</button>
                    <button onClick={() => setDeliveryOpen(true)} className="px-3 py-2 bg-indigo-600 text-white rounded-md">Crear solicitud de entrega</button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {confirmModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-xl font-bold">Confirmar consolidación</h3>
              <div className="mt-3 text-sm text-gray-600">Va a consolidar {selectedItems.length} envíos en una sola caja.</div>

              <div className="mt-4">
                <div className="text-sm text-gray-500">Totales estimados</div>
                <div className="mt-2 flex items-center justify-between"><div>Peso total</div><div className="font-medium">{totals.totalKg} kg</div></div>
                <div className="mt-1 flex items-center justify-between"><div>Volumen total</div><div className="font-medium">{totals.totalVol} m³</div></div>
                <div className="mt-3 flex items-center justify-between text-sm font-semibold"><div>Tarifa estimada</div><div>${totals.fee}</div></div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setConfirmModalOpen(false)} className="px-3 py-2 border rounded-md">Cancelar</button>
                <button onClick={confirmConsolidation} className="px-3 py-2 bg-[#166534] text-white rounded-md">Confirmar y crear</button>
              </div>
            </div>
          </div>
        )}

        {deliveryOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold">Crear solicitud de entrega</h3>
              <p className="text-sm text-gray-500 mt-1">ID consolidado: <span className="font-medium">{consolidatedResult?.id}</span></p>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Ciudad destino</label>
                  <select value={deliveryDest} onChange={e => setDeliveryDest(e.target.value)} className="w-full border rounded p-2 mt-1">
                    <option>La Habana</option>
                    <option>Santiago de Cuba</option>
                    <option>Camagüey</option>
                    <option>Holguín</option>
                    <option>Pinar del Río</option>
                    <option>Matanzas</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Tipo de entrega</label>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setDeliveryType("normal")} className={`px-3 py-2 rounded-md ${deliveryType === "normal" ? "bg-[#166534] text-white" : "border"}`}>Normal</button>
                    <button onClick={() => setDeliveryType("express")} className={`px-3 py-2 rounded-md ${deliveryType === "express" ? "bg-[#166534] text-white" : "border"}`}>Express</button>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between text-sm"><div>Tarifa estimada de entrega</div><div className="font-medium">${calcDeliveryFee(totals.totalKg || 1, deliveryDest, deliveryType)}</div></div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setDeliveryOpen(false)} className="px-3 py-2 border rounded-md">Cancelar</button>
                <button onClick={createDeliveryRequest} className="px-3 py-2 bg-[#166534] text-white rounded-md">Crear entrega</button>
              </div>
            </div>
          </div>
        )}

        {deliveryOrder && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Orden de entrega</div>
                <div className="font-semibold">{deliveryOrder.id} — hacia {deliveryOrder.dest}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-sm text-gray-500">Tarifa</div>
                <div className="font-medium">${deliveryOrder.fee}</div>
                <button onClick={() => navigator.clipboard?.writeText(deliveryOrder.id)} className="px-2 py-1 border rounded">Copiar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
