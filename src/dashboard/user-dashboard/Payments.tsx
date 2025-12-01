import React, { useState, useMemo } from "react";

/* -------- Fake Payments Data -------- */
type Payment = {
  id: string;
  type: "envio" | "consolidacion" | "pickup" | "locker";
  amount: number;
  currency: "USD" | "CUP";
  date: string; // ISO
  status: "pagado" | "pendiente" | "fallido";
  desc: string;
  items?: string[];
  txId?: string | null; // transaction id if paid
};

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "PAY-99121",
    type: "envio",
    amount: 39,
    currency: "USD",
    date: "2025-01-12",
    status: "pagado",
    desc: "Envío Miami → La Habana",
    items: ["Etiqueta aérea", "Manejo", "Entrega final"],
    txId: "TX-AAA111",
  },
  {
    id: "PAY-55231",
    type: "pickup",
    amount: 5,
    currency: "USD",
    date: "2025-01-09",
    status: "pendiente",
    desc: "Servicio de retiro doméstico",
    items: ["Pickup urbano"],
    txId: null,
  },
  {
    id: "PAY-88210",
    type: "consolidacion",
    amount: 12,
    currency: "USD",
    date: "2025-01-06",
    status: "pagado",
    desc: "Consolidación de 3 paquetes",
    items: ["Mano de obra", "Clasificación", "Reempaque"],
    txId: "TX-BBB222",
  },
  {
    id: "PAY-44781",
    type: "locker",
    amount: 3,
    currency: "USD",
    date: "2025-01-03",
    status: "fallido",
    desc: "Cargo de almacenamiento (Locker)",
    items: ["Locker mensual"],
    txId: null,
  },
];

/* Helpers */
function statusBadge(s: Payment["status"]) {
  switch (s) {
    case "pagado":
      return "bg-green-100 text-green-700";
    case "pendiente":
      return "bg-yellow-100 text-yellow-700";
    case "fallido":
      return "bg-red-100 text-red-700";
    default:
      return "";
  }
}
function rnd(prefix = "TX") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
}

