import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQSection: React.FC = () => {
  const [leftOpen, setLeftOpen] = useState<number[]>([]);
  const [rightOpen, setRightOpen] = useState<number[]>([]);

  const faqs = [
    {
      q: "What is AcctEmpire?",
      a: "AcctEmpire is a secure online marketplace where users can buy and sell digital accounts, services, and virtual products.",
    },
    {
      q: "How do I buy an account?",
      a: "Browse the marketplace, select an account, click “View Account”, and complete your purchase safely through our protected in-app payment system.",
    },
    {
      q: "How do I sell an account?",
      a: "Create a seller account, verify your identity, and start listing your products based on your daily posting limits.",
    },
    {
      q: "Is it safe to trade on AcctEmpire?",
      a: "Yes. All payments, chats, and transactions are protected. Trading outside the app is not allowed and will not be supported.",
    },
    {
      q: "What happens if I receive a wrong or faulty account?",
      a: "You can open a dispute within the allowed time. Our team will review the case and issue a refund to your wallet if eligible.",
    },
    {
      q: "What is the referral program?",
      a: "Refer a seller and earn $5. Refer a buyer and earn 5% of their first order.",
    },
    {
      q: "How do I withdraw my earnings?",
      a: "Sellers and admins can withdraw earnings from their AcctEmpire wallet. Buyers have deposit-only wallets for security.",
    },
    {
      q: "Can I share my contact details with a buyer/seller?",
      a: "No. Sharing contact information is blocked and monitored for security. All chats must stay within the app.",
    },
    {
      q: "What payment methods do you support?",
      a: "AcctEmpire supports multiple secure payment methods depending on your region.",
    },
    {
      q: "What happens if someone tries to scam me?",
      a: "A security system automatically detects fraud, and our support team investigates all disputes.",
    },
    {
      q: "How can I get a refund?",
      a: "You can request a refund by opening a dispute for faulty or wrong products. Our team will review and process eligible refunds quickly.",
    },
    {
      q: "What products can I sell?",
      a: "You can sell digital accounts, eSIMs, subscriptions, social media services, and more—following marketplace rules.",
    },
    {
      q: "How long does listing approval take?",
      a: "Approval time depends on your seller plan. Higher plans receive faster review.",
    },
    {
      q: "What if I forget my password?",
      a: "You can reset your password easily using your email or recovery method.",
    },
    {
      q: "Can I upgrade my seller plan?",
      a: "Yes, you can upgrade anytime and enjoy increased posting limits and higher marketplace visibility.",
    },
  ];

  const mid = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, mid);
  const rightFaqs = faqs.slice(mid);

  const toggle = (
    index: number,
    open: number[],
    setOpen: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setOpen((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderFaq = (
    items: typeof faqs,
    open: number[],
    setOpen: React.Dispatch<React.SetStateAction<number[]>>
  ) =>
    items.map((faq, index) => (
      <div
        key={index}
        className="bg-zinc-900/70 backdrop-blur-lg border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[#daab4c]/10 hover:border-zinc-700"
      >
        <button
          onClick={() => toggle(index, open, setOpen)}
          className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none group min-h-[72px] transition-colors duration-200 hover:bg-zinc-800/50"
        >
          <span className="text-lg md:text-xl font-medium pr-10 text-white leading-snug group-hover:text-[#f0c56a] transition-colors">
            {faq.q}
          </span>

          <motion.div
            animate={{ rotate: open.includes(index) ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-7 h-7 text-[#daab4c] group-hover:text-[#f0c56a] transition-colors" />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: open.includes(index) ? "auto" : 0,
            opacity: open.includes(index) ? 1 : 0,
          }}
          transition={{
            height: { duration: 0.4, ease: "easeInOut" },
            opacity: { duration: 0.3 },
          }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-7 pt-2 text-base md:text-lg text-gray-300 leading-relaxed">
            {faq.a}
          </div>
        </motion.div>
      </div>
    ));

  return (
    <section className="pb-16 md:pb-24 bg-gradient-to-b from-[#002a5c] to-[#00183b] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Optional modern title - you can remove if not wanted */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-[#daab4c] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Everything you need to know about AcctEmpire
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-5">
            {renderFaq(leftFaqs, leftOpen, setLeftOpen)}
          </div>

          <div className="space-y-5">
            {renderFaq(rightFaqs, rightOpen, setRightOpen)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;