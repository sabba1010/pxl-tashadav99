import React from "react";
import { Cookie, Settings, BarChart3, Shield, Info, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-50 border border-orange-200 mb-8">
            <Cookie className="w-6 h-6 text-orange-600" />
            <span className="text-orange-700 font-semibold">Cookie Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e6c06c] mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-12 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">What Are Cookies?</h2>
            <p className="text-lg leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website.
              They help us provide you with a better experience by remembering your preferences and
              understanding how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">Types of Cookies We Use</h2>

            <div className="space-y-6 mt-6">
              {/* Essential Cookies */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-start gap-4">
                  <Shield className="w-7 h-7 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Essential Cookies</h3>
                    <p className="text-green-700">
                      These cookies are necessary for the website to function properly. They enable core
                      functionality such as security, authentication, and network management.
                    </p>
                    <ul className="mt-3 space-y-1 text-green-700">
                      <li>• Session management</li>
                      <li>• Authentication and security</li>
                      <li>• Load balancing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <BarChart3 className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Analytics Cookies</h3>
                    <p className="text-blue-700">
                      These cookies help us understand how visitors interact with our website by collecting
                      and reporting information anonymously.
                    </p>
                    <ul className="mt-3 space-y-1 text-blue-700">
                      <li>• Page views and navigation patterns</li>
                      <li>• Time spent on pages</li>
                      <li>• Error tracking and performance monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-start gap-4">
                  <Settings className="w-7 h-7 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-purple-800 mb-2">Functional Cookies</h3>
                    <p className="text-purple-700">
                      These cookies enable enhanced functionality and personalization, such as remembering
                      your preferences and settings.
                    </p>
                    <ul className="mt-3 space-y-1 text-purple-700">
                      <li>• Language preferences</li>
                      <li>• Theme settings (dark/light mode)</li>
                      <li>• Recently viewed items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-amber-50 p-8 rounded-2xl border border-amber-200">
            <div className="flex items-start gap-4">
              <Info className="w-9 h-9 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">Your Cookie Choices</h3>
                <p className="text-amber-700 mb-3">
                  You have the right to decide whether to accept or reject cookies. You can exercise
                  your cookie preferences through:
                </p>
                <ul className="space-y-2 text-amber-700">
                  <li>• Browser settings - Most browsers allow you to refuse cookies</li>
                  <li>• Cookie consent banner - Manage preferences when you first visit</li>
                  <li>• Account settings - Update your preferences anytime</li>
                </ul>
                <p className="text-amber-700 mt-4 font-semibold">
                  Note: Blocking essential cookies may affect website functionality.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">Third-Party Cookies</h2>
            <p className="text-lg leading-relaxed">
              We may use third-party services that set cookies on our behalf to help us analyze
              website traffic and improve our services. These include:
            </p>
            <ul className="space-y-3 ml-6 mt-4">
              <li className="flex items-start gap-3">
                <Cookie className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                Google Analytics - For website analytics and performance tracking
              </li>
              <li className="flex items-start gap-3">
                <Cookie className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                Payment processors - For secure transaction processing
              </li>
              <li className="flex items-start gap-3">
                <Cookie className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                Security services - For fraud prevention and platform security
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">How to Manage Cookies</h2>
            <p className="text-lg leading-relaxed">
              Most web browsers allow you to control cookies through their settings. You can set your
              browser to refuse cookies or delete certain cookies. Please note that if you disable cookies,
              some features of our website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">Updates to This Policy</h2>
            <p className="text-lg leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or for other operational, legal, or regulatory reasons. We encourage you to review this
              policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">Contact Us</h2>
            <p className="text-lg">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <a
              href="mailto:privacy@acctempire.com"
              className="inline-flex items-center gap-2 mt-4 text-orange-600 font-bold hover:underline"
            >
              <Mail className="w-5 h-5" /> privacy@acctempire.com
            </a>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-20 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
