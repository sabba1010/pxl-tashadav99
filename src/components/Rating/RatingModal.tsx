import React, { useState } from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";

const FaTimesIcon = FaTimes as any;
const FaStarIcon = FaStar as any;

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  productName: string;
  sellerEmail: string;
  buyerEmail: string;
  onRatingSubmitted: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  orderId,
  productName,
  sellerEmail,
  buyerEmail,
  onRatingSubmitted,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = "http://localhost:3200";
  const RATING_API = `${BASE_URL}/rating`;

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    if (message.trim() === "") {
      toast.error("Please write a review message");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${RATING_API}/create`, {
        orderId,
        productName,
        sellerEmail,
        buyerEmail,
        rating,
        message,
      });

      toast.success("Rating submitted successfully!");
      setRating(0);
      setMessage("");
      onRatingSubmitted();
      onClose();
    } catch (error) {
      console.error("Rating submission error:", error);
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center">
          <span className="flex items-center gap-2">⭐ Rate Your Purchase</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded-full transition"
          >
            <FaTimesIcon size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Product Info */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-semibold">PRODUCT</p>
            <p className="text-sm font-bold text-gray-800 truncate">
              {productName}
            </p>
          </div>

          {/* Star Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 justify-center py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition transform hover:scale-125 focus:outline-none"
                >
                  <FaStarIcon
                    size={32}
                    className={`transition ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 drop-shadow-lg"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="text-center text-sm text-gray-600">
                {rating} out of 5 stars
              </div>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience with this product..."
              maxLength={500}
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {message.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitRating}
            disabled={isSubmitting || rating === 0 || message.trim() === ""}
            className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
              isSubmitting || rating === 0 || message.trim() === ""
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
