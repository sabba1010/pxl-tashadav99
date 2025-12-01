import React, { useState } from 'react';
import { Search, CreditCard, Calendar, User, DollarSign, X } from "lucide-react";

interface Payment {
  id: string;
  packageId: string;   // NEW FIELD
  customer: string;
  email: string;
  amount: number;
  currency: string;
  method: "Credit Card" | "PayPal" | "Bank Transfer" | "Crypto";
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  date: string;
  transactionId: string;
  invoiceId: string;
  notes?: string;
}

const dummyPayments: Payment[] = [
  { id: "PMT-4098", packageId: "PK-0047", customer: "María González", email: "maria.g@example.com", amount: 289.00, currency: "USD", method: "Credit Card", status: "Paid", date: "2025-02-10", transactionId: "tx_1K9mPx2eZvKYlo2C", invoiceId: "INV-2025-089", notes: "Cuba package delivery" },
  { id: "PMT-4097", packageId: "PK-0048", customer: "Carlos Pérez", email: "carlos@cuba.es", amount: 156.50, currency: "EUR", method: "PayPal", status: "Paid", date: "2025-02-09", transactionId: "paypal_8J9K2LmN", invoiceId: "INV-2025-088" },
  { id: "PMT-4096", packageId: "PK-0049", customer: "Ana López", email: "ana.lopez@gmail.com", amount: 420.00, currency: "USD", method: "Bank Transfer", status: "Pending", date: "2025-02-08", transactionId: "bt_20250208_ANA", invoiceId: "INV-2025-087" },
  { id: "PMT-4095", packageId: "PK-0050", customer: "Luis Fernández", email: "luis@miami.com", amount: 89.90, currency: "USD", method: "Credit Card", status: "Failed", date: "2025-02-07", transactionId: "tx_failed_002", invoiceId: "INV-2025-086", notes: "Card declined" },
  { id: "PMT-4094", packageId: "PK-0051", customer: "Elena Martínez", email: "elena.mart@gmail.com", amount: 335.00, currency: "EUR", method: "Credit Card", status: "Paid", date: "2025-02-06", transactionId: "tx_1K9mPx2eZvKYlo2D", invoiceId: "INV-2025-085" },
  { id: "PMT-4093", packageId: "PK-0052", customer: "Roberto Díaz", email: "roberto.diaz@outlook.com", amount: 199.99, currency: "USD", method: "PayPal", status: "Paid", date: "2025-02-05", transactionId: "paypal_7H8G1FkL", invoiceId: "INV-2025-084" },
  { id: "PMT-4092", packageId: "PK-0053", customer: "Sofia Rivera", email: "sofia.rivera@yahoo.com", amount: 125.00, currency: "USD", method: "Credit Card", status: "Refunded", date: "2025-02-04", transactionId: "tx_ref_20250204", invoiceId: "INV-2025-083", notes: "Customer requested refund" },
  { id: "PMT-4091", packageId: "PK-0054", customer: "Jorge Herrera", email: "jorge.herrera@proton.me", amount: 650.00, currency: "USD", method: "Bank Transfer", status: "Paid", date: "2025-02-03", transactionId: "bt_20250203_JH", invoiceId: "INV-2025-082" },
  { id: "PMT-4090", packageId: "PK-0055", customer: "Isabel Torres", email: "isabel.torres@gmail.com", amount: 78.40, currency: "EUR", method: "Credit Card", status: "Paid", date: "2025-02-02", transactionId: "tx_1K9mPx2eZvKYlo2E", invoiceId: "INV-2025-081" },
  { id: "PMT-4089", packageId: "PK-0056", customer: "Miguel Ruiz", email: "miguel.ruiz@cubamail.cu", amount: 210.00, currency: "USD", method: "Crypto", status: "Paid", date: "2025-02-01", transactionId: "crypto_usdt_0x9f...a1b2", invoiceId: "INV-2025-080" },
  { id: "PMT-4088", packageId: "PK-0057", customer: "Laura Vega", email: "laura.vega@icloud.com", amount: 399.00, currency: "USD", method: "Credit Card", status: "Paid", date: "2025-01-31", transactionId: "tx_1K9mPx2eZvKYlo2F", invoiceId: "INV-2025-079" },
  { id: "PMT-4087", packageId: "PK-0058", customer: "Diego Morales", email: "diego.m@gmail.com", amount: 167.25, currency: "EUR", method: "PayPal", status: "Pending", date: "2025-01-30", transactionId: "paypal_pending_001", invoiceId: "INV-2025-078" },
  { id: "PMT-4086", packageId: "PK-0059", customer: "Camila Ortega", email: "camila.ortega@yahoo.es", amount: 550.00, currency: "USD", method: "Bank Transfer", status: "Paid", date: "2025-01-29", transactionId: "bt_20250129_CO", invoiceId: "INV-2025-077" },
  { id: "PMT-4085", packageId: "PK-0060", customer: "Andrés Silva", email: "andres.silva@outlook.com", amount: 92.00, currency: "USD", method: "Credit Card", status: "Failed", date: "2025-01-28", transactionId: "tx_failed_003", invoiceId: "INV-2025-076" },
  { id: "PMT-4084", packageId: "PK-0061", customer: "Valeria Castro", email: "valeria.c@gmail.com", amount: 280.00, currency: "USD", method: "Credit Card", status: "Paid", date: "2025-01-27", transactionId: "tx_1K9mPx2eZvKYlo2G", invoiceId: "INV-2025-075" },
  { id: "PMT-4083", packageId: "PK-0062", customer: "Felipe Navarro", email: "felipe.n@protonmail.com", amount: 445.50, currency: "EUR", method: "PayPal", status: "Paid", date: "2025-01-26", transactionId: "paypal_6F7E4DkJ", invoiceId: "INV-2025-074" },
  { id: "PMT-4082", packageId: "PK-0063", customer: "Natalia Romero", email: "natalia.r@gmail.com", amount: 135.00, currency: "USD", method: "Credit Card", status: "Paid", date: "2025-01-25", transactionId: "tx_1K9mPx2eZvKYlo2H", invoiceId: "INV-2025-073" },
  { id: "PMT-4081", packageId: "PK-0064", customer: "Raúl Mendoza", email: "raul.mendoza@cubamail.cu", amount: 890.00, currency: "USD", method: "Bank Transfer", status: "Pending", date: "2025-01-24", transactionId: "bt_pending_890", invoiceId: "INV-2025-072" },
  { id: "PMT-4080", packageId: "PK-0065", customer: "Patricia Jiménez", email: "patricia.j@icloud.com", amount: 67.80, currency: "EUR", method: "Credit Card", status: "Paid", date: "2025-01-23", transactionId: "tx_1K9mPx2eZvKYlo2I", invoiceId: "INV-2025-071" },
  { id: "PMT-4079", packageId: "PK-0066", customer: "Oscar Delgado", email: "oscar.d@gmail.com", amount: 312.00, currency: "USD", method: "Crypto", status: "Paid", date: "2025-01-22", transactionId: "crypto_btc_1A2b3C...", invoiceId: "INV-2025-070" },
];

