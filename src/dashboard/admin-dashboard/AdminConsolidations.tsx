import React, { useState, useMemo, useCallback } from 'react';

// ------------------ COLORS ------------------
// Primary: Dark Green
const PRIMARY_COLOR = '#046838';
// Secondary: Orange
const SECONDARY_COLOR = '#FA921D';

// ------------------ TYPES ------------------
type ShippingMethod = 'Air (10–15 days)' | 'Maritime (20–30 days)' | 'Express (3–5 days)';
type ConsolidationStatus = 'draft' | 'ready_to_book' | 'booked' | 'shipped' | 'received' | 'cancelled';
type Destination = 'Cuba' | 'Other'; // Assuming Cuba is the primary destination

interface LockerItem {
  itemId: string;
  lockerIdentifier: string;
  description: string;
  weightLbs: number;
}

interface Consolidation {
  id: string;
  lockerIdentifier: string;
  recipientName: string; // The owner/recipient of the locker
  status: ConsolidationStatus;
  shippingMethod: ShippingMethod;
  destination: Destination;
  totalWeightLbs: number;
  totalPrice: number;
  items: LockerItem[];
  createdAt: string;
  lastUpdate: string;
}

// ------------------ MOCK DATA & RATES ------------------

const CubaRates = {
  'Air (10–15 days)': 4.5, // $4.50 per lb
  'Maritime (20–30 days)': 2.0, // $2.00 per lb
  'Express (3–5 days)': 7.0, // $7.00 per lb
};

// Items currently waiting in lockers, ready to be grouped into a Consolidation
const initialLockerItems: LockerItem[] = [
  { itemId: "LIT001", lockerIdentifier: "XG15STV", description: "Clothing Box (Small)", weightLbs: 5.5 },
  { itemId: "LIT002", lockerIdentifier: "XG15STV", description: "Electronics components", weightLbs: 2.1 },
  { itemId: "LIT003", lockerIdentifier: "AB93HRT", description: "Medical Supplies", weightLbs: 10.0 },
  { itemId: "LIT004", lockerIdentifier: "AB93HRT", description: "Spare parts (Heavy)", weightLbs: 35.0 },
  { itemId: "LIT005", lockerIdentifier: "CK38LMN", description: "Household Goods", weightLbs: 15.0 },
  { itemId: "LIT006", lockerIdentifier: "CK38LMN", description: "Personal hygiene items", weightLbs: 3.5 },
];

// Expanded mock data to make pagination meaningful
const createMockConsolidations = (count: number): Consolidation[] => {
  const statuses: ConsolidationStatus[] = ['draft', 'ready_to_book', 'booked', 'shipped', 'received', 'cancelled'];
  const methods: ShippingMethod[] = ['Air (10–15 days)', 'Maritime (20–30 days)', 'Express (3–5 days)'];
  const names = ["Maria Rodriguez", "Jose Perez", "Juan Gomez", "Elena Diaz", "Carlos Ramos"];
  const lockers = ["XG15STV", "AB93HRT", "CK38LMN", "T45RTY", "U99QWE"];

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length];
    const method = methods[i % methods.length];
    const weight = 5 + (i % 30);
    const price = weight * CubaRates[method];

    return {
      id: `CON${String(i + 1).padStart(3, '0')}`,
      lockerIdentifier: lockers[i % lockers.length],
      recipientName: names[i % names.length],
      status: status,
      shippingMethod: method,
      destination: 'Cuba' as Destination,
      totalWeightLbs: weight,
      totalPrice: Math.round(price * 100) / 100,
      items: [],
      createdAt: `2025-11-${String(10 + (i % 20)).padStart(2, '0')}`,
      lastUpdate: `2025-12-${String(1 + (i % 5)).padStart(2, '0')}`,
    };
  });
};

const initialConsolidations: Consolidation[] = createMockConsolidations(25); // Create 25 mock records

// Tailwind classes for badges using custom colors
const statusColors: Record<ConsolidationStatus, string> = {
  draft: `bg-yellow-100 text-yellow-800 border border-yellow-300`,
  ready_to_book: `bg-indigo-100 text-indigo-800 border border-indigo-300`,
  booked: `bg-white text-[${PRIMARY_COLOR}] border border-[${PRIMARY_COLOR}]`, // Primary color text
  shipped: `bg-[${PRIMARY_COLOR}] text-white shadow-md`, // Primary color background
  received: `bg-green-100 text-green-800 border border-green-300`,
  cancelled: `bg-red-100 text-red-800 border border-red-300`,
};