/* ---------------- Component ---------------- */
export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Payment | null>(null);

  /* Online payment modal state */
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payTarget, setPayTarget] = useState<Payment | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return payments.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
  }, [payments, query]);

  /* KPI */
  const totalPaid = payments.filter((p) => p.status === "pagado").reduce((sum, p) => sum + p.amount, 0);
  const pending = payments.filter((p) => p.status === "pendiente").length;
  const lastPaid = [...payments].reverse().find((p) => p.status === "pagado");

  /* Open pay modal for a payment */
  function openPayModal(p: Payment) {
    setPayTarget(p);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPayModalOpen(true);
  }

  /* Simulate online payment */
  async function handleFakePay() {
    if (!payTarget) return;
    // basic validation
    if (cardNumber.trim().length < 12 || cardExpiry.trim().length < 3 || cardCvc.trim().length < 3) {
      return alert("Ingrese datos de tarjeta válidos (fake).");
    }

    setProcessing(true);
    // simulate network / payment gateway delay
    await new Promise((r) => setTimeout(r, 1200));

    // simulate random success/failure bias (mostly success)
    const success = Math.random() > 0.08; // 92% success
    if (success) {
      const tx = rnd("TX");
      setPayments(prev =>
        prev.map(pay =>
          pay.id === payTarget.id ? { ...pay, status: "pagado", txId: tx, date: new Date().toISOString().slice(0,10) } : pay
        )
      );
      setLastTx(tx);
      setProcessing(false);
      setPayModalOpen(false);
      alert(`Pago exitoso — TX: ${tx}`);
    } else {
      // mark as failed
      setPayments(prev =>
        prev.map(pay =>
          pay.id === payTarget.id ? { ...pay, status: "fallido", txId: null } : pay
        )
      );
      setProcessing(false);
      setPayModalOpen(false);
      alert("Pago fallido. Intenta con otra tarjeta.");
    }
  }

  function downloadReceipt(p: Payment) {
    const receipt = {
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      txId: p.txId ?? "—",
      desc: p.desc,
      date: p.date,
    };
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.id}_receipt.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">

        {/* Header */}
        <h2 className="text-2xl font-bold text-[#166534] mb-2">Pagos</h2>
        <p className="text-gray-600 mb-6">Historial de pagos, facturas pendientes y pago online (simulado).</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">Total Pagado</div>
            <div className="text-2xl font-bold text-[#166534]">${totalPaid}</div>
            <div className="text-xs text-gray-400 mt-1">Historial completo</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">Pendientes</div>
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <div className="text-xs text-gray-400 mt-1">Pagos por completar</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-xs text-gray-500">Último Pago</div>
            <div className="text-xl font-semibold">{lastPaid ? lastPaid.date : "—"}</div>
            <div className="text-xs text-gray-400 mt-1">{lastPaid?.desc}</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-between mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pago por ID, tipo o descripción..."
            className="px-3 py-2 border rounded-md w-72"
          />
        </div>

        {/* Table (desktop) */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-left">Monto</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 capitalize">{p.type}</td>
                  <td className="p-3">{p.desc}</td>
                  <td className="p-3">${p.amount}</td>
                  <td className="p-3">{p.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelected(p)} className="px-3 py-1 border rounded-md">Ver</button>

                      {p.status === "pendiente" && (
                        <button onClick={() => openPayModal(p)} className="px-3 py-1 bg-[#166534] text-white rounded-md">Pay Online</button>
                      )}

                      <button onClick={() => downloadReceipt(p)} className="px-3 py-1 border rounded-md">Descargar</button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">No se encontraron pagos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="md:hidden space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{p.id}</p>
                  <p className="text-sm text-gray-500">{p.type}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(p.status)}`}>{p.status}</span>
              </div>

              <div className="mt-2 text-sm">
                <p><b>Monto:</b> ${p.amount}</p>
                <p><b>Fecha:</b> {p.date}</p>
                <p><b>Descripción:</b> {p.desc}</p>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => setSelected(p)} className="flex-1 px-3 py-2 border rounded-md">Ver</button>
                {p.status === "pendiente" && (
                  <button onClick={() => openPayModal(p)} className="px-3 py-2 bg-[#166534] text-white rounded-md">Pay Online</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal details */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <h3 className="text-xl font-bold">{selected.id}</h3>
            <p className="text-gray-600">{selected.desc}</p>

            <div className="mt-4 space-y-2">
              <p><b>Monto:</b> ${selected.amount}</p>
              <p><b>Fecha:</b> {selected.date}</p>
              <p><b>Estado:</b> <span className={`px-2 py-1 rounded-md text-xs ${statusBadge(selected.status)}`}>{selected.status}</span></p>
              <p><b>Tx ID:</b> {selected.txId ?? "—"}</p>

              {selected.items && (
                <div>
                  <b>Incluye:</b>
                  <ul className="list-disc ml-6 text-sm mt-1">
                    {selected.items.map((i, idx) => <li key={idx}>{i}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded-md">Cerrar</button>
              <button onClick={() => { downloadReceipt(selected); }} className="px-4 py-2 bg-[#166534] text-white rounded-md">Descargar Recibo</button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal (fake online) */}
      {payModalOpen && payTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Pagar en línea — {payTarget.id}</h3>
                <p className="text-sm text-gray-500">Monto: ${payTarget.amount} — {payTarget.desc}</p>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="text-gray-600">✕</button>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-500">Número de tarjeta (fake)</label>
              <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4111 1111 1111 1111" className="w-full border rounded p-2 mt-1" />

              <div className="flex gap-2 mt-3">
                <div className="flex-1">
                  <label className="text-sm text-gray-500">MM/AA</label>
                  <input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="12/25" className="w-full border rounded p-2 mt-1" />
                </div>
                <div className="w-32">
                  <label className="text-sm text-gray-500">CVC</label>
                  <input value={cardCvc} onChange={e => setCardCvc(e.target.value)} placeholder="123" className="w-full border rounded p-2 mt-1" />
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">Nota: Este es un pago simulado (fake). No se realiza ninguna transacción real.</div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">Total</div>
                <div className="text-2xl font-bold">${payTarget.amount}</div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setPayModalOpen(false)} className="px-3 py-2 border rounded-md">Cancelar</button>
                <button onClick={handleFakePay} disabled={processing} className={`px-4 py-2 rounded-md text-white ${processing ? 'bg-gray-400' : 'bg-[#166534]'}`}>
                  {processing ? "Procesando..." : "Pagar ahora"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* small toast / info about last tx */}
      {lastTx && (
        <div className="fixed left-4 bottom-4 bg-white p-3 rounded shadow border">
          <div className="text-sm">Última transacción: <b>{lastTx}</b></div>
          <div className="text-xs text-gray-500">Puedes descargar el recibo en el historial.</div>
        </div>
      )}
    </div>
  );
}
