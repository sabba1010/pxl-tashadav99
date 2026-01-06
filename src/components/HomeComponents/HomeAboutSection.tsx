// src/components/HomeAboutSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HomeAboutSection() {
    const { isLoggedIn, user } = useAuth();
    const sellTarget = !isLoggedIn ? "/login" : (user?.role === "seller" || user?.role === "admin") ? "/selling-form" : "/seller-pay";
    return (
        <section className="relative  pb-10 lg:pt-6 pb-28 bg-gradient-to-br from-[#00183b] via-[#002a5c] to-[#003d80] overflow-hidden">
            {/* Subtle gradient blobs matching hero */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#daab4c]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#33ac6f]/10 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#daab4c] to-[#f0d084]">
                            The Most Trusted Social Accounts Marketplace
                        </span>
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed">
                        Since 2023, we've empowered creators, marketers, and businesses worldwide by providing
                        a secure, transparent, and efficient platform to buy and sell premium social media accounts.
                    </p>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { number: "50K+", label: "Accounts Sold" },
                        { number: "15K+", label: "Happy Users" },
                        { number: "180+", label: "Countries" },
                        { number: "4.9", label: "Trust Score" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#daab4c]">{stat.number}</div>
                            <p className="mt-2 text-gray-400 text-xs md:text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div>
                    <div className="grid md:grid-cols-3 gap-8 ">
                        {[
                            {
                                icon: "🎯",
                                title: "Targeted Exposure",
                                desc: "Reach serious buyers looking for your exact niche.",
                            },
                            {
                                icon: "💰",
                                title: "Competitive Bidding",
                                desc: "Drive up prices with real-time bidding system.",
                            },
                            {
                                icon: "🛡️",
                                title: "Fraud Protection",
                                desc: "Advanced verification and dispute resolution.",
                            },
                            {
                                icon: "📈",
                                title: "Growth Tools",
                                desc: "Analytics and insights included with premium accounts.",
                            },
                            {
                                icon: "🌍",
                                title: "Global Marketplace",
                                desc: "Connect with buyers and sellers worldwide.",
                            },
                            {
                                icon: "⚙️",
                                title: "Easy Management",
                                desc: "User-friendly dashboard for all your transactions.",
                            },
                        ].map((f, i) => (
                            <div
                                    key={i}
                                    className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-8 text-center hover:bg-white/20 hover:border-[#daab4c]/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
                                >
                                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 group-hover:scale-110 transition-transform text-[#daab4c]">{f.icon}</div>
                                    <h3 className="text-sm md:text-lg font-semibold mb-2 text-white">{f.title}</h3>
                                    <p className="text-gray-200 text-sm md:text-sm">{f.desc}</p>
                                </div>
                        ))}
                    </div>
                </div>
                {/* Final CTA */}
                <div className="mt-20 text-center">
                    <p className="text-base md:text-lg text-gray-300 mb-6">
                        Ready to grow your online presence instantly?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                        <a
                            href="/marketplace"
                            className="px-5 py-2 md:px-10 md:py-4 bg-[#33ac6f] hover:bg-[#3ed987] text-white font-bold text-sm md:text-lg rounded-lg shadow-md hover:shadow-[#33ac6f]/40 transform hover:scale-105 transition-all duration-300"
                        >
                            Browse Accounts
                        </a>
                        <Link
                            to={sellTarget}
                            className="px-5 py-2 md:px-10 md:py-4 bg-transparent border-2 border-[#daab4c] text-[#daab4c] hover:bg-[#daab4c] hover:text-white font-bold text-sm md:text-lg rounded-lg transition-all duration-300"
                        >
                            Sell Your Account
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}