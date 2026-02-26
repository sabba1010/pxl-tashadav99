import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useAuthHook } from '../../hook/useAuthHook';
import Loading from '../Loading';
import Swal from 'sweetalert2';

interface Listing {
  _id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  username: string;
  status: string;
  isVisible?: boolean;
  createdAt: string;
}

interface ProductResponse {
  success: boolean;
  products: Listing[];
}

interface ToggleResponse {
  success: boolean;
  message: string;
  modifiedCount: number;
}

const ListingsManagement: React.FC = () => {
  const { user } = useAuth();
  const { data: userData } = useAuthHook();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [allHidden, setAllHidden] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check if user is admin or seller
  const canAccessListings = userData?.role === 'seller' || userData?.role === 'admin';

  const fetchListings = useCallback(async () => {
    if (!user?.email || !canAccessListings) {
      return;
    }

    try {
      window.scrollTo(0, 0);
      setLoading(true);
      const res = await axios.get<ProductResponse>(
        `https://tasha-vps-backend-2.onrender.com/product/user-products/${user.email}`
      );

      if (res.data?.success && Array.isArray(res.data.products)) {
        setListings(res.data.products);
        
        // Check if all products are hidden
        const allAreHidden = res.data.products.every(
          (p: Listing) => p.isVisible === false
        );
        setAllHidden(allAreHidden && res.data.products.length > 0);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [user?.email, canAccessListings]);

  useEffect(() => {
    if (!canAccessListings || !user?.email) {
      return;
    }
    fetchListings();
  }, [canAccessListings, user?.email, fetchListings]);

  const toggleProductVisibility = async (productId: string, currentVisibility: boolean) => {
    try {
      setToggling(productId);
      const newVisibility = !currentVisibility;

      const res = await axios.patch<ToggleResponse>(
        `https://tasha-vps-backend-2.onrender.com/product/toggle-visibility/${productId}`,
        { isVisible: newVisibility }
      );

      if (res.data?.success) {
        setListings(listings.map(p => 
          p._id === productId ? { ...p, isVisible: newVisibility } : p
        ));

        // Update allHidden status
        const updatedListings = listings.map(p =>
          p._id === productId ? { ...p, isVisible: newVisibility } : p
        );
        const allAreHidden = updatedListings.every(p => p.isVisible === false);
        setAllHidden(allAreHidden && updatedListings.length > 0);

        toast.success(newVisibility ? 'Product is now visible' : 'Product is now hidden');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update product visibility');
    } finally {
      setToggling(null);
    }
  };

  const toggleAllVisibility = async () => {
    try {
      const newVisibility = allHidden;

      const result = await Swal.fire({
        title: newVisibility ? 'Unhide All Products?' : 'Hide All Products?',
        text: newVisibility
          ? 'All your products will become visible on the marketplace'
          : 'All your products will be hidden from the marketplace and will not appear on My Ads',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d4a643',
        cancelButtonColor: '#6b7280',
        confirmButtonText: newVisibility ? 'Unhide All' : 'Hide All',
      });

      if (result.isConfirmed) {
        setToggling('all');

        const res = await axios.patch<ToggleResponse>(
          'https://tasha-vps-backend-2.onrender.com/product/toggle-all-visibility',
          { userEmail: user?.email, isVisible: newVisibility }
        );

        if (res.data?.success) {
          setListings(listings.map(p => ({ ...p, isVisible: newVisibility })));
          setAllHidden(!newVisibility);
          toast.success(res.data.message);
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error('Error toggling all visibility:', error);
      toast.error('Failed to update all products');
    } finally {
      setToggling(null);
    }
  };

  if (!canAccessListings) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">You don't have permission to access this section</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 text-center">
        <p className="text-gray-500 text-lg mb-4">You don't have any listings yet</p>
        <p className="text-gray-400 text-sm">Start creating listings to manage them here</p>
      </div>
    );
  }

  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = listings.slice(startIndex, endIndex);

  const visibleCount = listings.filter(p => p.isVisible !== false).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">My Listings</h2>
            <p className="text-sm text-gray-500">
              {visibleCount} of {listings.length} product{listings.length !== 1 ? 's' : ''} visible
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={toggleAllVisibility}
              disabled={toggling === 'all'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition text-sm ${
                allHidden
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Eye size={16} />
              {allHidden ? 'Unhide All' : 'Hide All'}
            </button>

            <button
              onClick={fetchListings}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Product Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedListings.map((listing) => (
                <tr key={listing._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-900 truncate">{listing.name}</p>
                      <p className="text-xs text-gray-500 truncate">{listing.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{listing.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">${listing.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        listing.status === 'active' || listing.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : listing.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        toggleProductVisibility(listing._id, listing.isVisible !== false)
                      }
                      disabled={toggling === listing._id}
                      className={`inline-flex items-center justify-center p-2.5 rounded-lg transition ${
                        listing.isVisible === false
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={listing.isVisible === false ? 'Hidden' : 'Visible'}
                    >
                      {toggling === listing._id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : listing.isVisible === false ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">Note:</span> Hidden products will not appear on your "My Ads" page or the marketplace. You can toggle individual products or hide/unhide all at once.
        </p>
      </div>
    </div>
  );
};

export default ListingsManagement;
