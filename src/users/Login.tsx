// import React, { useState } from "react";
// import { Helmet } from "react-helmet";
// import { FaBox, FaFacebookF, FaGoogle } from "react-icons/fa";
// import { MdSecurity, MdTrackChanges } from "react-icons/md";
// import { useAuth } from "../context/AuthContext";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const Login: React.FC = () => {
//   const { users } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     setError("");

//     const user = users.find(
//       (u) => u.email === email && u.password === password
//     );

//     if (!user) {
//       setError("Invalid email or password!");
//       return;
//     }

//     Cookies.set("currentUser", JSON.stringify(user), { expires: 1 });

//       toast.success(`Welcome back, ${user.name}!`, {
//     duration: 1800,
//   });

//     navigate("/dashboard/"); // Redirect to home
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#046838]/20 to-gray-900 relative overflow-hidden">
//       <Helmet>
//         <title>Login | Logistics Dashboard</title>
//         <meta
//           name="description"
//           content="Log in to manage shipments and track logistics"
//         />
//       </Helmet>

//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#046838] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
//         <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FA921D] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-32 left-1/3 w-80 h-80 bg-[#046838]/60 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
//         <div className="grid lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20">
//           {/* Left Side - Login Form */}
//           <div className="p-10 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl">
//             <div className="max-w-md mx-auto w-full">
//               {/* Logo */}
//               <div className="flex justify-center mb-10">
//                 <img
//                   className="w-64 object-contain"
//                   src="https://i.ibb.co/7xjs7YjB/Expresur-02-1-removebg-preview.webp"
//                   alt="Expresur Logo"
//                 />
//               </div>

//               <h2 className="text-4xl font-bold text-[#046838] mb-3">
//                 Welcome Back!
//               </h2>
//               <p className="text-gray-600 mb-10">
//                 Log in to track shipments, manage logistics, and stay ahead.
//               </p>

//               <form
//                 className="space-y-6"
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   handleLogin();
//                 }}
//               >
//                 <input
//                   type="email"
//                   placeholder="you@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#046838] focus:border-[#046838] transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
//                   required
//                 />

//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#046838] focus:border-[#046838] transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
//                   required
//                 />

//                 {/* Gradient button */}
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-[#046838] to-[#035230] hover:from-[#035230] hover:to-[#024025] text-white font-bold py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
//                 >
//                   Sign In Securely
//                 </button>

//                 {/* Error message */}
//                 {error && <p className="text-red-500 mt-2">{error}</p>}
//               </form>

//               <div className="mt-8">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-white text-gray-500 font-medium">
//                       Or continue with
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-6 grid grid-cols-2 gap-4">
//                   <button
//                     type="button"
//                     className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow transition text-gray-800"
//                     onClick={() => alert("Continue with Google (implement)")}
//                   >
//                     {React.createElement(FaGoogle as any, {
//                       className: "text-xl text-red-500",
//                     })}
//                     <span className="font-medium">Google</span>
//                   </button>

//                   <button
//                     type="button"
//                     className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow transition text-gray-800"
//                     onClick={() => alert("Continue with Facebook (implement)")}
//                   >
//                     {React.createElement(FaFacebookF as any, {
//                       className: "text-xl text-blue-600",
//                     })}
//                     <span className="font-medium">Facebook</span>
//                   </button>
//                 </div>
//               </div>

//               <p className="mt-8 text-center text-gray-600">
//                 New here?{" "}
//                 <a
//                   href="/register"
//                   className="font-bold text-[#FA921D] hover:text-[#e07f00] transition"
//                 >
//                   Create an account
//                 </a>
//               </p>
//             </div>
//           </div>

//           {/* Right Side - Hero Section */}
//           <div className="hidden lg:flex relative bg-gradient-to-br from-[#046838] via-[#046838] to-[#035230] p-16 flex-col justify-center items-start text-white">
//             <div className="max-w-lg">
//               <h1 className="text-5xl font-bold mb-6 leading-tight">
//                 Real-Time Logistics,
//                 <br />
//                 <span className="text-[#FA921D]">Reimagined</span>
//               </h1>
//               <p className="text-xl text-green-100 mb-10 leading-relaxed">
//                 Track every package, optimize routes, and deliver faster than
//                 ever with Bangladesh’s most trusted logistics platform.
//               </p>

//               <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                   <div className="p-4 bg-[#FA921D]/20 backdrop-blur-md rounded-2xl">
//                     {React.createElement(MdTrackChanges as any, {
//                       className: "text-3xl text-[#FA921D]",
//                     })}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold">
//                       Live Tracking Dashboard
//                     </h3>
//                     <p className="text-green-100">
//                       See every shipment in real-time
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <div className="p-4 bg-[#FA921D]/20 backdrop-blur-md rounded-2xl">
//                     {React.createElement(MdSecurity as any, {
//                       className: "text-3xl text-[#FA921D]",
//                     })}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold">
//                       100% Secure Platform
//                     </h3>
//                     <p className="text-green-100">
//                       Bank-level encryption & protection
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating Elements */}
//             <div className="absolute top-10 right-10 opacity-20">
//               {React.createElement(FaBox as any, {
//                 className: "text-9xl animate-float",
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Animation Styles */}
//       <style>{`
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         .animate-blob { animation: blob 18s infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//         .animation-delay-4000 { animation-delay: 4s; }
//         @keyframes float {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-20px); }
//         }
//         .animate-float { animation: float 6s ease-in-out infinite; }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.tsx
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaBox, FaFacebookF, FaGoogle } from "react-icons/fa";
import { MdSecurity, MdTrackChanges } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../assets/Grupo 1.png";


