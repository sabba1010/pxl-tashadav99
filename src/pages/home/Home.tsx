import React from "react";
import images from "../../assets/Home images.png";
import image1 from "../../assets/Homeimages2.png";

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-900 overflow-hidden">
      {/* Hero Banner Section - Modern Gradient + Glassmorphism */}
      <section className="relative bg-gradient-to-br from-[#00183b] via-[#002a5c] to-[#003d80] text-white py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute top-20 -right-20 w-96 h-96 bg-[#daab4c] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-32 w-80 h-80 bg-[#d4a643] opacity-20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#daab4c] to-[#f0d084]">
              Buy Social Accounts Marketplace
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Connecting buyers and sellers in the digital world, our platform offers a secure and transparent marketplace for acquiring and trading valuable social media accounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 placeholder-gray-400 focus:outline-none focus:border-[#daab4c] transition"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-[#daab4c] to-[#f0d084] hover:from-[#c89a3f] hover:to-[#e0b860] text-black font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={images}
              alt="Social Marketplace"
              className="w-full max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Standout Accounts Section - Modern Cards */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-4">
              Connect With Standout Social Media Influencers
            </h2>
            <p className="text-gray-600 text-lg">Premium digital assets trusted by thousands</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'USA WhatsApp number', desc: "One-time verification number • Code delivered instantly after purchase", vendor: 'AS Digitals', delivery: '5 mins', price: '$4.49', emoji: '📱' },
              { title: '1 year Active Pia VPN', desc: 'Works on iOS/Android • Single device license', vendor: 'lavidamide Logs', delivery: 'Instant', price: '$2.98', emoji: '🔒' },
              { title: 'Gmail PVA Aged 2020', desc: 'High-quality • Instant delivery • Full warranty', vendor: 'MailKing', delivery: '3 mins', price: '$1.99', emoji: '📧' },
              { title: 'Netflix Premium 4K', desc: 'Private profile • 4K UHD • Full warranty', vendor: 'StreamZone', delivery: 'Instant', price: '$7.99', emoji: '🎬' },
              { title: '$50 Amazon Gift Card US', desc: 'Instant code delivery • 100% valid', vendor: 'GiftZone', delivery: 'Instant', price: '$46.50', emoji: '🎁' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-[#daab4c]/30 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{item.emoji}</div>
                  <span className="text-2xl font-bold text-gray-900">{item.price}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-gray-500">
                    <span className="font-medium text-gray-700">{item.vendor}</span>
                    <span className="text-[#daab4c] font-semibold">• {item.delivery}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-[#daab4c] font-semibold hover:underline">Add to cart</button>
                    <button className="text-gray-500 hover:text-gray-700">View →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Category - Glass Cards */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#00183b] to-[#002a5c]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#f0d084] mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-300 text-lg">Discover & Acquire Unique Digital Assets</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: '⭐', title: 'Featured Listings' },
            { icon: '🚀', title: 'Marketing & Promotion' },
            { icon: '👤', title: 'User Profiles' },
            { icon: '✅', title: 'Verified Accounts' },
            { icon: '🛠️', title: 'Customer Support' },
            { icon: '🔍', title: 'Advanced Search' },
            { icon: '🛡️', title: 'Escrow Security' },
            { icon: '📊', title: 'Analytics Tools' },
          ].map((cat, i) => (
            <div
              key={i}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 hover:border-[#daab4c]/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="text-lg font-semibold text-white">{cat.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Modern Flow */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b]">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg mt-4">Simple, Secure, and Fast Process</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <img src={image1} alt="How it works" className="rounded-2xl shadow-2xl" />
            <div className="space-y-10">
              {[
                { icon: '📝', title: 'Registration & Account Setup', desc: 'Sign up in seconds and verify your identity.' },
                { icon: '🔍', title: 'Browse Premium Listings', desc: 'Explore thousands of verified accounts.' },
                { icon: '👁️', title: 'Review Details', desc: 'Check stats, history, and authenticity proofs.' },
                { icon: '💳', title: 'Secure Escrow Payment', desc: 'Funds held safely until transfer is complete.' },
                { icon: '🔑', title: 'Instant Account Transfer', desc: 'Receive full access immediately after confirmation.' },
                { icon: '🎉', title: 'Start Growing', desc: 'Your new digital asset is ready to use!' },
              ].map((step, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="text-4xl bg-gradient-to-br from-[#daab4c] to-[#b8860b] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us + Features - Combined Modern Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Why Choose Us */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-12">
              Why Thousands Trust Us
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: '🔍', title: 'Full Transparency', desc: 'See account history, metrics, and ownership proof before buying.' },
                { icon: '🔒', title: 'Escrow Protection', desc: 'Your payment is 100% secure until you receive the account.' },
                { icon: '⚡', title: 'Instant Delivery', desc: 'Get access within minutes after successful transaction.' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition">
                  <div className="text-6xl mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-12">
              Powerful Features for Buyers & Sellers
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '🎯', title: 'Targeted Exposure', desc: 'Reach serious buyers looking for your exact niche.' },
                { icon: '💰', title: 'Competitive Bidding', desc: 'Drive up prices with real-time bidding system.' },
                { icon: '🛡️', title: 'Fraud Protection', desc: 'Advanced verification and dispute resolution.' },
                { icon: '📈', title: 'Growth Tools', desc: 'Analytics and insights included with premium accounts.' },
                { icon: '🌍', title: 'Global Marketplace', desc: 'Connect with buyers and sellers worldwide.' },
                { icon: '⚙️', title: 'Easy Management', desc: 'User-friendly dashboard for all your transactions.' },
              ].map((f, i) => (
                <div key={i} className="bg-gray-100 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition">
                  <div className="text-5xl mb-4">{f.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;