const AdminPayments = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800 border border-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Failed": return "bg-red-100 text-red-800 border border-red-300";
      case "Refunded": return "bg-purple-100 text-purple-800 border border-purple-300";
    }
  };

  return (
    <>
      <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="text-green-700" />
            Payments Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Monitor all customer payments and transactions</p>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search by ID, customer, email..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
              />
            </div>

            <select className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition">
              <option>All Methods</option>
              <option>Credit Card</option>
              <option>PayPal</option>
              <option>Bank Transfer</option>
              <option>Crypto</option>
            </select>

            <select className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-100 outline-none transition">
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Failed</option>
              <option>Refunded</option>
            </select>

            <input type="date" className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-100 outline-none transition" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">
              {dummyPayments.length} payments • Total: $
              {dummyPayments.reduce((a, p) => p.status === "Paid" ? a + p.amount : a, 0).toFixed(2)}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Payment ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Package ID</th> {/* NEW */}
                  <th className="px-6 py-4 text-left font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold hidden sm:table-cell">Method</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {dummyPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 font-semibold text-green-700">{payment.id}</td>

                    {/* NEW PACKAGE ID COLUMN */}
                    <td className="px-6 py-4 font-semibold text-green-700">
                      {payment.packageId}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{payment.customer}</p>
                      <p className="text-xs text-gray-500">{payment.email}</p>
                    </td>

                    <td className="px-6 py-4 font-semibold">
                      {payment.currency} {payment.amount.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} />
                        {payment.method}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openModal(payment)}
                        className="text-green-700 font-medium px-4 py-2 rounded-lg transition"
                      >
                        View Details →
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="p-8">

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Payment Details</h3>
                  <p className="text-green-700 font-semibold text-lg mt-1">{selectedPayment.id}</p>
                </div>

                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={28} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <User size={16} /> {selectedPayment.customer}
                    </p>
                    <p className="text-sm text-gray-600">{selectedPayment.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-3xl font-bold text-green-700">
                      {selectedPayment.currency} {selectedPayment.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(selectedPayment.status)}`}>
                      {selectedPayment.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{selectedPayment.method}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">

                  <div>
                    <p className="text-gray-500">Transaction ID</p>
                    <p className="font-mono text-xs bg-gray-100 px-3 py-2 rounded-lg mt-1">
                      {selectedPayment.transactionId}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Invoice ID</p>
                    <p className="font-mono text-xs bg-gray-100 px-3 py-2 rounded-lg mt-1">
                      {selectedPayment.invoiceId}
                    </p>
                  </div>

                  {/* NEW PACKAGE ID DISPLAY */}
                  <div>
                    <p className="text-gray-500">Package ID</p>
                    <p className="font-mono text-xs bg-gray-100 px-3 py-2 rounded-lg mt-1">
                      {selectedPayment.packageId}
                    </p>
                  </div>

                </div>

                {selectedPayment.notes && (
                  <div>
                    <p className="text-gray-500 text-sm">Notes</p>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mt-1">{selectedPayment.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-500 text-sm">Payment Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(selectedPayment.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default AdminPayments;
