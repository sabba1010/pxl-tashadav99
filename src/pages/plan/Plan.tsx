import React, { useState } from 'react';

type Billing = 'monthly' | 'yearly';

interface PlanItem {
  id: string;
  title: string;
  priceMonthly: number;
  priceYearly: number;
  perks: string[];
  popular?: boolean;
}

const COLORS = {
  empireBlue: '#0A1A3A', // primary
  royalGold: '#D4A643',  // accent / highlights
  emeraldGreen: '#1BC47D', // check icons
  charcoal: '#111111', // headings
  cleanWhite: '#FFFFFF' // background / card bg
};

const Plan: React.FC = () => {
  const [billing, setBilling] = useState<Billing>('monthly');

  const plans: PlanItem[] = [
    {
      id: 'professional',
      title: 'Professional',
      priceMonthly: 509,
      priceYearly: Math.round(509 * 12 * 0.8), // 20% yearly discount example
      perks: ['24/7 support', 'Basic analytics', 'Email templates', 'Up to 3 team members']
    },
    {
      id: 'business',
      title: 'Business',
      popular: true,
      priceMonthly: 849,
      priceYearly: Math.round(849 * 12 * 0.8),
      perks: ['Everything in Professional', 'Priority support', 'Advanced analytics', '10 team members']
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      priceMonthly: 1699,
      priceYearly: Math.round(1699 * 12 * 0.8),
      perks: ['Everything in Business', 'Dedicated manager', 'SLA & SSO', 'Custom integrations']
    }
  ];

  const features: string[] = [
    'HTML email template support',
    'A/B testing',
    'Email personalization',
    'Dynamic content rules',
    'List management',
    'Deliverability tools',
    'Reporting & dashboards'
  ];

  const formatPrice = (val: number | string): string => {
    const num = Number(val);
    return `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div style={{ background: '#F7F8FA' }} className="min-h-screen py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p style={{ color: COLORS.empireBlue }} className="text-sm uppercase font-semibold">Plans & pricing</p>
          <h1 style={{ color: COLORS.charcoal }} className="mt-3 text-3xl sm:text-4xl font-extrabold">Choose your plan</h1>
          <p className="mt-2 text-gray-600">Pick the plan that fits your team. Toggle billing to see annual savings.</p>

          <div className="mt-6 inline-flex items-center bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${billing === 'monthly' ? '' : 'text-gray-700'}`}
              style={{
                backgroundColor: billing === 'monthly' ? COLORS.empireBlue : 'transparent',
                color: billing === 'monthly' ? COLORS.cleanWhite : COLORS.empireBlue,
                borderRadius: 999
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`ml-1 px-4 py-2 rounded-full text-sm font-medium ${billing === 'yearly' ? '' : 'text-gray-700'}`}
              style={{
                backgroundColor: billing === 'yearly' ? COLORS.empireBlue : 'transparent',
                color: billing === 'yearly' ? COLORS.cleanWhite : COLORS.empireBlue,
                borderRadius: 999
              }}
            >
              Yearly (save 20%)
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="relative rounded-2xl p-6 shadow"
              style={{
                background: COLORS.cleanWhite,
                border: p.popular ? `2px solid ${COLORS.royalGold}` : '1px solid rgba(15,23,42,0.06)',
                transform: p.popular ? 'scale(1.02)' : undefined
              }}
            >
              {p.popular && (
                <div
                  className="absolute -top-3 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: COLORS.royalGold, color: COLORS.cleanWhite }}
                >
                  Most popular
                </div>
              )}

              <h3 style={{ color: COLORS.charcoal }} className="text-lg font-semibold">{p.title}</h3>

              <div className="mt-4">
                <div className="flex items-baseline space-x-2">
                  <span style={{ color: COLORS.charcoal }} className="text-3xl font-extrabold">
                    {billing === 'monthly' ? formatPrice(p.priceMonthly) : formatPrice(p.priceYearly)}
                  </span>
                  <span className="text-sm text-gray-500">{billing === 'monthly' ? '/mo' : '/yr'}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Billed {billing === 'monthly' ? 'monthly' : 'annually'}</p>
              </div>

              <button
                className="mt-6 w-full font-semibold py-2 rounded-lg"
                style={{
                  backgroundColor: COLORS.empireBlue,
                  color: COLORS.cleanWhite,
                  boxShadow: '0 6px 18px rgba(10,26,58,0.12)'
                }}
              >
                Get started
              </button>

              <ul className="mt-6 space-y-2 text-sm" style={{ color: '#374151' }}>
                {p.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill={COLORS.emeraldGreen}
                      aria-hidden="true"
                    >
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
        <div className="mt-12 rounded-2xl shadow p-6" style={{ background: COLORS.cleanWhite }}>
          <h4 style={{ color: COLORS.charcoal }} className="text-lg font-semibold mb-4">Plan comparison</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 pr-6">Plan / Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} className="py-3 px-6 font-medium" style={{ color: COLORS.charcoal }}>{p.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <td className="py-3 pr-6 text-gray-700">{f}</td>
                    {plans.map((p) => (
                      <td key={p.id + i} className="py-3 px-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="inline-block h-5 w-5"
                          viewBox="0 0 20 20"
                          fill={COLORS.emeraldGreen}
                          aria-hidden="true"
                        >
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
                      {/* Outline button: gold border, empire blue text */}
                      <button
                        className="w-full py-2 rounded-lg font-semibold"
                        style={{
                          border: `2px solid ${COLORS.royalGold}`,
                          color: COLORS.empireBlue,
                          background: 'transparent'
                        }}
                      >
                        Choose
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Need a custom plan? <span style={{ color: COLORS.empireBlue, fontWeight: 600 }}>Contact sales</span>
        </p>
      </div>
    </div>
  );
};

export default Plan;
