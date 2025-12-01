// src/pages/Register.tsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaTachometerAlt,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "sonner";

const Icon = React.memo(
  ({ icon: IconComponent, className }: { icon: any; className?: string }) => (
    <IconComponent className={className} />
  )
);

const Register: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const removePhoto = () => {
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);

    const input = document.getElementById("profilePhotoInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget; // prevents null issue
    const elements = form.elements;

    const firstName = (elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const lastName = (elements.namedItem("lastName") as HTMLInputElement).value.trim();
    const email = (elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (elements.namedItem("phone") as HTMLInputElement).value.trim();
    const username = (elements.namedItem("username") as HTMLInputElement).value.trim() || null;
    const password = (elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (elements.namedItem("confirmPassword") as HTMLInputElement).value;

    const country = (elements.namedItem("country") as HTMLInputElement).value.trim();
    const state = (elements.namedItem("state") as HTMLInputElement).value.trim();
    const city = (elements.namedItem("city") as HTMLInputElement).value.trim();
    const address = (elements.namedItem("address") as HTMLInputElement).value.trim();
    const postalCode = (elements.namedItem("postalCode") as HTMLInputElement).value.trim();

    // Validation
    if (!email.includes("@")) {
      alert("Please enter a valid email");
      setIsSubmitting(false);
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Photo file
    const photoInput = document.getElementById("profilePhotoInput") as HTMLInputElement;
    const profilePhoto = photoInput?.files?.[0] || null;

    // Separate delivery address object
    const deliveryAddress = {
      country,
      state,
      city,
      address,
      postalCode,
    };

    const formData = {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
      userEmail: email,
      profilePhoto: profilePhoto ? profilePhoto.name : "None",
      deliveryAddress,
      role: "user",
    };

    console.log("REGISTRATION SUBMITTED:", formData);

    setTimeout(() => {
       toast.success(`Welcome back, ${formData.firstName}!`, {
    duration: 1800,
  });
      form.reset(); // safe reset
      removePhoto();
      setIsSubmitting(false);
    }, 1000);
  };

  const features = [
    { icon: FaTachometerAlt, title: "42% Faster Delivery", desc: "AI-powered route optimization" },
    { icon: FaShieldAlt, title: "100% Secure Platform", desc: "Bank-grade encryption & compliance" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <Helmet>
        <title>Register | Expresur Logistics</title>
      </Helmet>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#046838]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FA921D]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden">

          {/* LEFT SIDE (FORM) */}
          <div className="p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-lg mx-auto w-full">

              <img
                src="https://i.ibb.co/7xjs7YjB/Expresur-02-1-removebg-preview.webp"
                alt="Logo"
                className="h-12 lg:h-16 object-contain mb-10"
              />

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Welcome to the Future of Logistics
              </h2>

              <p className="text-lg text-gray-600 mb-10">
                Join thousands of businesses delivering smarter and faster.
              </p>

              <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="space-y-6">

                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="First Name" name="firstName" required fullWidth />
                    <TextField label="Last Name" name="lastName" required fullWidth />
                  </div>

                  <TextField label="Business Email" name="email" type="email" required fullWidth />
                  <TextField label="Phone Number" name="phone" type="tel" required fullWidth />
                  <TextField label="Username (Optional)" name="username" fullWidth />

                  {/* PHOTO UPLOAD */}
                  <div className="flex items-center gap-6">
                    {photoPreview ? (
                      <div className="relative group">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-20 h-26 rounded-full object-cover ring-4 ring-[#046838]/10 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Icon icon={FaTimes} className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="profilePhotoInput"
                        className="w-20 h-16 rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer"
                      >
                        <Icon icon={FaUpload} className="text-gray-400 text-2xl" />
                      </label>
                    )}

                    <input
                      id="profilePhotoInput"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#046838] file:text-white hover:file:bg-[#035230]"
                    />
                  </div>

                  {/* DELIVERY ADDRESS */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-5">Delivery Address</h3>

                    <TextField label="Country" name="country" required fullWidth sx={{ mb: 3 }} />
                    <TextField label="State" name="state" required fullWidth sx={{ mb: 3 }} />
                    <TextField label="City" name="city" required fullWidth sx={{ mb: 3 }} />
                    <TextField label="Address" name="address" required fullWidth sx={{ mb: 3 }} />
                    <TextField label="Postal Code" name="postalCode" required fullWidth sx={{ mb: 3 }} />
                  </div>

                  <TextField label="Create Password" name="password" type="password" required fullWidth />
                  <TextField label="Confirm Password" name="confirmPassword" type="password" required fullWidth />

                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="terms" required className="w-5 h-5" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the <span className="text-[#046838] font-medium">Terms</span> and{" "}
                      <span className="text-[#046838] font-medium">Privacy Policy</span>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#046838] hover:bg-[#035230] disabled:bg-gray-400 text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <Icon icon={FaCheckCircle} className="text-xl" />
                        Create Your Free Account
                      </>
                    )}
                  </button>
                </div>
              </Box>

              <p className="mt-8 text-center text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-bold text-[#046838] hover:text-[#FA921D]">
                  Log In
                </a>
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:block relative bg-gradient-to-br from-[#046838] to-[#035230] p-16 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 max-w-lg">

              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Join Thousands of <span className="text-[#FA921D]">Smart Businesses</span>
              </h1>

              <p className="text-xl text-green-100 mb-12">
                Real-time tracking, AI-optimized routes, and unbreakable security — all in one platform.
              </p>

              <div className="space-y-10">
                {features.map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="p-4 bg-[#FA921D]/20 backdrop-blur-sm rounded-2xl group-hover:bg-[#FA921D]/30 transition">
                      <Icon icon={item.icon} className="text-3xl text-[#FA921D]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      <p className="text-green-100">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
