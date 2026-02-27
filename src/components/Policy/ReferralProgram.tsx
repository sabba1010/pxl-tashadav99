// import React from "react";
// import {
//   Gift,
//   Users,
//   Share2,
//   CheckCircle,
//   ArrowRight,
//   Copy,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useAuthHook } from "../../hook/useAuthHook";

// const ReferralProgram: React.FC = () => {
//   const { data } = useAuthHook();
//   const referralLink = `http://localhost:3000/register?ref=${data?.referralCode}`;

//   const [copied, setCopied] = React.useState(false);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(referralLink);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000); // 2 সেকেন্ড পর আবার "Copy Link" হবে
//     } catch (err) {
//       console.error("Failed to copy:", err);
//       alert("Copy failed! Please copy manually.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white py-16 px-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Hero */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-yellow-100 border border-yellow-300 mb-8">
//             <Gift className="w-7 h-7 text-yellow-600" />
//             <span className="text-yellow-700 font-bold text-lg">
//               Referral Program
//             </span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold text-[#e6c06c] mb-6">
//             Invite Friends.
//             <br />
//             Earn $5 Each!
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Share your link → Friend completes first $50+ trade → Both get $5
//             wallet credit instantly!
//           </p>
//         </div>

//         {/* How It Works - Cards */}
//         <div className="grid gap-6 md:grid-cols-3 mb-16">
//           {[
//             { step: "1", title: "Share Your Link", icon: Share2 },
//             { step: "2", title: "Friend Signs Up & Trades", icon: Users },
//             { step: "3", title: "Both Get $5 Credit", icon: Gift },
//           ].map((item) => (
//             <div key={item.step} className="text-center">
//               <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#33ac6f] flex items-center justify-center">
//                 <item.icon className="w-9 h-9 text-white" />
//               </div>
//               <div className="text-4xl font-bold text-[#e6c06c] mb-2">
//                 0{item.step}
//               </div>
//               <h3 className="text-xl font-semibold text-[#00183b]">
//                 {item.title}
//               </h3>
//             </div>
//           ))}
//         </div>

//         {/* Referral Link Box */}
//         <div className="max-w-2xl mx-auto mb-16">
//           <div className="p-8 bg-gradient-to-br from-[#00183b] to-[#002a5c] rounded-3xl text-center text-white">
//             <p className="text-lg mb-4 opacity-90">
//               Your Personal Referral Link
//             </p>
//             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 break-all font-mono text-lg">
//               {referralLink}
//             </div>
//             <button
//               onClick={handleCopy}
//               className="mt-6 px-8 py-4 bg-teal-500 hover:bg-teal-400 rounded-2xl font-bold text-lg transition-all hover:scale-105 inline-flex items-center gap-2"
//             >
//               {copied ? (
//                 <>
//                   <CheckCircle className="w-6 h-6" />
//                   Copied!
//                 </>
//               ) : (
//                 <>
//                   <Copy className="w-5 h-5" />
//                   Copy Link
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Rules */}
//         <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
//           <h2 className="text-3xl font-bold text-[#00183b] text-center mb-8">
//             Rules & Conditions
//           </h2>
//           <ul className="space-y-4 max-w-3xl mx-auto text-gray-700">
//             {[
//               "New users only (no existing accounts)",
//               "First trade must be $50 or more",
//               "Credit expires in 90 days",
//               "No self-referrals or fake accounts",
//               "We reserve the right to cancel abusive referrals",
//               "Follow the all the website social media quality",
//               "Post atleast or repost 1 website video to qualify"
//             ].map((rule, i) => (
//               <li key={i} className="flex items-start gap-3">
//                 <CheckCircle className="w-6 h-6 text-[#33ac6f] flex-shrink-0 mt-0.5" />
//                 <span className="text-lg">{rule}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* CTA */}
//         <div className="mt-16 text-center">
//           <Link
//             to="/dashboard"
//             className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all"
//           >
//             Go to Dashboard
//             <ArrowRight className="w-6 h-6" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReferralProgram;
import React from "react";
import {
  Gift,
  Users,
  Share2,
  CheckCircle,
  ArrowRight,
  Copy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthHook } from "../../hook/useAuthHook";

const ReferralProgram: React.FC = () => {
  const { data } = useAuthHook();

  // route user to the correct dashboard based on their role
  const dashboardRoute = React.useMemo(() => {
    if (!data?.role) return "/dashboard";
    switch (data.role) {
      case "admin":
        return "/admin-dashboard";
      case "seller":
        return "/seller-dashboard";
      default:
        return "/dashboard";
    }
  }, [data?.role]);

  const referralLink = `http://localhost:3000/register?ref=${data?.referralCode}`;

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Copy failed! Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-5 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-amber-50 border border-amber-200 shadow-sm mb-10">
            <Gift className="w-8 h-8 text-amber-600" />
            <span className="text-amber-700 font-semibold text-xl tracking-wide">
              Referral Program
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            Invite Friends.
            <span className="block mt-2 text-amber-600">Earn $5 Each</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Share your unique link → Friend signs up & completes first $50+ trade →
            <span className="font-medium text-gray-800"> both instantly receive $5</span> in wallet credit.
          </p>
        </div>

        {/* How It Works - Modern Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          {[
            { step: "1", title: "Share Your Link", icon: Share2 },
            { step: "2", title: "Friend Signs Up & Trades", icon: Users },
            { step: "3", title: "Both Get $5 Credit", icon: Gift },
          ].map((item) => (
            <div
              key={item.step}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                <item.icon className="w-7 h-7 text-white" />
              </div>

              <div className="pt-10 text-center">
                <div className="text-5xl font-black text-amber-500/30 mb-3 select-none">
                  0{item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Referral Link Box - Premium look */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-700/50">
            <p className="text-center text-gray-300 text-lg mb-6 font-medium">
              Your Personal Referral Link
            </p>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 font-mono text-lg text-amber-300 break-all text-center tracking-wide">
              {referralLink}
            </div>

            <button
              onClick={handleCopy}
              className={`mt-8 w-full sm:w-auto mx-auto px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${copied
                  ? "bg-green-600 hover:bg-green-700 scale-105"
                  : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 hover:scale-105"
                } text-white`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Copied Successfully!
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  Copy Referral Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rules - Clean & modern */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 md:p-14">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">
            Rules & Conditions
          </h2>

          <ul className="space-y-5 max-w-4xl mx-auto text-gray-700 text-lg">
            {[
              "New users only (no existing accounts)",
              "First trade must be $50 or more",
              "Credit expires in 90 days",
              "No self-referrals or fake accounts",
              "We reserve the right to cancel abusive referrals",
              "Follow all the website social media accounts",
              // "Post at least or repost 1 website video to qualify",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="mt-1.5">
                  <CheckCircle className="w-7 h-7 text-emerald-500 flex-shrink-0" />
                </div>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            to={dashboardRoute}
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:from-emerald-500 hover:to-teal-500 transform hover:scale-105 transition-all duration-300"
          >
            Go to Dashboard
            <ArrowRight className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;