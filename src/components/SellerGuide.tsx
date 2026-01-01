import React from "react";
import { Link } from "react-router-dom";

// Import the PDF from assets
import sellerGuide from "../assets/Saller guide.pdf";

const SellerGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">Seller Guide</h1>
            <Link to="/" className="text-sm text-gray-500 underline">Back</Link>
          </div>

          <div className="w-full h-[80vh] border">
            <iframe
              src={sellerGuide}
              title="Seller Guide"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerGuide;
