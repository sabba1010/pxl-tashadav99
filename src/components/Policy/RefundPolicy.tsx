import React from 'react';

const RefundPolicy = () => {
    return (
        <section className="pt-12 pb-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#002a5c] to-[#00183b] text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Page Title */}
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-12">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c49322] to-[#e6b545]">
                        Buyer & Seller Protection Policy
                    </span>
                </h1>

                <p className="text-center text-lg mb-16 max-w-4xl mx-auto opacity-90">
                    Your safety is our priority. All purchases on this platform are protected with escrow security, fair dispute resolution, and clear refund guidelines.
                </p>

                {/* Cards Grid - Responsive: 1 col mobile, 2 col md, 3 col lg */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Buyer Protection Card */}
                    <div className="bg-[#00345f]/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[#33ac6f]/40 hover:scale-105 hover:shadow-[#33ac6f]/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-4 border-[#33ac6f] pb-3 inline-block">
                            Buyer Protection
                        </h2>

                        <h3 className="text-lg font-medium mb-3 text-[#c49322]">How It Works:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-base mb-6">
                            <li>All payments held securely in escrow</li>
                            <li>Funds released only after buyer confirmation</li>
                            <li>Full account review allowed before completion</li>
                            <li>Dispute option for non-delivery or mismatches</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3 text-[#c49322]">Protected Against:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-base">
                            <li>Non-delivery</li>
                            <li>Misleading details</li>
                            <li>Fake listings</li>
                            <li>Unauthorized access issues</li>
                        </ul>
                    </div>

                    {/* Refund Policy Card - Separate as requested */}
                    <div className="bg-[#00345f]/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[#c49322]/50 hover:scale-105 hover:shadow-[#c49322]/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-4 border-[#c49322] pb-3 inline-block">
                            Refund Policy
                        </h2>
                        <ul className="list-disc pl-6 space-y-3 text-base">
                            <li>Full refund if purchase is unsuccessful</li>
                            <li>Processed only after thorough admin review</li>
                            <li>Decisions based on clear evidence</li>
                            <li>All refund decisions are final</li>
                        </ul>
                        <p className="mt-6 text-sm italic opacity-80">
                            Your money is safe until you're fully satisfied.
                        </p>
                    </div>

                    {/* Seller Protection Card */}
                    <div className="bg-[#00345f]/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[#33ac6f]/40 hover:scale-105 hover:shadow-[#33ac6f]/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-4 border-[#33ac6f] pb-3 inline-block">
                            Seller Protection
                        </h2>

                        <h3 className="text-lg font-medium mb-3 text-[#c49322]">How It Works:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-base mb-6">
                            <li>Payment guaranteed after buyer confirmation</li>
                            <li>Protection from false disputes</li>
                            <li>Admin reviews all evidence fairly</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-3 text-[#c49322]">Protected Against:</h3>
                        <ul className="list-disc pl-6 space-y-2 text-base">
                            <li>False claims</li>
                            <li>Chargebacks after delivery</li>
                            <li>Refund system abuse</li>
                        </ul>
                    </div>

                    {/* Pricing Regulations Card */}
                    <div className="bg-[#00345f]/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[#33ac6f]/40 hover:scale-105 hover:shadow-[#33ac6f]/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-4 border-[#33ac6f] pb-3 inline-block">
                            Pricing Regulations
                        </h2>
                        <ul className="list-disc pl-6 space-y-3 text-base">
                            <li>Fair and reasonable pricing required</li>
                            <li>Must reflect true market value</li>
                            <li>Inflated prices will be rejected</li>
                            <li>Repeated violations lead to suspension</li>
                        </ul>
                    </div>

                    {/* Dispute Resolution Card */}
                    <div className="bg-[#00345f]/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[#33ac6f]/40 hover:scale-105 hover:shadow-[#33ac6f]/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-4 border-[#33ac6f] pb-3 inline-block">
                            Dispute Resolution
                        </h2>
                        <ul className="list-disc pl-6 space-y-3 text-base">
                            <li>All disputes handled by admin</li>
                            <li>Decisions are final and binding</li>
                            <li>Fraud results in permanent ban</li>
                        </ul>
                    </div>

                    {/* Payment Assurance Card */}
                    <div className="bg-[#00345f]/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[#c49322]/50 hover:scale-105 hover:shadow-[#c49322]/30 transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b-4 border-[#c49322] pb-3 inline-block">
                            Payment Assurance
                        </h2>
                        <ul className="list-disc pl-6 space-y-3 text-base">
                            <li>Guaranteed payout on confirmation</li>
                            <li>Earnings credited instantly</li>
                            <li>Fast withdrawal processing</li>
                        </ul>
                    </div>
                </div>

                {/* Final Commitment Section */}
                <div className="mt-20 text-center bg-gradient-to-r from-[#00345f]/80 to-[#002654]/90 rounded-3xl py-12 px-10 shadow-2xl border border-[#33ac6f]/30">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#c49322]">
                        Our Commitment
                    </h3>
                    <p className="text-xl max-w-4xl mx-auto opacity-90 leading-relaxed">
                        We are dedicated to building the safest, most transparent, and trusted marketplace for buyers and sellers worldwide.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RefundPolicy;