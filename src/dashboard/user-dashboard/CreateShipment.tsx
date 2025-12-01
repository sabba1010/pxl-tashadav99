import React, { useMemo, useState } from "react";

/**
 * CreateShipment.combined.cuba.tsx
 * - Combined UI for:
 *   A) Local Cuba Delivery (Dentro de Cuba)
 *   B) From Locker (Miami -> Cuba)
 *
 * Spanish (Cuban-friendly) labels. Fake data + simple fee calc + manifest download.
 */

/* ---------------- Types & Fake Data ---------------- */
type LockerItem = {
  id: string;
  lockerId: string;
  title: string;
  weightKg: number;
  declaredValueUsd: number;
  arrivedAt: string;
  status: "In Miami" | "Ready" | "Consolidated";
};

const FAKE_LOCKER_ITEMS: LockerItem[] = [
  { id: "MIAM-1001", lockerId: "XG15STV", title: "Zapatos - Nike", weightKg: 1.4, declaredValueUsd: 79, arrivedAt: "2025-01-10", status: "Ready" },
  { id: "MIAM-1002", lockerId: "AB93HRT", title: "Smartphone", weightKg: 0.6, declaredValueUsd: 399, arrivedAt: "2025-01-11", status: "In Miami" },
  { id: "MIAM-1003", lockerId: "XG15STV", title: "Ropa x3", weightKg: 2.1, declaredValueUsd: 45, arrivedAt: "2025-01-12", status: "Ready" },
];

/* Local shipments (Dentro de Cuba) - optional starter values */
const SAMPLE_LOCAL = {
  fromName: "Juan Perez",
  fromPhone: "+53 5 555-0101",
  fromCity: "La Habana",
};

/* ---------------- Helpers ---------------- */
function fmtDate(d: string) { return new Date(d).toLocaleDateString(); }
function rnd(prefix = "ID") { return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; }

/* Simple fees */
const CITY_TIERS: Record<string, number> = { "La Habana": 0, "Santiago de Cuba": 1, "Camagüey": 1, "Holguín": 1, "Pinar del Río": 1, "Matanzas": 1 };
function calcLocalFee(weightKg: number, city: string, type: "normal" | "express") {
  const tier = CITY_TIERS[city] ?? 1;
  const base = 10 + tier * 3; // USD
  const perKg = 1.8 * Math.max(1, weightKg);
  const mult = type === "express" ? 1.4 : 1.0;
  return Math.round((base + perKg) * mult * 100) / 100;
}

function calcFromLockerFee(weightKg: number, declaredUsd: number, city: string, type: "normal" | "express") {
  // handling + customs (fake) + local delivery
  const handling = 12; // warehouse handling
  const customs = Math.round((declaredUsd * 0.05) * 100) / 100; // 5% ad-hoc tax
  const local = calcLocalFee(weightKg, city, type);
  return Math.round((handling + customs + local) * 100) / 100;
}