// ------------------ UTILITY COMPONENTS ------------------

// Modal component (reused)
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
      {children}
      <button 
        className="mt-5 w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-150" 
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

// Pagination Component
const Pagination: React.FC<{
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always show first, last, and surrounding pages
    pages.push(1);

    if (currentPage > 3) pages.push('...');
    
    // Pages around the current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) end = 3;
    if (currentPage >= totalPages - 2) start = totalPages - 2;

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push('...');
    
    if (totalPages > 1) pages.push(totalPages);
    
    // Filter out duplicate '...' and ensure sequence
    const finalPages: (number | '...')[] = [];
    pages.forEach(p => {
      const last = finalPages[finalPages.length - 1];
      if (p !== '...' || last !== '...') {
        if (typeof p === 'number' && finalPages.includes(p)) return; // Avoid adding duplicate numbers (only necessary due to simplified logic)
        finalPages.push(p);
      }
    });

    return finalPages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing{' '}
        <span className="font-semibold">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{' '}
        to{' '}
        <span className="font-semibold">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{' '}
        of{' '}
        <span className="font-semibold">{totalItems}</span> results
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition duration-150 border 
            ${currentPage === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200 bg-white'}`}
        >
          &larr; Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-150 
                  ${currentPage === page
                    ? 'bg-secondary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition duration-150 border 
            ${currentPage === totalPages ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200 bg-white'}`}
        >
          Next &rarr;
        </button>
      </div>
    </nav>
  );
};

// ------------------ MAIN COMPONENT ------------------

const ITEMS_PER_PAGE = 10;

const AdminConsolidations: React.FC = () => {
  const [lockerItems, setLockerItems] = useState<LockerItem[]>(initialLockerItems);
  const [consolidations, setConsolidations] = useState<Consolidation[]>(initialConsolidations);
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'create' | 'status' | null>(null);
  const [newConsolidationDetails, setNewConsolidationDetails] = useState({
    recipientName: '',
    shippingMethod: 'Air (10–15 days)' as ShippingMethod,
  });
  const [consolidationToUpdate, setConsolidationToUpdate] = useState<Consolidation | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // State for pagination

  // ------------------ Data & Pagination Logic ------------------

  // Group items by lockerIdentifier (for top section)
  const pendingItemsByLocker = useMemo(() => {
    return lockerItems.reduce((acc, item) => {
      const id = item.lockerIdentifier;
      if (!acc[id]) {
        acc[id] = [];
      }
      acc[id].push(item);
      return acc;
    }, {} as Record<string, LockerItem[]>);
  }, [lockerItems]);
  
  const lockerIds = useMemo(() => Object.keys(pendingItemsByLocker).sort(), [pendingItemsByLocker]);

  // Items currently selected for consolidation (Modal)
  const itemsToConsolidate = useMemo(() => {
    return selectedLockerId ? pendingItemsByLocker[selectedLockerId] || [] : [];
  }, [selectedLockerId, pendingItemsByLocker]);

  const consolidationTotalWeight = useMemo(() => {
    return itemsToConsolidate.reduce((sum, item) => sum + item.weightLbs, 0);
  }, [itemsToConsolidate]);

  const consolidationTotalPrice = useMemo(() => {
    const rate = CubaRates[newConsolidationDetails.shippingMethod] || 0;
    return Math.round(consolidationTotalWeight * rate * 100) / 100; // Round to 2 decimal places
  }, [consolidationTotalWeight, newConsolidationDetails.shippingMethod]);

  // Paginated Consolidations for display
  const paginatedConsolidations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    // Sort by creation date descending before slicing
    return [...consolidations]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(startIndex, endIndex);
  }, [consolidations, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // ------------------ Action Handlers ------------------

  const handleCreateConsolidation = useCallback(() => {
    if (!selectedLockerId || itemsToConsolidate.length === 0) return;
    
    // 1. Create the new consolidation object
    const newId = `CON${String(consolidations.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().slice(0, 10);
    
    const newConsolidation: Consolidation = {
      id: newId,
      lockerIdentifier: selectedLockerId,
      recipientName: newConsolidationDetails.recipientName,
      status: 'ready_to_book', // Start directly at ready_to_book after admin creation
      shippingMethod: newConsolidationDetails.shippingMethod,
      destination: 'Cuba',
      totalWeightLbs: consolidationTotalWeight,
      totalPrice: consolidationTotalPrice,
      items: itemsToConsolidate,
      createdAt: now,
      lastUpdate: now,
    };

    // 2. Add to consolidations list and reset page to 1 to show the newest item
    setConsolidations(prev => [newConsolidation, ...prev]);
    setCurrentPage(1);

    // 3. Remove consolidated items from lockerItems
    const consolidatedItemIds = new Set(itemsToConsolidate.map(item => item.itemId));
    setLockerItems(prev => prev.filter(item => !consolidatedItemIds.has(item.itemId)));

    // 4. Reset state
    setSelectedLockerId(null);
    setModalType(null);
    setNewConsolidationDetails({ recipientName: '', shippingMethod: 'Air (10–15 days)' });

  }, [selectedLockerId, itemsToConsolidate, consolidations.length, newConsolidationDetails.recipientName, newConsolidationDetails.shippingMethod, consolidationTotalWeight, consolidationTotalPrice]);

  const handleStatusChange = useCallback((id: string, newStatus: ConsolidationStatus) => {
    setConsolidations(prev =>
      prev.map(c => 
        c.id === id 
          ? { ...c, status: newStatus, lastUpdate: new Date().toISOString().slice(0, 10) }
          : c
      )
    );
    setConsolidationToUpdate(null);
    setModalType(null);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <style>{`
        /* Custom Tailwind Color Definition for primary background/border/hover */
        .bg-primary { background-color: ${PRIMARY_COLOR}; }
        .text-primary { color: ${PRIMARY_COLOR}; }
        .border-primary { border-color: ${PRIMARY_COLOR}; }
        .hover\\:bg-primary-dark:hover { background-color: #034f2a; }

        /* Custom Tailwind Color Definition for secondary accent */
        .bg-secondary { background-color: ${SECONDARY_COLOR}; }
        .text-secondary { color: ${SECONDARY_COLOR}; }
        .hover\\:bg-secondary-dark:hover { background-color: #e07f0f; }

        /* Ensure Tailwind classes for custom colors are injected */
        .status-booked-bg { background-color: ${PRIMARY_COLOR}; }
        .status-booked-text { color: ${PRIMARY_COLOR}; }
      `}</style>
      
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        EXPRESUR Consolidation & Shipment Hub
      </h2>

      {/* SECTION 1: Pending Locker Items & Consolidation Creation */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-2xl border-t-4">
        <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
          <span className="text-secondary mr-2"></span> Pending Items by Locker ({lockerIds.length})
        </h3>
        
        {/* Locker Selection */}
        <div className="flex flex-wrap gap-3 mb-6">
          {lockerIds.map(id => (
            <button
              key={id}
              onClick={() => {
                setSelectedLockerId(id);
                setModalType('create');
              }}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition duration-200 shadow-md 
                ${selectedLockerId === id 
                  ? 'bg-secondary text-white hover:bg-secondary-dark' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
            >
              Locker: {id} <span className="ml-1 text-xs">({pendingItemsByLocker[id].length} items)</span>
            </button>
          ))}
        </div>

        {lockerIds.length === 0 && (
            <div className="p-4 text-center text-green-700 bg-green-50 rounded-lg border-2 border-green-200">
                🎉 All pending locker items have been consolidated!
            </div>
        )}

      </div>

      {/* SECTION 2: Existing Consolidations List */}
      <div className="p-6 bg-white rounded-xl shadow-2xl border-t-4">
        <h3 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
          <span className="text-primary mr-2"></span> Active Consolidations ({consolidations.length})
        </h3>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">ID / Locker</th>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Recipient</th>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Method</th>
                <th className="p-3 text-right text-xs font-bold uppercase tracking-wider">Weight (Lbs)</th>
                <th className="p-3 text-right text-xs font-bold uppercase tracking-wider">Price (USD)</th>
                <th className="p-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="p-3 text-center text-xs font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedConsolidations.map((c) => (
                <tr key={c.id} className="hover:bg-indigo-50 transition duration-100">
                  <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {c.id}<br /><span className="text-xs text-gray-500">{c.lockerIdentifier}</span>
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-700">{c.recipientName}</td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-700">{c.shippingMethod.split('(')[0]}</td>
                  <td className="p-3 whitespace-nowrap text-sm font-semibold text-right">{c.totalWeightLbs.toFixed(1)}</td>
                  <td className="p-3 whitespace-nowrap text-sm font-bold text-right text-green-700">${c.totalPrice.toFixed(2)}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${statusColors[c.status]}`}>
                        {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => { setConsolidationToUpdate(c); setModalType('status'); }}
                      className={`px-3 py-1 text-xs font-medium text-white rounded-md transition duration-150 
                          bg-[${PRIMARY_COLOR}] hover:bg-primary-dark shadow-md`}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <Pagination
            totalItems={consolidations.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
        />
      </div>

      {/* MODAL 1: CREATE NEW CONSOLIDATION */}
      {modalType === 'create' && selectedLockerId && (
        <Modal onClose={() => setModalType(null)}>
          <h3 className="text-2xl font-bold mb-4 text-primary border-b-2 pb-2">
            Confirm Consolidation: {selectedLockerId}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Grouping <span className="font-bold text-primary">{itemsToConsolidate.length} items</span> into a single shipment.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2">
            <h4 className="font-bold text-lg text-secondary">Items Summary</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {itemsToConsolidate.map((item, index) => (
                <li key={item.itemId}>
                  {item.description} ({item.weightLbs.toFixed(1)} lbs)
                </li>
              ))}
            </ul>
            <p className="font-bold pt-2 text-primary">
              Total Weight: {consolidationTotalWeight.toFixed(1)} lbs
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
              <input
                type="text"
                value={newConsolidationDetails.recipientName}
                onChange={(e) => setNewConsolidationDetails(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder="Required for shipping label"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
              <select
                value={newConsolidationDetails.shippingMethod}
                onChange={(e) => setNewConsolidationDetails(prev => ({ ...prev, shippingMethod: e.target.value as ShippingMethod }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary appearance-none"
              >
                {Object.keys(CubaRates).map(method => (
                  <option key={method} value={method}>{method} (${CubaRates[method as ShippingMethod].toFixed(2)}/lb)</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-secondary/10 rounded-lg text-center border border-secondary font-bold text-xl text-secondary">
              Estimated Total Price: ${consolidationTotalPrice.toFixed(2)}
            </div>
          </div>
          
          <button 
            onClick={handleCreateConsolidation}
            disabled={!newConsolidationDetails.recipientName}
            className={`mt-5 w-full px-4 py-3 text-lg font-semibold rounded-lg text-white shadow-lg transition duration-150 
              bg-[${PRIMARY_COLOR}] hover:bg-primary-dark disabled:bg-gray-400`}
          >
            Create Shipment & Lock Consolidation
          </button>
        </Modal>
      )}

      {/* MODAL 2: UPDATE STATUS */}
      {modalType === 'status' && consolidationToUpdate && (
        <Modal onClose={() => setModalType(null)}>
          <h3 className="text-2xl font-bold mb-4 text-primary border-b-2 pb-2">
            Update Status: {consolidationToUpdate.id}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Current Status: <span className={`px-2 py-0.5 text-sm font-semibold rounded-full ${statusColors[consolidationToUpdate.status]}`}>
              {consolidationToUpdate.status.replace('_', ' ')}
            </span>
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select New Status</label>
            <select
              defaultValue={consolidationToUpdate.status}
              onChange={(e) => {
                const newStatus = e.target.value as ConsolidationStatus;
                handleStatusChange(consolidationToUpdate.id, newStatus);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary appearance-none text-lg"
            >
              {Object.keys(statusColors).map(status => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          
          <p className="mt-4 text-xs text-red-500">
            *Updating the status automatically updates the 'Last Update' timestamp.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default AdminConsolidations;