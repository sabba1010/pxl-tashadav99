import React from "react";
import { Link } from "react-router-dom";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#00183b]">Terms of Service</h1>
          <p className="mt-3 text-gray-600">Last updated: January 2026</p>
        </div>

        <div className="prose prose-lg text-gray-700">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using our platform, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2>2. Use of Platform</h2>
            <p>Users must follow all applicable laws and our policies when buying or selling accounts.</p>
          </section>

          <section>
            <h2>3. Disputes and Liability</h2>
            <p>We provide a marketplace and do not guarantee outcomes; our liability is limited as described in this document.</p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-3 px-6 py-3 bg-[#33ac6f] text-white rounded-lg font-semibold">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