/* ---------------- Component ---------------- */
export default function CreateShipmentCombinedCuba() {
  const [tab, setTab] = useState<"local" | "fromLocker">("local");

  // Local shipment form
  const [localFromName, setLocalFromName] = useState(SAMPLE_LOCAL.fromName);
  const [localFromPhone, setLocalFromPhone] = useState(SAMPLE_LOCAL.fromPhone);
  const [localFromCity, setLocalFromCity] = useState(SAMPLE_LOCAL.fromCity);
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toCity, setToCity] = useState("Santiago de Cuba");
  const [weightKg, setWeightKg] = useState<number | "">(1);
  const [lengthCm, setLengthCm] = useState<number | "">(20);
  const [widthCm, setWidthCm] = useState<number | "">(15);
  const [heightCm, setHeightCm] = useState<number | "">(8);
  const [valueUsd, setValueUsd] = useState<number | "">(0);
  const [deliveryTypeLocal, setDeliveryTypeLocal] = useState<"normal" | "express">("normal");
  const [paymentMethodLocal, setPaymentMethodLocal] = useState<"wallet" | "cod" | "card">("wallet");

  // From locker flow
  const [lockerItems] = useState<LockerItem[]>(FAKE_LOCKER_ITEMS);
  const [selectedLockerIds, setSelectedLockerIds] = useState<string[]>([]);
  const [consolidate, setConsolidate] = useState(false);
  const [consolidatedId, setConsolidatedId] = useState<string | null>(null);
  const [deliveryDestLocker, setDeliveryDestLocker] = useState<string>("La Habana");
  const [deliveryTypeLocker, setDeliveryTypeLocker] = useState<"normal" | "express">("normal");

  // Results
  const [createdLocalId, setCreatedLocalId] = useState<string | null>(null);
  const [createdFromLockerOrder, setCreatedFromLockerOrder] = useState<{ id: string; fee: number } | null>(null);

  /* Derived */
  const selLockerItems = lockerItems.filter(it => selectedLockerIds.includes(it.id));
  const selWeight = selLockerItems.reduce((a, b) => a + b.weightKg, 0);
  const selDeclared = selLockerItems.reduce((a, b) => a + b.declaredValueUsd, 0);

  const localFee = useMemo(() => {
    const w = typeof weightKg === "number" ? weightKg : 1;
    return calcLocalFee(w, toCity, deliveryTypeLocal);
  }, [weightKg, toCity, deliveryTypeLocal]);

  const lockerFee = useMemo(() => {
    return calcFromLockerFee(selWeight || 1, selDeclared || 0, deliveryDestLocker, deliveryTypeLocker);
  }, [selWeight, selDeclared, deliveryDestLocker, deliveryTypeLocker]);

  /* Handlers */
  function toggleLockerItem(id: string) {
    setSelectedLockerIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleCreateLocal() {
    // validation
    if (!toName || !toPhone || !toAddress) return alert("Por favor complete los datos del destinatario.");
    const id = rnd("LOC");
    setCreatedLocalId(id);
    // in real app: POST /api/shipments
    alert(`Shipment creado: ${id} — Est. tarifa: $${localFee}`);
  }

  function handleConsolidateLocker() {
    if (selectedLockerIds.length < 1) return alert("Seleccione al menos 1 ítem del locker para continuar.");
    if (!consolidate) {
      // create consolidación
      const c = rnd("CNL");
      setConsolidatedId(c);
      setConsolidate(true);
      alert(`Consolidación creada: ${c}`);
    } else {
      // already consolidated
      alert(`Ya consolidado: ${consolidatedId}`);
    }
  }

  function handleCreateFromLockerDelivery() {
    if (!consolidate && selectedLockerIds.length === 0) return alert("Seleccione item(s) o cree una consolidación antes de crear entrega.");
    // create order
    const id = rnd("DEL");
    setCreatedFromLockerOrder({ id, fee: lockerFee });
    alert(`Orden de entrega creada: ${id} — tarifa: $${lockerFee}`);
    // reset selections (simulate)
    setSelectedLockerIds([]);
    setConsolidate(false);
    setConsolidatedId(null);
  }

  function downloadManifestLocal() {
    if (!createdLocalId) return;
    const manifest = {
      shipmentId: createdLocalId,
      to: { name: toName, phone: toPhone, address: toAddress, city: toCity },
      weightKg, dimensionsCm: { lengthCm, widthCm, heightCm }, valueUsd, deliveryType: deliveryTypeLocal, fee: localFee,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${createdLocalId}_manifest.json`; a.click(); URL.revokeObjectURL(url);
  }

  function downloadManifestLocker() {
    if (!createdFromLockerOrder) return;
    const manifest = {
      orderId: createdFromLockerOrder.id,
      consolidatedId: consolidatedId,
      items: selLockerItems,
      fee: createdFromLockerOrder.fee,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${createdFromLockerOrder.id}_manifest.json`; a.click(); URL.revokeObjectURL(url);
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#166534]">Crear Envío — Cuba</h1>
          <div className="text-sm text-gray-500">Selecciona flujo: Envío Local o Desde Locker (Miami)</div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 ">
          <button onClick={() => setTab("local")} className={`px-4 py-2 rounded-md ${tab === "local" ? "bg-[#166534] text-white" : "border"}`}>A) Envío Local (Dentro de Cuba)</button>
          <button onClick={() => setTab("fromLocker")} className={`px-4 py-2 rounded-md ${tab === "fromLocker" ? "bg-[#166534] text-white" : "border"}`}>B) Desde Locker (Miami → Cuba)</button>
        </div>


        {tab === "local" ? (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-3">A) Envío Local — Formulario</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500">Remitente (From)</label>
                <input value={localFromName} onChange={e => setLocalFromName(e.target.value)} className="w-full border rounded p-2 mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-500">Teléfono remitente</label>
                <input value={localFromPhone} onChange={e => setLocalFromPhone(e.target.value)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Ciudad origen</label>
                <select value={localFromCity} onChange={e => setLocalFromCity(e.target.value)} className="w-full border rounded p-2 mt-1">
                  <option>La Habana</option>
                  <option>Santiago de Cuba</option>
                  <option>Camagüey</option>
                  <option>Holguín</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">Nombre destinatario</label>
                <input value={toName} onChange={e => setToName(e.target.value)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Teléfono destinatario</label>
                <input value={toPhone} onChange={e => setToPhone(e.target.value)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Ciudad destino</label>
                <select value={toCity} onChange={e => setToCity(e.target.value)} className="w-full border rounded p-2 mt-1">
                  <option>Santiago de Cuba</option>
                  <option>La Habana</option>
                  <option>Camagüey</option>
                  <option>Holguín</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-gray-500">Dirección destino</label>
                <input value={toAddress} onChange={e => setToAddress(e.target.value)} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Peso (kg)</label>
                <input type="number" value={weightKg as any} onChange={e => setWeightKg(Number(e.target.value))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Valor declarado (USD)</label>
                <input type="number" value={valueUsd as any} onChange={e => setValueUsd(Number(e.target.value))} className="w-full border rounded p-2 mt-1" />
              </div>

              <div>
                <label className="text-sm text-gray-500">Dimensiones (L × W × H cm)</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" value={lengthCm as any} onChange={e => setLengthCm(Number(e.target.value))} className="w-1/3 border rounded p-2" placeholder="L" />
                  <input type="number" value={widthCm as any} onChange={e => setWidthCm(Number(e.target.value))} className="w-1/3 border rounded p-2" placeholder="W" />
                  <input type="number" value={heightCm as any} onChange={e => setHeightCm(Number(e.target.value))} className="w-1/3 border rounded p-2" placeholder="H" />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Tipo de entrega</label>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => setDeliveryTypeLocal("normal")} className={`px-3 py-2 rounded-md ${deliveryTypeLocal === "normal" ? "bg-[#166534] text-white" : "border"}`}>Normal</button>
                  <button onClick={() => setDeliveryTypeLocal("express")} className={`px-3 py-2 rounded-md ${deliveryTypeLocal === "express" ? "bg-[#166534] text-white" : "border"}`}>Express</button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Pago</label>
                <select value={paymentMethodLocal} onChange={e => setPaymentMethodLocal(e.target.value as any)} className="w-full border rounded p-2 mt-1">
                  <option value="wallet">Wallet</option>
                  <option value="cod">Contra entrega (COD)</option>
                  <option value="card">Card</option>
                </select>
              </div>
            </div>

            {/* fee & actions */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Estimado (Tarifa)</div>
                <div className="text-2xl font-bold">${localFee}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setCreatedLocalId(null); }} className="px-3 py-2 border rounded-md">Reset</button>
                <button onClick={handleCreateLocal} className="px-4 py-2 bg-[#166534] text-white rounded-md">Crear Envío</button>
              </div>
            </div>

            {createdLocalId && (
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <div className="font-medium">Envío creado: {createdLocalId}</div>
                <div className="text-sm text-gray-500 mt-1">Puede descargar el manifiesto o copiar el ID.</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={downloadManifestLocal} className="px-3 py-2 border rounded-md">Descargar manifiesto</button>
                  <button onClick={() => navigator.clipboard?.writeText(createdLocalId)} className="px-3 py-2 border rounded-md">Copiar ID</button>
                </div>
              </div>
            )}

          </section>
        ) : (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-3">B) Desde Locker (Miami → Cuba)</h2>

            <div className="mb-4 text-sm text-gray-500">Selecciona items en tu locker (Miami). Puedes consolidar y crear una orden de entrega a Cuba.</div>

            <div className="grid grid-cols-1 gap-3">
              {lockerItems.map(it => (
                <div key={it.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-gray-500">ID: {it.id} — llegado: {fmtDate(it.arrivedAt)}</div>
                    <div className="text-xs text-gray-500">Valor declarado: ${it.declaredValueUsd}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{it.weightKg} kg</div>
                    <div className="mt-2">
                      <input type="checkbox" checked={selectedLockerIds.includes(it.id)} onChange={() => toggleLockerItem(it.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500">Consolidar selección</label>
                <div className="mt-2 flex gap-2">
                  <button onClick={handleConsolidateLocker} className="px-3 py-2 bg-[#166534] text-white rounded-md">Crear consolidación</button>
                  <button onClick={() => { setSelectedLockerIds([]); setConsolidatedId(null); setConsolidate(false); }} className="px-3 py-2 border rounded-md">Reset</button>
                </div>
                {consolidatedId && <div className="mt-2 text-sm text-gray-600">Consolidado: <span className="font-medium">{consolidatedId}</span></div>}
              </div>

              <div>
                <label className="text-sm text-gray-500">Destino en Cuba</label>
                <select value={deliveryDestLocker} onChange={e => setDeliveryDestLocker(e.target.value)} className="w-full border rounded p-2 mt-1">
                  <option>La Habana</option>
                  <option>Santiago de Cuba</option>
                  <option>Camagüey</option>
                  <option>Holguín</option>
                  <option>Pinar del Río</option>
                </select>

                <div className="mt-2">
                  <label className="text-sm text-gray-500">Tipo de entrega</label>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setDeliveryTypeLocker("normal")} className={`px-3 py-2 rounded-md ${deliveryTypeLocker === "normal" ? "bg-[#166534] text-white" : "border"}`}>Normal</button>
                    <button onClick={() => setDeliveryTypeLocker("express")} className={`px-3 py-2 rounded-md ${deliveryTypeLocker === "express" ? "bg-[#166534] text-white" : "border"}`}>Express</button>
                  </div>
                </div>

                <div className="mt-3 border-t pt-3">
                  <div className="text-sm text-gray-500">Resumen seleccionado</div>
                  <div className="mt-2 text-sm">Items: {selectedLockerIds.length}</div>
                  <div className="text-sm">Peso total: {selWeight} kg</div>
                  <div className="text-sm">Valor declarado total: ${selDeclared}</div>
                  <div className="mt-2 text-lg font-semibold">Tarifa estimada: ${lockerFee}</div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={handleCreateFromLockerDelivery} className="px-4 py-2 bg-[#166534] text-white rounded-md">Crear entrega desde locker</button>
                  <button onClick={() => { setSelectedLockerIds([]); setConsolidatedId(null); setConsolidate(false); }} className="px-4 py-2 border rounded-md">Cancelar</button>
                </div>

                {createdFromLockerOrder && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <div className="font-medium">Orden creada: {createdFromLockerOrder.id}</div>
                    <div className="text-sm text-gray-500">Tarifa: ${createdFromLockerOrder.fee}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={downloadManifestLocker} className="px-3 py-1 border rounded">Descargar manifiesto</button>
                      <button onClick={() => navigator.clipboard?.writeText(createdFromLockerOrder.id)} className="px-3 py-1 border rounded">Copiar ID</button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </section>
        )}

      </div>
    </div>
  );
}
