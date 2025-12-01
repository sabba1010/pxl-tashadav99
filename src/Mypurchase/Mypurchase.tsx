// src/pages/MyPurchase.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface Order {
  id: string;
  title: string;
  price: number;
  seller: string;
  date: string;
  status: "Delivered" | "Processing" | "Disputed";
  deliveryTime: string;
}

const MyPurchase = () => {
  // For demo — set to [] for empty state
  const [orders] = useState<Order[]>([]);

  const hasOrders = orders.length > 0;

  return (
    <>
      {/* Main Container */}
      <div className="min-h-screen bg-gray-50 pt-20 pb-24"> {/* pt-20 = navbar height */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Purchase</h1>
              <p className="text-sm text-gray-600 mt-1">All of your product purchase shows here</p>
            </div>
          <Link to="/report">
              Report Product
          </Link>
          </div>

          {/* Yellow Warning Banner */}
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-5 py-4 rounded-lg mb-6 text-sm leading-relaxed">
            Customers are not eligible for a refund on any social media product that is not returned within 24 hours of purchase if it is found to be defective. 
            Please report any defective product immediately after purchase to ensure prompt assistance.
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {hasOrders ? (
              /* When there are orders - you can map them here later */
              <div className="p-8 text-center text-gray-500">
                Orders will appear here
              </div>
            ) : (
              /* Empty State - EXACTLY like your screenshot */
              <div className="py-20 px-6">
                <div className="flex flex-col items-center">
                  {/* Megaphone Icon with red badge */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center">
                      <svg className="w-14 h-14 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z"/>
                      </svg>
                    </div>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      0
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    You haven't purchased anything yet. Explore the marketplace and grab amazing deals!
                  </p>

                  <Link
                    to="/marketplace"
                    className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition shadow-lg"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Orange + Button (Mobile Only) */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 bg-orange-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-3xl font-light hover:bg-orange-600 transition transform hover:scale-110 z-40 lg:hidden"
      >
        +
      </Link>
    </>
  );
};

export default MyPurchase;