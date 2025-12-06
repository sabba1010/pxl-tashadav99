import React, { useState } from 'react';

export default function Plan() {
  const [billing, setBilling] = useState('monthly');

  const plans = [
    {
      id: 'professional',
      title: 'Professional',
      priceMonthly: 509,
      priceYearly: 509 * 12 * 0.8, // example yearly discount
      perks: ['24/7 support', 'Basic analytics', 'Email templates', 'Up to 3 team members']
    },
    {
      id: 'business',
      title: 'Business',
      popular: true,
      priceMonthly: 849,
      priceYearly: 849 * 12 * 0.8,
      perks: ['Everything in Professional', 'Priority support', 'Advanced analytics', '10 team members']
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      priceMonthly: 1699,
      priceYearly: 1699 * 12 * 0.8,
      perks: ['Everything in Business', 'Dedicated manager', 'SLA & SSO', 'Custom integrations']
    }
  ];

  const features = [
    'HTML email template support',
    'A/B testing',
    'Email personalization',
    'Dynamic content rules',
    'List management',
    'Deliverability tools',
    'Reporting & dashboards'
  ];

  const formatPrice = (val) => {
    return `$${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm text-indigo-600 uppercase font-semibold">Plans & pricing</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Choose your plan</h1>
          <p className="mt-2 text-gray-500">Pick the plan that fits your team. Toggle billing to see annual savings.</p>

          <div className="mt-6 inline-flex items-center bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${billing === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`ml-1 px-4 py-2 rounded-full text-sm font-medium ${billing === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
              Yearly (save 20%)
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.id} className={`relative bg-white rounded-2xl p-6 shadow ${p.popular ? 'border-2 border-indigo-100 scale-105' : ''}`}>
              {p.popular && (
                <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</div>
              )}
              <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
              <div className="mt-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {billing === 'monthly' ? formatPrice(p.priceMonthly) : formatPrice(p.priceYearly)}
                  </span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Billed {billing === 'monthly' ? 'monthly' : 'annually'}</p>
              </div>

              <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg">{p.popular ? 'Get started' : 'Get started'}</button>

              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                {p.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 00-1.408-1.42L7.5 11.666 4.704 8.96a1 1 0 10-1.408 1.42l3.5 3.5a1 1 0 001.408 0l7.5-7.59z" clipRule="evenodd" />
                    </svg>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-12 bg-white rounded-2xl shadow p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Plan comparison</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 pr-6">Plan / Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} className="py-3 px-6 font-medium text-gray-700">{p.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <td className="py-3 pr-6 text-gray-700">{f}</td>
                    {plans.map((p) => (
                      <td key={p.id + i} className="py-3 px-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 00-1.408-1.42L7.5 11.666 4.704 8.96a1 1 0 10-1.408 1.42l3.5 3.5a1 1 0 001.408 0l7.5-7.59z" clipRule="evenodd" />
                        </svg>
                      </td>
                    ))}
                  </tr>
                ))}

                {/* final row with CTA */}
                <tr>
                  <td className="py-4 pr-6" />
                  {plans.map((p) => (
                    <td key={`cta-${p.id}`} className="py-4 px-6">
                      <button className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg font-semibold">Choose</button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">Need a custom plan? <span className="text-indigo-600 font-medium">Contact sales</span></p>
      </div>
    </div>
  );
}
