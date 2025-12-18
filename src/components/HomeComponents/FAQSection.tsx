import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'What is AcctEmpire?',
      a: 'AcctEmpire is a secure online marketplace where users can buy and sell digital accounts, services, and virtual products.',
    },
    {
      q: 'How do I buy an account?',
      a: 'Browse the marketplace, select an account, click “View Account”, and complete your purchase safely through our protected in-app payment system.',
    },
    {
      q: 'How do I sell an account?',
      a: 'Create a seller account, verify your identity, and start listing your products based on your daily posting limits.',
    },
    {
      q: 'Is it safe to trade on AcctEmpire?',
      a: 'Yes. All payments, chats, and transactions are protected. Trading outside the app is not allowed and will not be supported.',
    },
    {
      q: 'What happens if I receive a wrong or faulty account?',
      a: 'You can open a dispute within the allowed time. Our team will review the case and issue a refund to your wallet if eligible.',
    },
    {
      q: 'What is the referral program?',
      a: 'Refer a seller and earn $5. Refer a buyer and earn 5% of their first order.',
    },
    {
      q: 'How do I withdraw my earnings?',
      a: 'Sellers and admins can withdraw earnings from their AcctEmpire wallet. Buyers have deposit-only wallets for security.',
    },
    {
      q: 'Can I share my contact details with a buyer/seller?',
      a: 'No. Sharing contact information is blocked and monitored for security. All chats must stay within the app.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'AcctEmpire supports multiple secure payment methods depending on your region.',
    },
    {
      q: 'What happens if someone tries to scam me?',
      a: 'A security system automatically detects fraud, and our support team investigates all disputes.',
    },
    {
      q: 'How can I get refund?',
      a: 'Yes. Admin has full control to update seller plans, activation fees, and referral bonuses.',
    },
    {
      q: 'What products can I sell?',
      a: 'You can sell digital accounts, eSIMs, subscriptions, social media services, and more—following marketplace rules.',
    },
    {
      q: 'How long does listing approval take?',
      a: 'Approval time depends on your seller plan. Higher plans receive faster review.',
    },
    {
      q: 'What if I forget my password?',
      a: 'You can reset your password easily using your email or recovery method.',
    },
    {
      q: 'Can I upgrade my seller plan?',
      a: 'Yes, you can upgrade anytime and enjoy increased posting limits and higher marketplace visibility.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="pt-6 pb-10 md:py-24 bg-gradient-to-b from-[#002a5c] to-[#00183b] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="text-[#daab4c]">Questions</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about using AcctEmpire safely and effectively.
          </p>
        </motion.div>

        {/* Two-column grid on md+ screens */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="group"
            >
              <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-[#daab4c]/30 transition-all duration-300 h-full">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 md:py-6 flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#daab4c]/50"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg md:text-xl font-semibold text-white pr-8 group-hover:text-[#daab4c] transition-colors">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="w-7 h-7 text-[#daab4c] flex-shrink-0" />
                  </motion.div>
                </button>

                <motion.div
                  id={`faq-answer-${index}`}
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{
                    height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.3 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 text-gray-200 leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;