import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Globe, Clock, DollarSign, Search, X, Save } from "lucide-react";

interface ShippingRate {
  id: string;
  type: "Domestic" | "International";
  origin: string;
  destination: string;
  weight: string;
  price: number;
  currency: "USD" | "EUR";
  deliveryTime: string;
  serviceType: "Standard" | "Express" | "Economy" | "Premium";
}

const initialRates: ShippingRate[] = [
  { id: "R001", type: "Domestic", origin: "Havana", destination: "Santiago de Cuba", weight: "0-1kg", price: 8.50, currency: "USD", deliveryTime: "2-4 days", serviceType: "Standard" },
  { id: "R002", type: "Domestic", origin: "Havana", destination: "Camagüey", weight: "1-5kg", price: 18.00, currency: "USD", deliveryTime: "3-5 days", serviceType: "Standard" },
  { id: "R003", type: "International", origin: "Madrid, Spain", destination: "Havana, Cuba", weight: "0-2kg", price: 49.90, currency: "EUR", deliveryTime: "5-8 days", serviceType: "Economy" },
  { id: "R004", type: "International", origin: "Miami, USA", destination: "Havana, Cuba", weight: "0-1kg", price: 65.00, currency: "USD", deliveryTime: "2-4 days", serviceType: "Express" },
  { id: "R005", type: "International", origin: "Barcelona, Spain", destination: "Holguín, Cuba", weight: "5-10kg", price: 124.00, currency: "EUR", deliveryTime: "7-12 days", serviceType: "Standard" },
  { id: "R006", type: "Domestic", origin: "Varadero", destination: "Santa Clara", weight: "0-3kg", price: 12.75, currency: "USD", deliveryTime: "1-3 days", serviceType: "Express" },
  { id: "R007", type: "International", origin: "Panama City", destination: "Havana, Cuba", weight: "2-5kg", price: 89.50, currency: "USD", deliveryTime: "4-7 days", serviceType: "Standard" },
  { id: "R008", type: "International", origin: "Mexico City", destination: "Santiago de Cuba", weight: "0-1kg", price: 72.00, currency: "USD", deliveryTime: "3-6 days", serviceType: "Express" },
  { id: "R009", type: "Domestic", origin: "Havana", destination: "Pinar del Río", weight: "10-20kg", price: 42.00, currency: "USD", deliveryTime: "4-6 days", serviceType: "Economy" },
  { id: "R010", type: "International", origin: "Toronto, Canada", destination: "Havana, Cuba", weight: "1-3kg", price: 98.00, currency: "USD", deliveryTime: "6-10 days", serviceType: "Standard" },
  { id: "R011", type: "International", origin: "Valencia, Spain", destination: "Camagüey, Cuba", weight: "0-5kg", price: 89.90, currency: "EUR", deliveryTime: "6-9 days", serviceType: "Premium" },
  { id: "R012", type: "Domestic", origin: "Holguín", destination: "Havana", weight: "0-2kg", price: 15.00, currency: "USD", deliveryTime: "2-4 days", serviceType: "Standard" },
  { id: "R013", type: "International", origin: "New York, USA", destination: "Varadero, Cuba", weight: "3-7kg", price: 145.00, currency: "USD", deliveryTime: "4-7 days", serviceType: "Express" },
  { id: "R014", type: "International", origin: "Paris, France", destination: "Havana, Cuba", weight: "0-1kg", price: 79.00, currency: "EUR", deliveryTime: "7-12 days", serviceType: "Economy" },
  { id: "R015", type: "Domestic", origin: "Cienfuegos", destination: "Trinidad", weight: "5-10kg", price: 28.50, currency: "USD", deliveryTime: "1-2 days", serviceType: "Express" },
];

const AdminRates = () => {
  const [rates, setRates] = useState<ShippingRate[]>(initialRates);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Domestic" | "International">("All");

  // Edit Modal State
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState<Partial<ShippingRate>>({});

  const filteredRates = rates.filter(rate => {
    const matchesSearch = 
      rate.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.id.includes(searchTerm);
    const matchesType = filterType === "All" || rate.type === filterType;
    return matchesSearch && matchesType;
  });

  // Open Edit Modal
  const openEditModal = (rate: ShippingRate) => {
    setEditingRate(rate);
    setFormData(rate);
    setIsEditModalOpen(true);
  };

  // Save Edited Rate
  const saveRate = () => {
    if (!editingRate || !formData) return;

    setRates(prev => prev.map(r => 
      r.id === editingRate.id ? { ...r, ...formData } as ShippingRate : r
    ));

    setIsEditModalOpen(false);
    setEditingRate(null);
    setFormData({});
  };

  // Delete Rate
  const deleteRate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this rate?")) {
      setRates(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-green-700" />
            Shipping Rates Management
          </h1>
          <p className="text-gray-600 mt-2">Edit, delete, or add new shipping rates instantly</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3.5 bg-green-700 text-white font-semibold rounded-2xl hover:bg-green-800 transition-all shadow-lg hover:shadow-xl">
          <Plus size={22} />
          Add New Rate
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search origin, destination, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-6 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
          >
            <option value="All">All Routes</option>
            <option value="Domestic">Domestic Cuba</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/70">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Globe className="text-green-700" />
              Active Rates ({filteredRates.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Route</th>
                <th className="px-6 py-4 text-left">Weight</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Delivery</th>
                <th className="px-6 py-4 text-left">Service</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-bold text-green-700">{rate.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      rate.type === "Domestic" 
                        ? "bg-blue-100 text-blue-800 border border-blue-300" 
                        : "bg-purple-100 text-purple-800 border border-purple-300"
                    }`}>
                      {rate.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {rate.origin} → <span className="text-green-700 font-semibold">{rate.destination}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{rate.weight}</td>
                  <td className="px-6 py-4 font-bold">
                    <DollarSign size={16} className="inline text-green-700 -ml-1" />
                    {rate.price.toFixed(2)} <span className="text-xs text-gray-500">{rate.currency}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                    <Clock size={15} /> {rate.deliveryTime}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      rate.serviceType === "Express" ? "bg-orange-100 text-orange-800" :
                      rate.serviceType === "Premium" ? "bg-indigo-100 text-indigo-800" :
                      rate.serviceType === "Economy" ? "bg-gray-100 text-gray-700" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {rate.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => openEditModal(rate)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2.5 rounded-lg transition transform hover:scale-110"
                        title="Edit Rate"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteRate(rate.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2.5 rounded-lg transition transform hover:scale-110"
                        title="Delete Rate"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingRate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Shipping Rate</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={28} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                  <input
                    type="text"
                    value={formData.origin || ""}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    value={formData.destination || ""}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type || "Domestic"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none"
                  >
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight Range</label>
                  <input
                    type="text"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 0-1kg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={formData.currency || "USD"}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                  <input
                    type="text"
                    value={formData.deliveryTime || ""}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="e.g. 2-4 days"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={formData.serviceType || "Standard"}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none"
                  >
                    <option>Standard</option>
                    <option>Express</option>
                    <option>Economy</option>
                    <option>Premium</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveRate}
                  className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition shadow-md"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRates;