const Login: React.FC = () => {
  const { users } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    setError("");

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password!");
      return;
    }

    // Save current user in cookie (1 day)
    Cookies.set("currentUser", JSON.stringify(user), { expires: 1 });

    toast.success(`Welcome back, ${user.name}!`, {
      duration: 1800,
    });

    // Role based redirect
    if (user.role === "admin") {
      navigate("/dashboard/admin");
    } else if (user.role === "user") {
      // Send normal users to the required dashboard route
      navigate("/dashboard/user-dashboard");
    } else {
      // fallback
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#046838]/20 to-gray-900 relative overflow-hidden">
      <Helmet>
        <title>Login | Logistics Dashboard</title>
        <meta
          name="description"
          content="Log in to manage shipments and track logistics"
        />
      </Helmet>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#046838] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FA921D] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute top-32 left-1/3 w-80 h-80 bg-[#046838]/60 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20">
          {/* Left Side - Login Form */}
          <div className="p-10 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl">
            <div className="max-w-md mx-auto w-full">
              {/* Logo */}
              <div className="flex justify-center mb-10">
                <img
                  className="w-64 object-contain"
                  src={Logo}
                  alt="Expresur Logo"
                />
              </div>

              <h2 className="text-4xl font-bold text-[#046838] mb-3">
                Welcome Back!
              </h2>
              <p className="text-gray-600 mb-10">
                Log in to track shipments, manage logistics, and stay ahead.
              </p>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#046838] focus:border-[#046838] transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                  required
                />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#046838] focus:border-[#046838] transition-all duration-300 placeholder-gray-400 text-gray-800 font-medium"
                  required
                />

                {/* Gradient button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#046838] to-[#035230] hover:from-[#035230] hover:to-[#024025] text-white font-bold py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In Securely
                </button>

                {/* Error message */}
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow transition text-gray-800"
                    onClick={() => alert("Continue with Google (implement)")}
                  >
                    {React.createElement(FaGoogle as any, {
                      className: "text-xl text-red-500",
                    })}
                    <span className="font-medium">Google</span>
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow transition text-gray-800"
                    onClick={() => alert("Continue with Facebook (implement)")}
                  >
                    {React.createElement(FaFacebookF as any, {
                      className: "text-xl text-blue-600",
                    })}
                    <span className="font-medium">Facebook</span>
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-gray-600">
                New here?{" "}
                <a
                  href="/register"
                  className="font-bold text-[#FA921D] hover:text-[#e07f00] transition"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Hero Section */}
          <div className="hidden lg:flex relative bg-gradient-to-br from-[#046838] via-[#046838] to-[#035230] p-16 flex-col justify-center items-start text-white">
            <div className="max-w-lg">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Real-Time Logistics,
                <br />
                <span className="text-[#FA921D]">Reimagined</span>
              </h1>
              <p className="text-xl text-green-100 mb-10 leading-relaxed">
                Track every package, optimize routes, and deliver faster than
                ever with Bangladesh’s most trusted logistics platform.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#FA921D]/20 backdrop-blur-md rounded-2xl">
                    {React.createElement(MdTrackChanges as any, {
                      className: "text-3xl text-[#FA921D]",
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Live Tracking Dashboard
                    </h3>
                    <p className="text-green-100">
                      See every shipment in real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#FA921D]/20 backdrop-blur-md rounded-2xl">
                    {React.createElement(MdSecurity as any, {
                      className: "text-3xl text-[#FA921D]",
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      100% Secure Platform
                    </h3>
                    <p className="text-green-100">
                      Bank-level encryption & protection
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 opacity-20">
              {React.createElement(FaBox as any, {
                className: "text-9xl animate-float",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 18s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;
