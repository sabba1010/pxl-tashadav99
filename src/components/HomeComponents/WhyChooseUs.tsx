import React from 'react';

const WhyChooseUs = () => {
    return (
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
    );
};

export default WhyChooseUs;