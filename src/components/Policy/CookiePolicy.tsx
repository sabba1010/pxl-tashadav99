import React from "react";
import { Link } from "react-router-dom";

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#00183b]">Cookie Policy</h1>
          <p className="mt-3 text-gray-600">Last updated: January 2026</p>
        </div>

        <div className="prose prose-lg text-gray-700 space-y-6">
          <section>
            <h2>What are cookies?</h2>
            <p>Cookies are small text files stored on your device to help the site remember preferences and improve your experience.</p>
          </section>

          <section>
            <h2>How we use cookies</h2>
            <p>We use cookies for authentication, analytics, and to personalize content and ads.</p>
          </section>

          <section>
            <h2>Your choices</h2>
            <p>You can control cookie settings in your browser. Disabling cookies may affect site functionality.</p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-3 px-6 py-3 bg-[#33ac6f] text-white rounded-lg font-semibold">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
