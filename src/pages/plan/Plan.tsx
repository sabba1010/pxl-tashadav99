import React from "react";

/* ================== TYPES ================== */
type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
};

type PlanCardProps = {
  plan: Plan;
};

/* ================== DATA ================== */
const plans: Plan[] = [
  {
    name: "Default Seller",
    price: "Free",
    description: "Perfect for new sellers testing the platform.",
    features: [
      "10 listings per day",
      "Standard marketplace visibility",
      "Basic listing tools",
      "Referral bonus eligibility",
      "In-app messaging",
      "Earnings withdrawal enabled",
      "Limited category access"
    ]
  },
  {
    name: "Basic Seller",
    price: "$9.99/mo",
    description: "For active sellers wanting more exposure.",
    features: [
      "20 listings per day",
      "Higher visibility than Free sellers",
      "Priority placement over Default sellers",
      "Faster listing review",
      "Basic seller badge",
      "Promotional boosts",
      "Weekend posting (1 per week)"
    ]
  },
  {
    name: "Business Seller",
    price: "$15.99/mo",
    description: "Best for growing sellers.",
    features: [
      "30 listings per day",
      "Business-level priority ranking",
      "Priority support",
      "Advanced analytics",
      "Unlimited categories",
      "Weekend posting (2 per week)"
    ]
  },
  {
    name: "Premium Seller",
    price: "$19.99/mo",
    popular: true,
    description: "Maximum exposure & fastest support.",
    features: [
      "40 listings per day",
      "Top-tier visibility",
      "Premium seller badge",
      "Homepage priority",
      "Bulk uploads",
      "Unlimited weekend posts"
    ]
  }
];

/* ================== COMPONENT ================== */
const SellerPlans: React.FC = () => {
  return (
    <div className="py-16 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#0A1A3A]">
          Seller Subscription Plans
        </h1>

        {/* ===== Row 1 (3 Cards) ===== */}
        <div className="grid md:grid-cols-3 gap-12">
          {plans.slice(0, 3).map((plan: Plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* ===== Row 2 (Centered Card) ===== */}
        <div className="mt-14 flex justify-center">
          <div className="w-full md:w-1/3">
            <PlanCard plan={plans[3]} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================== CARD ================== */
const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  return (
    <div
      className={`relative rounded-3xl p-10 bg-white transition-all duration-300
        ${
          plan.popular
            ? "border-2 border-[#0A1A3A] scale-105 shadow-xl"
            : "border border-gray-200 shadow-sm hover:shadow-lg"
        }`}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0 bg-[#D4A643] text-[#111111] text-sm px-3 py-1 rounded-bl-xl rounded-tr-3xl">
          Most Popular
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#111111]">{plan.name}</h2>

      <p className="text-4xl font-semibold mt-2 text-[#0A1A3A]">
        {plan.price}
      </p>

      <p className="mt-3 text-[#444444]">{plan.description}</p>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature: string, idx: number) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-[#1BC47D] text-xl">✔</span>
            <span className="text-[#111111]">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className="
          mt-8 w-full py-3 rounded-xl font-medium
          bg-[#0A1A3A] text-white border-2 border-[#0A1A3A]
          hover:bg-[#111111] transition
        "
      >
        Choose Plan
      </button>
    </div>
  );
};

export default SellerPlans;
