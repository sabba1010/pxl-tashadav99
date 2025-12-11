import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReferralProgram = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'How do I get my referral link?', a: 'Head to your dashboard and click "Share Link"!' },
    { q: 'When do I get paid?', a: 'Rewards hit your wallet instantly after verification.' },
    { q: 'Can I refer myself?', a: 'No. Self-referrals or fake accounts will result in permanent suspension.' },
    { q: 'Are there any limits?', a: 'No limit! The more active users you bring, the more you earn.' },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#00183b] to-[#002a5c] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-4">
            AcctEmpire Referral Program
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Earn big by inviting friends! Help grow our community and watch rewards stack up automatically.
          </p>
        </motion.div>

        {/* Rewards Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Refer Seller */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#002654] rounded-2xl p-8 border border-[#003a7f] shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-[#00183b]/10">
                <svg className="w-8 h-8" style={{ color: '#daab4c' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Refer a Seller</h2>
            </div>
            <ul className="space-y-4 text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">Checkmark</span>
                Earn <strong className="text-[#daab4c]">$5</strong> per activated seller account
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">Checkmark</span>
                Auto-added to your wallet
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">Checkmark</span>
                Verified & paid activation required
              </li>
            </ul>
          </motion.div>

          {/* Refer Buyer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#002654] rounded-2xl p-8 border border-[#003a7f] shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-[#00183b]/10">
                <svg className="w-8 h-8" style={{ color: '#daab4c' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Refer a Buyer</h2>
            </div>
            <ul className="space-y-4 text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">Checkmark</span>
                Earn <strong className="text-[#daab4c]">5%</strong> of their first order
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">Checkmark</span>
                Paid after successful transaction
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">Checkmark</span>
                No cancels, refunds, or disputes
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Admin Rights & Fair Use - Now as a matching card */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#002654] rounded-2xl p-8 border border-[#003a7f] shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-[#00183b]/10">
                <svg className="w-8 h-8" style={{ color: '#daab4c' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Admin Rights & Fair Use Policy</h2>
            </div>

            <p className="text-gray-300 mb-5">
              Platform administrators reserve the right to maintain fairness and prevent abuse:
            </p>

            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-[#daab4c] text-xl mt-0.5">•</span>
                Modify or update reward amounts at any time
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#daab4c] text-xl mt-0.5">•</span>
                Withhold rewards for fraud, spam, or self-referral
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#daab4c] text-xl mt-0.5">•</span>
                Ban accounts engaging in abusive behavior
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#daab4c] text-xl mt-0.5">•</span>
                Access full referral analytics and modify program rules
              </li>
            </ul>

            <p className="text-xs text-gray-400 italic mt-6 pt-4 border-t border-white/10">
              Last updated: December 2025 • We reserve the right to terminate the program with notice.
            </p>
          </motion.div>
        </div>

        {/* FAQ Section - Super Smooth */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-[#daab4c] mb-10"
          >
            Got Questions?
          </motion.h3>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 backdrop-blur-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/10 transition-colors duration-200"
                >
                  <span className="font-medium text-lg pr-4">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="text-3xl text-[#daab4c] font-light select-none"
                  >
                    {openFaq === index ? '−' : '+'}
                  </motion.span>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{
                    height: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
                    opacity: { duration: 0.3 },
                  }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-6 pb-6 pt-2 text-gray-200 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="/dashboard/referrals"
            className="inline-block px-10 py-5 bg-gradient-to-r from-[#daab4c] to-[#b8860b] text-[#00183b] font-bold rounded-full text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg text-white"
          >
            Get Your Referral Link Now →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ReferralProgram;