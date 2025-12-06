import React from "react";

const plans = [
  {
    name: "Starter",
    price: "$0/mo",
    description: "Best for individuals and beginners.",
    features: [
      "Basic analytics",
      "5 projects",
      "1 team member",
      "Email support"
    ]
  },
  {
    name: "Professional",
    price: "$29/mo",
    description: "Great for growing teams.",
    popular: true,
    features: [
      "Everything in Starter",
      "Priority support",
      "Advanced analytics",
      "10 team members",
      "Unlimited projects",
      "Custom integrations"
    ]
  },
  {
    name: "Enterprise",
    price: "$99/mo",
    description: "For companies needing scale & security.",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Advanced security",
      "Team access controls"
    ]
  }
];

const Plan = () => {
  return (
    <div className="py-16 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#0A1A3A]">
          Choose the perfect plan
        </h1>

        <div className="grid md:grid-cols-3 gap-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 bg-white ${
                plan.popular
                  ? "border-2 border-[#0A1A3A] scale-105"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#D4A643] text-[#111111] text-sm px-3 py-1 rounded-bl-xl rounded-tr-3xl">
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold text-[#111111]">
                {plan.name}
              </h2>

              <p className="text-4xl font-semibold mt-2 text-[#0A1A3A]">
                {plan.price}
              </p>

              <p className="mt-3 text-[#444444]">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plan;
