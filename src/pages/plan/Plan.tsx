import React from "react";
import DeductAndCreditAction from "../../components/Payment/SubscriptionPayment";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";

const SellerPlans: React.FC = () => {
  const { data } = useAuthHook();
  const activePlan = data?.subscribedPlan;
  const userId = `${data?._id}`;

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#0A1A3A] tracking-tight">
            Seller Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the perfect plan to grow your business</p>
        </div>

        {/* ===== Row 1: 3 Cards ===== */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

          {/* Default Seller - $0 Purchase Logic */}
          <div className="rounded-2xl p-8 bg-white border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-[#111111]">
              Default / Free Seller Plan
            </h2>
            {/* <p className="text-4xl font-semibold mt-2 text-[#0A1A3A]">Free</p>
            <p className="mt-3 text-[#444444]">
              <strong>All sellers start with 0 credits.</strong> Purchase this free plan to receive your 10 listing credits.
            </p> */}
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111] font-bold">Automatic for all new sellers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]"> 10 listings per day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Manual listings allowed</span>
              </li>
               <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]"> Basic visibility and sales history</span>
              </li>
              {/* <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <span className="text-[#444444]">Limited category access</span>
              </li> */}
            </ul>
            <div className="mt-8">
              {/* যদি ইউজার অলরেডি এই প্ল্যানটি নিয়ে থাকে */}
              {activePlan === "free" || activePlan === "default" ? (
                <span className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl cursor-not-allowed inline-block">
                  Current Plan
                </span>
              ) : (
                <DeductAndCreditAction
                  userId={userId}
                  deductAmount={0} // কোনো টাকা কাটবে না
                  creditAmount={10} // ১০ ক্রেডিট যোগ হবে
                  newPlan="free"
                  buttonText="Activate Free Plan ($0)"
                  onSuccess={() => toast.success("Free plan activated! 10 credits added.")}
                />
              )}
            </div>
          </div>

          {/* Basic Seller */}
          <div className="rounded-2xl p-8 bg-white border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1BC47D] transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-[#111111]">Standard / Starter Seller Plan</h2>
            <p className="text-4xl font-semibold mt-2 text-[#0A1A3A]">$9.99/mo</p>
            <p className="mt-3 text-[#444444]">For active sellers wanting more exposure.</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">20 listings per day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">10 Bonus Credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Priority placement</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Higher daily listing limit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Better marketplace visibility</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Faster listing approval</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Basic analytics and scheduling</span>
              </li>
            </ul>
            <div className="mt-8">
              {activePlan === "basic" ? (
                <span className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl cursor-not-allowed inline-block">
                  Current Plan
                </span>
              ) : (
                <DeductAndCreditAction
                  userId={userId}
                  deductAmount={9.99}
                  creditAmount={10}
                  newPlan="basic"
                  buttonText="Upgrade to Basic – $9.99"
                  onSuccess={() => toast.success("Upgraded to Basic Seller!")}
                />
              )}
            </div>
          </div>

          {/* Business Seller */}
          <div className="rounded-2xl p-8 bg-white border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1BC47D] transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-[#111111]">Premium / Pro Seller Plan</h2>
            <p className="text-4xl font-semibold mt-2 text-[#0A1A3A]">$15.99/mo</p>
            <p className="mt-3 text-[#444444]">Best for growing sellers.</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">30 listings per day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">20 Bonus Credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">High or unlimited listings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Featured placement and badge</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Advanced analytics and reports</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Faster withdrawals after admin review</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Priority dispute handling</span>
              </li>
            </ul>
            <div className="mt-8">
              {activePlan === "business" ? (
                <span className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl cursor-not-allowed inline-block">
                  Current Plan
                </span>
              ) : (
                <DeductAndCreditAction
                  userId={userId}
                  deductAmount={15.99}
                  creditAmount={20}
                  newPlan="business"
                  buttonText="Upgrade to Business – $15.99"
                  onSuccess={() => toast.success("Upgraded to Business Seller")}
                />
              )}
            </div>
          </div>
        </div>

        {/* ===== Row 2: Premium (Centered) ===== */}
        <div className="flex justify-center">
          <div className="w-full md:w-1/3">
            <div className="relative rounded-2xl p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-[#D4A643] shadow-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#D4A643] to-[#E6B84D] text-[#111111] text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl shadow-md">
                Most Popular
              </div>
              <h2 className="text-2xl font-bold text-[#111111]">Elite / Verified Seller Plan</h2>
              <p className="text-4xl font-semibold mt-2 text-[#0A1A3A]">$19.99/mo</p>
              <p className="mt-3 text-[#444444]">Maximum exposure & fastest support.</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#1BC47D] text-xl">✔</span>
                  <span className="text-[#111111]">40 listings per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1BC47D] text-xl">✔</span>
                  <span className="text-[#111111]">30 Bonus Credits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1BC47D] text-xl">✔</span>
                  <span className="text-[#111111]">Top-tier visibility</span>
                </li>
                <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Maximum visibility and ranking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Verified seller badge</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Auto-priority listing approval</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Dedicated admin support</span>
              </li>
              </ul>
              <div className="mt-8">
                {activePlan === "premium" ? (
                  <span className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl cursor-not-allowed inline-block">
                    Current Plan
                  </span>
                ) : (
                  <DeductAndCreditAction
                    userId={userId}
                    deductAmount={19.99}
                    creditAmount={30}
                    newPlan="premium"
                    buttonText="Upgrade to Premium $19.99"
                    onSuccess={() => toast.success("Welcome to Premium Seller!")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPlans;