import React from 'react';

const RefundPolicy = () => {
    return (
        <section className="pt-12 pb-24 px-6 md:px-12 lg:px-20 bg-[#002654] text-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Page Title */}
                <h1 className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-[#c49322] mb-12">
                    Buyer & Seller Protection Policy
                </h1>

                <p className="text-center text-lg mb-16 max-w-4xl mx-auto">
                    Your safety is our priority. All purchases on this platform are protected with escrow security, fair dispute resolution, and clear refund guidelines.
                </p>

                {/* Buyer Protection */}
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 border-b-4 border-[#33ac6f] pb-3 inline-block">
                        Buyer Protection Policy
                    </h2>

                    <h3 className="text-xl md:text-2xl font-medium mb-4">How Buyer Protection Works:</h3>
                    <ul className="list-disc pl-8 space-y-3 text-lg mb-8">
                        <li>All payments are held securely in escrow.</li>
                        <li>Sellers do not receive funds until the buyer confirms successful delivery.</li>
                        <li>Buyers are allowed to review the account before confirming completion.</li>
                        <li>Buyers can open a dispute if the account is not delivered or not as described.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl font-medium mb-4">Buyers Are Protected Against:</h3>
                    <ul className="list-disc pl-8 space-y-3 text-lg mb-8">
                        <li>Non-delivery of accounts</li>
                        <li>Incorrect or misleading account details</li>
                        <li>Fake or fraudulent listings</li>
                        <li>Unauthorized access issues within the protection period</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl font-medium mb-4">Refund Policy:</h3>
                    <ul className="list-disc pl-8 space-y-3 text-lg">
                        <li>If a purchase is unsuccessful, the admin will refund the buyer.</li>
                        <li>Refunds are processed after admin review.</li>
                        <li>Refund decisions are final and based on evidence.</li>
                    </ul>
                </div>

                {/* Seller Protection */}
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 border-b-4 border-[#33ac6f] pb-3 inline-block">
                        Seller Protection Policy
                    </h2>

                    <p className="text-lg mb-6">We protect honest sellers and ensure fair transactions.</p>

                    <h3 className="text-xl md:text-2xl font-medium mb-4">How Seller Protection Works:</h3>
                    <ul className="list-disc pl-8 space-y-3 text-lg mb-8">
                        <li>Buyers must confirm account delivery before funds are released.</li>
                        <li>Sellers are protected against false claims.</li>
                        <li>Admin reviews chat history, delivery proof, and transaction details during disputes.</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl font-medium mb-4">Sellers Are Protected Against:</h3>
                    <ul className="list-disc pl-8 space-y-3 text-lg mb-8">
                        <li>False disputes</li>
                        <li>Chargeback attempts after confirmation</li>
                        <li>Abuse of refund system</li>
                    </ul>

                    <h3 className="text-xl md:text-2xl font-medium mb-4">Payment Assurance:</h3>
                    <ul className="list-disc pl-8 space-y-3 text-lg mb-8">
                        <li>Once a buyer confirms delivery, payment is guaranteed.</li>
                        <li>Seller earnings are credited to their account.</li>
                        <li>Withdrawals are processed after admin approval.</li>
                    </ul>
                </div>

                {/* Pricing Regulations */}
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 border-b-4 border-[#33ac6f] pb-3 inline-block">
                        Pricing Regulations
                    </h2>

                    <p className="text-lg mb-6">
                        To maintain fairness and trust on the platform, all sellers must follow these pricing rules:
                    </p>

                    <ul className="list-disc pl-8 space-y-3 text-lg">
                        <li>Sellers must set fair and reasonable prices for all listed products to avoid rejection.</li>
                        <li>Sellers must list accounts at fair market value.</li>
                        <li>Listings with unrealistic, misleading, or excessively inflated prices may be rejected or removed by the admin.</li>
                        <li>Repeated pricing violations may result in account suspension.</li>
                    </ul>
                </div>

                {/* Dispute Resolution & Commitment */}
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-8 border-b-4 border-[#33ac6f] pb-3 inline-block">
                        Dispute Resolution
                    </h2>

                    <ul className="list-disc pl-8 space-y-3 text-lg mb-8">
                        <li>Admin oversees and resolves all disputes.</li>
                        <li>Admin decisions are final.</li>
                        <li>Fraudulent activity results in suspension or permanent ban.</li>
                    </ul>
                </div>

                <div className="text-center bg-[#00345f]/50 rounded-2xl py-10 px-8">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-4">Our Commitment</h3>
                    <p className="text-xl max-w-3xl mx-auto">
                        We are committed to maintaining a safe, transparent, and trusted marketplace for all users.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RefundPolicy;