import React from "react";
import DeductAndCreditAction from "../../components/Payment/SubscriptionPayment";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";

const SellerPlans: React.FC = () => {
  const { data } = useAuthHook();
  const activePlan = data?.subscribedPlan;
  const userId = `${data?._id}`;

  return (
    <div className="py-16 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#0A1A3A]">
          Seller Subscription Plans
        </h1>

        {/* ===== Row 1: 3 Cards ===== */}
        <div className="grid md:grid-cols-3 gap-12 mb-14">

          {/* Default Seller - $0 Purchase Logic */}
          <div className="rounded-3xl p-10 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold text-[#111111]">
              Default Seller
            </h2>
            <p className="text-4xl font-semibold mt-2 text-[#0A1A3A]">Free</p>
            <p className="mt-3 text-[#444444]">
              <strong>All sellers start with 0 credits.</strong> Purchase this free plan to receive your 10 listing credits.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111] font-bold">Receive 10 Listing Credits</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Basic listing tools</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1BC47D] text-xl">✔</span>
                <span className="text-[#111111]">Standard visibility</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <span className="text-[#444444]">Limited category access</span>
              </li>
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
          <div className="rounded-3xl p-10 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold text-[#111111]">Basic Seller</h2>
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
          <div className="rounded-3xl p-10 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-2xl font-bold text-[#111111]">Business Seller</h2>
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
            <div className="relative rounded-3xl p-10 bg-white border-2 border-[#0A1A3A] shadow-xl scale-105 transition-all">
              <div className="absolute top-0 right-0 bg-[#D4A643] text-[#111111] text-sm px-3 py-1 rounded-bl-xl rounded-tr-3xl">
                Most Popular
              </div>
              <h2 className="text-2xl font-bold text-[#111111]">Premium Seller</h2>
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