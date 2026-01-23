// import React, { useState, useEffect, useCallback } from 'react';
// import { Eye, EyeOff, Calendar, User, Lock, Bell, Package } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useAuthHook } from '../hook/useAuthHook';
// import { getAllNotifications } from './Notification/Notification';
// import ListingsManagement from './Listings/ListingsManagement';
// import axios from 'axios';
// import { toast } from 'sonner';

// const AccountSettings = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const { data: userData } = useAuthHook();

//   const tabs = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'security', label: 'Security', icon: Lock },
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     ...(userData?.role === 'seller' || userData?.role === 'admin'
//       ? [{ id: 'listings', label: 'Listings', icon: Package }]
//       : []),
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
//           <p className="mt-2 text-gray-600">
//             Manage your profile, security and notification preferences
//           </p>

//           <div className="mt-6 flex flex-wrap gap-2">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`
//                     flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all
//                     ${isActive
//                       ? 'text-white shadow-sm'
//                       : 'text-gray-700 bg-white border border-gray-300 hover:text-gray-900'
//                     }
//                   `}
//                   style={isActive ? { backgroundColor: '#d4a643' } : {}}
//                 >
//                   <Icon size={16} />
//                   {tab.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="space-y-14">
//           {activeTab === 'profile' && <ProfileSection />}
//           {activeTab === 'security' && <SecuritySection />}
//           {activeTab === 'notifications' && <NotificationsSection />}
//           {activeTab === 'listings' && <ListingsManagement />}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProfileSection = () => {
//   const { user } = useAuth();
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [countryCodes, setCountryCodes] = useState<any[]>([]);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState<any>(null);
//   const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
//   const [tempPhoneNumber, setTempPhoneNumber] = useState('');
//   const [tempCountry, setTempCountry] = useState<any>(null);
//   const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
//   const [savingPhone, setSavingPhone] = useState(false);

//   // Load country codes
//   useEffect(() => {
//     const loadCountryCodes = async () => {
//       try {
//         const response = await import('../assets/Country/CountryCodes.json');
//         const codes = response.default || [];
//         setCountryCodes(codes);
        
//         // Initialize with Nigeria as default country
//         const defaultCountry = codes.find((c: any) => c.code === 'NG');
//         if (defaultCountry) {
//           setSelectedCountry(defaultCountry);
//           setTempCountry(defaultCountry);
//           console.log('Default country set to:', defaultCountry);
//         } else if (codes.length > 0) {
//           setSelectedCountry(codes[0]);
//           setTempCountry(codes[0]);
//         }
//       } catch (error) {
//         console.error('Failed to load country codes:', error);
//       }
//     };
//     loadCountryCodes();
//   }, []);

//   // Fetch user profile data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           console.warn('No token found, skipping profile fetch');
//           if (user?.email) {
//             // Use user data from auth context as fallback
//             setUserData({
//               name: (user as any)?.name || '',
//               email: user.email,
//               phone: (user as any)?.phone || '',
//               countryCode: (user as any)?.countryCode || '',
//             });
//           }
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           `https://vps-backend-server-beta.vercel.app/api/user/profile`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             timeout: 5000,
//           }
//         );

//         if ((response.data as any)) {
//           console.log('User data received:', response.data);
//           setUserData(response.data);
//           setPhoneNumber((response.data as any).phone || '');
//           setTempPhoneNumber((response.data as any).phone || '');

//           // Set country from registration data
//           if ((response.data as any).countryCode && countryCodes.length > 0) {
//             const country = countryCodes.find(
//               (c: any) => c.dial_code === (response.data as any).countryCode
//             );
//             if (country) {
//               console.log('Country found:', country);
//               setSelectedCountry(country);
//               setTempCountry(country);
//             } else {
//               // Default to Nigeria if country code not found
//               const defaultCountry = countryCodes.find((c: any) => c.code === 'NG');
//               if (defaultCountry) {
//                 setSelectedCountry(defaultCountry);
//                 setTempCountry(defaultCountry);
//               }
//             }
//           } else if (countryCodes.length > 0) {
//             // Default to first country (usually Afghanistan based on CountryCodes.json)
//             console.log('No country code, using default');
//             const defaultCountry = countryCodes.find((c: any) => c.code === 'NG') || countryCodes[0];
//             setSelectedCountry(defaultCountry);
//             setTempCountry(defaultCountry);
//           }
//         }
//       } catch (error: any) {
//         console.error('Failed to fetch user data:', error.message);
        
//         // Fallback to auth context user data
//         if (user?.email) {
//           console.log('Using fallback data from auth context');
//           const fallbackData = {
//             name: (user as any)?.name || '',
//             email: user.email,
//             phone: (user as any)?.phone || '',
//             countryCode: (user as any)?.countryCode || '',
//           };
//           console.log('Fallback data:', fallbackData);
//           setUserData(fallbackData);
//           setPhoneNumber((user as any)?.phone || '');
//           setTempPhoneNumber((user as any)?.phone || '');
          
//           if ((user as any)?.countryCode && countryCodes.length > 0) {
//             const country = countryCodes.find(
//               (c: any) => c.dial_code === (user as any)?.countryCode
//             );
//             if (country) {
//               setSelectedCountry(country);
//               setTempCountry(country);
//             } else {
//               // Default to Nigeria if country code not found
//               const defaultCountry = countryCodes.find((c: any) => c.code === 'NG');
//               if (defaultCountry) {
//                 setSelectedCountry(defaultCountry);
//                 setTempCountry(defaultCountry);
//               }
//             }
//           } else if (countryCodes.length > 0) {
//             // Default to Nigeria
//             const defaultCountry = countryCodes.find((c: any) => c.code === 'NG') || countryCodes[0];
//             setSelectedCountry(defaultCountry);
//             setTempCountry(defaultCountry);
//           }
          
//           console.log('Using fallback user data from auth context');
//         } else {
//           console.error('No user data available');
//           toast.error('Failed to load user information');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.email && countryCodes.length > 0) {
//       fetchUserData();
//     }
//   }, [user, countryCodes]);

//   const handleUpdatePhoneClick = () => {
//     setTempPhoneNumber(phoneNumber);
//     setTempCountry(selectedCountry);
//     setIsPhoneModalOpen(true);
//   };

//   const handleSavePhone = async () => {
//     if (!tempPhoneNumber.trim()) {
//       toast.error('Phone number is required');
//       return;
//     }

//     if (!tempCountry) {
//       toast.error('Please select a country');
//       return;
//     }

//     setSavingPhone(true);
//     try {
//       const response = await axios.put(
//         `https://vps-backend-server-beta.vercel.app/api/user/update-phone`,
//         {
//           email: user?.email,
//           phone: tempPhoneNumber.trim(),
//           countryCode: tempCountry.dial_code,
//           countryName: tempCountry.name,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       );

//       if ((response.data as any).success || response.status === 200) {
//         toast.success('Phone number updated successfully');
//         setPhoneNumber(tempPhoneNumber);
//         setSelectedCountry(tempCountry);
//         setIsPhoneModalOpen(false);
//       } else {
//         toast.error((response.data as any).message || 'Failed to update phone number');
//       }
//     } catch (error: any) {
//       console.error('Update phone error:', error);
//       toast.error(error.response?.data?.message || 'Failed to update phone number');
//     } finally {
//       setSavingPhone(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-1">Personal Information</h2>
//         <div className="flex items-center justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-14">
//       {/* Personal Information */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900 mb-1">Personal Information</h2>
//             <p className="text-sm text-gray-500">Your information from registration</p>
//           </div>
//           <button
//             onClick={handleUpdatePhoneClick}
//             className="px-6 py-2.5 text-white rounded-lg font-semibold transition shadow-sm"
//             style={{ backgroundColor: '#d4a643' }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4952f')}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#d4a643')}
//           >
//             Update Phone
//           </button>
//         </div>

//         <div className="space-y-6 max-w-2xl">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//             <input
//               type="text"
//               value={userData?.name || ''}
//               disabled
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
//             />
//             <p className="mt-1.5 text-xs text-gray-500">Cannot be changed</p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               value={userData?.email || ''}
//               disabled
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
//             />
//             <p className="mt-1.5 text-xs text-gray-500">Cannot be changed</p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
//             <div className="flex rounded-lg border border-gray-300 overflow-hidden">
//               <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-3 text-gray-700 min-w-fit">
//                 {selectedCountry ? (
//                   <>
//                     <img
//                       src={`https://flagcdn.com/16x12/${selectedCountry.code.toLowerCase()}.png`}
//                       alt={selectedCountry.name}
//                       className="w-5 h-auto"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).style.display = 'none';
//                       }}
//                     />
//                     <span className="text-sm font-medium whitespace-nowrap">{selectedCountry.dial_code}</span>
//                   </>
//                 ) : (
//                   <span className="text-sm text-gray-500">Select country</span>
//                 )}
//               </div>
//               <input
//                 type="tel"
//                 value={phoneNumber || ''}
//                 disabled
//                 placeholder="Enter your phone number"
//                 className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 cursor-not-allowed outline-none"
//               />
//             </div>
//             <p className="mt-1.5 text-xs text-gray-500">
//               {phoneNumber ? 'Click "Update Phone" button above to change' : 'Click "Update Phone" button above to add your phone number'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Phone Update Modal */}
//       {isPhoneModalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Update Phone Number</h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
//                 <div className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
//                     className="w-full flex items-center justify-between rounded-lg border border-gray-300 px-4 py-3 hover:border-orange-500 transition"
//                   >
//                     <div className="flex items-center gap-2">
//                       {tempCountry && (
//                         <>
//                           <img
//                             src={`https://flagcdn.com/16x12/${tempCountry.code.toLowerCase()}.png`}
//                             alt={tempCountry.name}
//                             className="w-5 h-auto"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                           <span className="text-sm">{tempCountry.name}</span>
//                         </>
//                       )}
//                     </div>
//                     <svg
//                       className={`w-4 h-4 transition ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                     </svg>
//                   </button>

//                   {isCountryDropdownOpen && (
//                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
//                       {countryCodes.map((country: any) => (
//                         <div
//                           key={country.code}
//                           onClick={() => {
//                             setTempCountry(country);
//                             setIsCountryDropdownOpen(false);
//                           }}
//                           className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
//                         >
//                           <img
//                             src={`https://flagcdn.com/16x12/${country.code.toLowerCase()}.png`}
//                             alt={country.name}
//                             className="w-5 h-auto"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).style.display = 'none';
//                             }}
//                           />
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-gray-900 truncate">{country.name}</p>
//                             <p className="text-xs text-gray-500">{country.dial_code}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                 <input
//                   type="tel"
//                   value={tempPhoneNumber}
//                   onChange={(e) => setTempPhoneNumber(e.target.value)}
//                   placeholder="Enter phone number"
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={() => setIsPhoneModalOpen(false)}
//                   disabled={savingPhone}
//                   className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSavePhone}
//                   disabled={savingPhone}
//                   className="flex-1 px-4 py-2.5 text-white rounded-lg font-semibold transition disabled:opacity-50"
//                   style={{ backgroundColor: '#d4a643' }}
//                   onMouseEnter={(e) => !savingPhone && (e.currentTarget.style.backgroundColor = '#c4952f')}
//                   onMouseLeave={(e) => !savingPhone && (e.currentTarget.style.backgroundColor = '#d4a643')}
//                 >
//                   {savingPhone ? 'Saving...' : 'Save'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Additional Information */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-1">Additional Information</h2>
//         <p className="text-sm text-gray-500 mb-6">Verify your identity</p>

//         <div className="space-y-6 max-w-2xl">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//               <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
//                 <option>Nigeria</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//               <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
//                 <option>OS</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//             <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
//               <option>OS</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//             <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
//               <option>Osogbo</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">User address</label>
//             <input
//               type="text"
//               placeholder="Enter your address"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//             />
//           </div>

//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="DD-MM-YYYY"
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           <div className="flex justify-end pt-4">
//             <button className="text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm" style={{ backgroundColor: '#d4a643' }} onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c4952f'} onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d4a643'}>
//               Save & Proceed
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SecuritySection = () => {
//   const { user } = useAuth();
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Password validation function
//   const validatePassword = (password: string) => {
//     if (password.length < 3 || password.length > 30) {
//       toast.error("❌ Password must be between 3 and 30 characters.");
//       return false;
//     }

//     const passwordRegex = /^[a-z0-9!@#$%^&*()_+\-={};"':,.<>|?\\[\]]*$/;
//     if (!passwordRegex.test(password)) {
//       toast.error("❌ Password can only contain lowercase letters, numbers, and symbols.");
//       return false;
//     }

//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSymbol = /[!@#$%^&*()_+\-={};"':,.<>|?\\[\]]/.test(password);

//     if (!hasLowercase || !hasNumber || !hasSymbol) {
//       toast.error("❌ Password must contain lowercase letters, numbers, and symbols together!");
//       return false;
//     }

//     return true;
//   };

//   const handleUpdatePassword = async () => {
//     // Validation
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       toast.error("❌ All fields are required!");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("❌ New passwords do not match!");
//       return;
//     }

//     if (currentPassword === newPassword) {
//       toast.error("❌ New password must be different from current password!");
//       return;
//     }

//     if (!validatePassword(newPassword)) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.put(
//         `https://vps-backend-server-beta.vercel.app/api/user/update-password`,
//         {
//           email: user?.email,
//           currentPassword,
//           newPassword,
//         }
//       );

//       if ((response.data as any).success || response.status === 200) {
//         toast.success("✅ Password updated successfully!");
//         setCurrentPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//       } else {
//         toast.error((response.data as any).message || "❌ Failed to update password!");
//       }
//     } catch (err: any) {
//       console.error("Update password error:", err);
//       if (err.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else if (err.response?.status === 401) {
//         toast.error("❌ Current password is incorrect!");
//       } else {
//         toast.error("❌ Failed to update password. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//   };

//   return (
//     <div className="space-y-14">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-1">Password</h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Please enter your current password to change your password.
//         </p>

//         <div className="space-y-5 max-w-xl">
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//             <div className="relative">
//               <input
//                 type={showCurrentPassword ? "text" : "password"}
//                 placeholder="Current Password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//             <div className="relative">
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
//             <li>Minimum length of 3-30 characters</li>
//             <li>Must contain lowercase, numbers, and symbols together</li>
//           </ul>

//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-end gap-4 pt-4">
//             <button
//               type="button"
//               onClick={handleCancel}
//               disabled={loading}
//               className="px-8 py-2.5 border rounded-lg transition font-medium hover:bg-gray-50 disabled:opacity-50"
//               style={{ borderColor: '#d4a643', color: '#d4a643' }}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleUpdatePassword}
//               disabled={loading}
//               className="px-8 py-2.5 text-white rounded-lg transition font-medium disabled:opacity-50"
//               style={{ backgroundColor: '#d4a643' }}
//               onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#c4952f')}
//               onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#d4a643')}
//             >
//               {loading ? 'Updating...' : 'Update password'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const NotificationsSection = () => {
//   const { user } = useAuth();
//   const { data: userData } = useAuthHook();
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchNotifications = useCallback(async () => {
//     try {
//       const res = await getAllNotifications();
//       const userRole = userData?.role;

//       const myNotifs = Array.isArray(res)
//         ? res.filter((n: any) => {
//             const isDirect = n.userEmail === user?.email;
//             const isAll = n.target === "all";
//             const isRoleMatch = userRole && n.target === `${userRole}s`;
//             return isDirect || isAll || isRoleMatch;
//           })
//         : [];

//       const sortedNotifs = myNotifs.sort(
//         (a: any, b: any) =>
//           new Date(b.createdAt || 0).getTime() -
//           new Date(a.createdAt || 0).getTime()
//       );

//       setNotifications(sortedNotifs);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     }
//   }, [user?.email, userData?.role]);

//   useEffect(() => {
//     const loadNotifications = async () => {
//       setLoading(true);
//       await fetchNotifications();
//       setLoading(false);
//     };

//     if (user?.email) {
//       loadNotifications();
//       const interval = setInterval(async () => {
//         await fetchNotifications();
//       }, 8000);
//       return () => clearInterval(interval);
//     }
//   }, [user?.email, userData?.role, fetchNotifications]);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchNotifications();
//     setRefreshing(false);
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Get notified on activities within Acctbazaar
//         </p>
//         <div className="flex items-center justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
//           <p className="text-sm text-gray-500">
//             Get notified on activities within Acctbazaar
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           disabled={refreshing}
//           className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
//             refreshing
//               ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
//               : 'text-white hover:opacity-90'
//           }`}
//           style={!refreshing ? { backgroundColor: '#d4a643' } : {}}
//         >
//           <svg
//             className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//             />
//           </svg>
//           {refreshing ? 'Refreshing...' : 'Refresh'}
//         </button>
//       </div>

//       {notifications.length > 0 ? (
//         <div className="space-y-3 max-h-[600px] overflow-y-auto pr-3">
//           {notifications.map((notification, idx) => (
//             <div
//               key={notification._id || idx}
//               className={`p-5 rounded-xl border-l-4 hover:shadow-lg transition-all ${
//                 notification.read
//                   ? 'bg-gray-50 border-l-gray-300'
//                   : 'bg-blue-50 border-l-blue-600'
//               }`}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-2">
//                     <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
//                     {!notification.read && (
//                       <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-700 mb-3 leading-relaxed">
//                     {notification.message || notification.description || 'No description'}
//                   </p>
//                   <p className="text-[12px] text-gray-500 font-medium">
//                     {notification.createdAt
//                       ? new Date(notification.createdAt).toLocaleString()
//                       : 'Date not available'}
//                   </p>
//                 </div>
//                 {notification.type && (
//                   <span
//                     className="px-3 py-1 rounded-full text-[11px] font-bold uppercase whitespace-nowrap"
//                     style={{
//                       backgroundColor:
//                         notification.type === 'warning'
//                           ? '#FEF3C7'
//                           : notification.type === 'alert'
//                           ? '#FEE2E2'
//                           : '#DBEAFE',
//                       color:
//                         notification.type === 'warning'
//                           ? '#92400E'
//                           : notification.type === 'alert'
//                           ? '#991B1B'
//                           : '#1E40AF',
//                     }}
//                   >
//                     {notification.type}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <Bell size={48} className="mx-auto text-gray-200 mb-4" />
//           <p className="text-gray-400 font-semibold">No notifications</p>
//           <p className="text-sm text-gray-300 mt-2">You're all set! No new notifications at this time.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountSettings;


// import React, { useState, useEffect, useCallback } from 'react';
// import { Eye, EyeOff, Calendar, User, Lock, Bell, Package } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useAuthHook } from '../hook/useAuthHook';
// import { getAllNotifications } from './Notification/Notification';
// import ListingsManagement from './Listings/ListingsManagement';
// import axios from 'axios';
// import { toast } from 'sonner';

// const AccountSettings = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const { data: userData } = useAuthHook();

//   const tabs = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'security', label: 'Security', icon: Lock },
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     ...(userData?.role === 'seller' || userData?.role === 'admin'
//       ? [{ id: 'listings', label: 'Listings', icon: Package }]
//       : []),
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
//           <p className="mt-2 text-gray-600">
//             Manage your profile, security and notification preferences
//           </p>

//           <div className="mt-6 flex flex-wrap gap-2">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`
//                     flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all
//                     ${isActive
//                       ? 'text-white shadow-sm'
//                       : 'text-gray-700 bg-white border border-gray-300 hover:text-gray-900'
//                     }
//                   `}
//                   style={isActive ? { backgroundColor: '#d4a643' } : {}}
//                 >
//                   <Icon size={16} />
//                   {tab.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="space-y-14">
//           {activeTab === 'profile' && <ProfileSection />}
//           {activeTab === 'security' && <SecuritySection />}
//           {activeTab === 'notifications' && <NotificationsSection />}
//           {activeTab === 'listings' && <ListingsManagement />}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProfileSection = () => (
//   <div className="space-y-14">
//     {/* Personal Information */}
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//       <h2 className="text-xl font-semibold text-gray-900 mb-1">Personal Information</h2>
//       <p className="text-sm text-gray-500 mb-6">
//         Make adjustments to your personal information and save them.
//       </p>

//       <div className="space-y-6 max-w-2xl">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//           <input
//             type="text"
//             defaultValue="Legityankeelogshub"
//             className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//           />
//           <p className="mt-1.5 text-xs text-gray-500">
//             You can update your name after 7 days
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             defaultValue="tajudeentoyeeb095@gmail.com"
//             className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
//           <div className="flex rounded-lg border border-gray-300 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 overflow-hidden">
//             <span className="inline-flex items-center bg-gray-100 px-4 text-gray-600 text-lg">
//               🇳🇬
//             </span>
//             <input
//               type="tel"
//               defaultValue="+234 903 433 538 9"
//               className="flex-1 px-4 py-3 bg-white outline-none"
//             />
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Avatar */}
//     {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//       <h2 className="text-xl font-semibold text-gray-900 mb-1">Avatar</h2>
//       <p className="text-sm text-gray-500 mb-6">Select a nice picture of yourself.</p>

//       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
//         <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden">
//           <div className="bg-gray-700 p-2.5 rounded-full">
//             <Camera className="w-6 h-6 text-white" />
//           </div>
//         </div>

//         <div className="flex-1">
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-orange-400 transition-colors cursor-pointer">
//             <div className="mx-auto bg-gray-50 p-3 rounded-full w-fit mb-3">
//               <Camera className="w-6 h-6 text-gray-400" />
//             </div>
//             <p className="text-sm">
//               <span className="text-orange-600 font-medium">Click to replace</span> or drag and drop
//             </p>
//             <p className="text-xs text-gray-500 mt-2">
//               SVG, PNG, JPG or GIF (max 800 x 400px)
//             </p>
//           </div>
//         </div>
//       </div>
//     </div> */}

//     {/* Additional Information */}
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//       <h2 className="text-xl font-semibold text-gray-900 mb-1">Additional Information</h2>
//       <p className="text-sm text-gray-500 mb-6">Verify your identity</p>

//       <div className="space-y-6 max-w-2xl">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//             <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
//               <option>Nigeria</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//             <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
//               <option>OS</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//           <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
//             <option>Osogbo</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">User address</label>
//           <input
//             type="text"
//             defaultValue="Second gate uniosun sogbo area"
//             className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//           />
//         </div>

//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//           <div className="relative">
//             <input
//               type="text"
//               defaultValue="07-07-2000"
//               className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//             />
//             <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//           </div>
//         </div>

//         <div className="flex justify-end pt-4">
//           <button className="text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm" style={{ backgroundColor: '#d4a643' }} onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c4952f'} onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d4a643'}>
//             Save & Proceed
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const SecuritySection = () => {
//   const { user } = useAuth();
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Password validation function
//   const validatePassword = (password: string) => {
//     if (password.length < 3 || password.length > 30) {
//       toast.error("❌ Password must be between 3 and 30 characters.");
//       return false;
//     }

//     const passwordRegex = /^[a-z0-9!@#$%^&*()_+\-={};"':,.<>|?\\[\]]*$/;
//     if (!passwordRegex.test(password)) {
//       toast.error("❌ Password can only contain lowercase letters, numbers, and symbols.");
//       return false;
//     }

//     const hasLowercase = /[a-z]/.test(password);
//     const hasNumber = /[0-9]/.test(password);
//     const hasSymbol = /[!@#$%^&*()_+\-={};"':,.<>|?\\[\]]/.test(password);

//     if (!hasLowercase || !hasNumber || !hasSymbol) {
//       toast.error("❌ Password must contain lowercase letters, numbers, and symbols together!");
//       return false;
//     }

//     return true;
//   };

//   const handleUpdatePassword = async () => {
//     // Validation
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       toast.error("❌ All fields are required!");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("❌ New passwords do not match!");
//       return;
//     }

//     if (currentPassword === newPassword) {
//       toast.error("❌ New password must be different from current password!");
//       return;
//     }

//     if (!validatePassword(newPassword)) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.put(
//         `https://vps-backend-server-beta.vercel.app/api/user/update-password`,
//         {
//           email: user?.email,
//           currentPassword,
//           newPassword,
//         }
//       );

//       if ((response.data as any).success || response.status === 200) {
//         toast.success("✅ Password updated successfully!");
//         setCurrentPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//       } else {
//         toast.error((response.data as any).message || "❌ Failed to update password!");
//       }
//     } catch (err: any) {
//       console.error("Update password error:", err);
//       if (err.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else if (err.response?.status === 401) {
//         toast.error("❌ Current password is incorrect!");
//       } else {
//         toast.error("❌ Failed to update password. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//   };

//   return (
//     <div className="space-y-14">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-1">Password</h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Please enter your current password to change your password.
//         </p>

//         <div className="space-y-5 max-w-xl">
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//             <div className="relative">
//               <input
//                 type={showCurrentPassword ? "text" : "password"}
//                 placeholder="Current Password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//             <div className="relative">
//               <input
//                 type={showNewPassword ? "text" : "password"}
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
//             <li>Minimum length of 3-30 characters</li>
//             <li>Must contain lowercase, numbers, and symbols together</li>
//           </ul>

//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-end gap-4 pt-4">
//             <button
//               type="button"
//               onClick={handleCancel}
//               disabled={loading}
//               className="px-8 py-2.5 border rounded-lg transition font-medium hover:bg-gray-50 disabled:opacity-50"
//               style={{ borderColor: '#d4a643', color: '#d4a643' }}
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleUpdatePassword}
//               disabled={loading}
//               className="px-8 py-2.5 text-white rounded-lg transition font-medium disabled:opacity-50"
//               style={{ backgroundColor: '#d4a643' }}
//               onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#c4952f')}
//               onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#d4a643')}
//             >
//               {loading ? 'Updating...' : 'Update password'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const NotificationsSection = () => {
//   const { user } = useAuth();
//   const { data: userData } = useAuthHook();
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchNotifications = useCallback(async () => {
//     try {
//       const res = await getAllNotifications();
//       const userRole = userData?.role;

//       const myNotifs = Array.isArray(res)
//         ? res.filter((n: any) => {
//             const isDirect = n.userEmail === user?.email;
//             const isAll = n.target === "all";
//             const isRoleMatch = userRole && n.target === `${userRole}s`;
//             return isDirect || isAll || isRoleMatch;
//           })
//         : [];

//       const sortedNotifs = myNotifs.sort(
//         (a: any, b: any) =>
//           new Date(b.createdAt || 0).getTime() -
//           new Date(a.createdAt || 0).getTime()
//       );

//       setNotifications(sortedNotifs);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     }
//   }, [user?.email, userData?.role]);

//   useEffect(() => {
//     const loadNotifications = async () => {
//       setLoading(true);
//       await fetchNotifications();
//       setLoading(false);
//     };

//     if (user?.email) {
//       loadNotifications();
//       const interval = setInterval(async () => {
//         await fetchNotifications();
//       }, 8000);
//       return () => clearInterval(interval);
//     }
//   }, [user?.email, userData?.role, fetchNotifications]);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchNotifications();
//     setRefreshing(false);
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Get notified on activities within Acctbazaar
//         </p>
//         <div className="flex items-center justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
//           <p className="text-sm text-gray-500">
//             Get notified on activities within Acctbazaar
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           disabled={refreshing}
//           className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
//             refreshing
//               ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
//               : 'text-white hover:opacity-90'
//           }`}
//           style={!refreshing ? { backgroundColor: '#d4a643' } : {}}
//         >
//           <svg
//             className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//             />
//           </svg>
//           {refreshing ? 'Refreshing...' : 'Refresh'}
//         </button>
//       </div>

//       {notifications.length > 0 ? (
//         <div className="space-y-3 max-h-[600px] overflow-y-auto pr-3">
//           {notifications.map((notification, idx) => (
//             <div
//               key={notification._id || idx}
//               className={`p-5 rounded-xl border-l-4 hover:shadow-lg transition-all ${
//                 notification.read
//                   ? 'bg-gray-50 border-l-gray-300'
//                   : 'bg-blue-50 border-l-blue-600'
//               }`}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-2">
//                     <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
//                     {!notification.read && (
//                       <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-700 mb-3 leading-relaxed">
//                     {notification.message || notification.description || 'No description'}
//                   </p>
//                   <p className="text-[12px] text-gray-500 font-medium">
//                     {notification.createdAt
//                       ? new Date(notification.createdAt).toLocaleString()
//                       : 'Date not available'}
//                   </p>
//                 </div>
//                 {notification.type && (
//                   <span
//                     className="px-3 py-1 rounded-full text-[11px] font-bold uppercase whitespace-nowrap"
//                     style={{
//                       backgroundColor:
//                         notification.type === 'warning'
//                           ? '#FEF3C7'
//                           : notification.type === 'alert'
//                           ? '#FEE2E2'
//                           : '#DBEAFE',
//                       color:
//                         notification.type === 'warning'
//                           ? '#92400E'
//                           : notification.type === 'alert'
//                           ? '#991B1B'
//                           : '#1E40AF',
//                     }}
//                   >
//                     {notification.type}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <Bell size={48} className="mx-auto text-gray-200 mb-4" />
//           <p className="text-gray-400 font-semibold">No notifications</p>
//           <p className="text-sm text-gray-300 mt-2">You're all set! No new notifications at this time.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountSettings;





import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, User, Lock, Bell, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthHook } from '../hook/useAuthHook';
import { getAllNotifications } from './Notification/Notification';
import ListingsManagement from './Listings/ListingsManagement';
import axios from 'axios';
import { toast } from 'sonner';
import countryCodes from '../assets/Country/CountryCodes.json';
import countryFlags from '../assets/Country/country-flag.json';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { data: userData } = useAuthHook();

  // Check if user is seller or admin
  const isSellerOrAdmin = userData?.role === 'seller' || userData?.role === 'admin';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(isSellerOrAdmin ? [{ id: 'listings', label: 'My Listings', icon: Package }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-6 sm:px-4 md:py-8 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
            Manage your profile, security and notification preferences
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-full transition-all whitespace-nowrap flex-shrink-0
                    ${isActive
                      ? 'text-white shadow-sm'
                      : 'text-gray-700 bg-white border border-gray-300 hover:text-gray-900'
                    }
                  `}
                  style={isActive ? { backgroundColor: '#d4a643' } : {}}
                >
                  <Icon size={16} className="hidden sm:inline" />
                  <Icon size={14} className="sm:hidden" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-14">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'listings' && <ListingsManagement />}
        </div>
      </div>
    </div>
  );
};

const ProfileSection = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all users and find the current user by email
        const response = await axios.get<any>(`http://localhost:3200/api/user/getall`);
        const allUsers = (response.data as any);
        
        // Find user by email
        const currentUser = Array.isArray(allUsers) 
          ? allUsers.find((u: any) => u.email === user.email)
          : null;

        if (currentUser) {
          setProfileData(currentUser);
          const countryData = countryCodes.find(
            (c: any) => c.name.toLowerCase() === (currentUser?.country || 'Nigeria').toLowerCase()
          );
          setSelectedCountry(countryData || countryCodes[0]);
          setFormData({
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
            country: currentUser?.country || 'Nigeria',
            state: currentUser?.state || '',
            city: currentUser?.city || '',
            address: currentUser?.address || '',
            dob: currentUser?.dob || '',
          });
        } else {
          toast.error('User profile not found');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        console.log('Error details:', (error as any).response?.data);
        console.log('Error status:', (error as any).response?.status);
        toast.error('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.email]);

  const handleSave = async () => {
    if (!user?.email) {
      toast.error('User email not found');
      return;
    }

    try {
      setSaving(true);
      
      // Track changes for each field
      const fieldsToTrack = ['phone', 'country', 'state', 'city', 'address', 'dob'];
      const changes = [];

      for (const field of fieldsToTrack) {
        // Use empty string as default for comparison if profileData is null
        const oldValue = profileData?.[field] ?? '';
        const newValue = formData[field] ?? '';
        
        if (oldValue !== newValue) {
          changes.push({
            userEmail: user.email,
            fieldName: field,
            oldValue: oldValue || null,
            newValue: newValue || null,
            changeType: 'update'
          });
        }
      }

      // Update user profile in the userCollection
      const response = await axios.put<any>(`http://localhost:3200/api/user/update-profile`, {
        email: user.email,
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        dob: formData.dob,
      });

      if ((response.data as any)?.success || response.status === 200) {
        // Log all changes to admin dashboard
        if (changes.length > 0) {
          try {
            for (const change of changes) {
              await axios.post(
                `http://localhost:3200/api/user/log-change`,
                change
              );
              console.log('Logged change:', change);
            }
          } catch (logError) {
            console.error('Failed to log changes:', logError);
            // Don't fail the update if logging fails
          }
        }

        setProfileData(formData);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-14">
      {/* Personal Information */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Personal Information</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          View your personal information from our database.
        </p>

        <div className="space-y-4 sm:space-y-6 w-full max-w-2xl">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              disabled
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
            />
            <p className="mt-1 sm:mt-1.5 text-xs text-gray-500">Name cannot be changed</p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              disabled
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
            />
            <p className="mt-1 sm:mt-1.5 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <div className="flex gap-2">
              <div className="relative w-32 sm:w-40">
                <button
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm flex items-center justify-between bg-white hover:bg-gray-50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <div className="flex items-center gap-2">
                    {selectedCountry && (
                      <img
                        src={countryFlags.find((f: any) => f.code === selectedCountry.code.toLowerCase())?.flag}
                        alt={selectedCountry.name}
                        className="w-5 h-3 sm:w-6 sm:h-4 object-cover rounded"
                      />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {selectedCountry?.dial_code || '+1'}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                {showCountryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {countryCodes.map((country: any) => {
                      const flagData = countryFlags.find((f: any) => f.code === country.code.toLowerCase());
                      return (
                        <button
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm flex items-center gap-2 hover:bg-orange-50 border-b border-gray-100 last:border-b-0"
                        >
                          <img
                            src={flagData?.flag}
                            alt={country.name}
                            className="w-5 h-3 sm:w-6 sm:h-4 object-cover rounded"
                          />
                          <span className="flex-1">{country.name}</span>
                          <span className="text-gray-600 font-medium text-xs">{country.dial_code}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="flex-1 rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Additional Information</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Update your identity information</p>

        <div className="space-y-4 sm:space-y-6 w-full max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter country"
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter state"
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Enter city"
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">User address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your address"
              className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                placeholder="DD-MM-YYYY"
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 sm:pt-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition shadow-sm text-sm sm:text-base disabled:opacity-50" 
              style={{ backgroundColor: '#d4a643' }} 
              onMouseEnter={(e) => !saving && ((e.target as HTMLButtonElement).style.backgroundColor = '#c4952f')}
              onMouseLeave={(e) => !saving && ((e.target as HTMLButtonElement).style.backgroundColor = '#d4a643')}
            >
              {saving ? 'Saving...' : 'Save & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecuritySection = () => {
  const { user, logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation function
  const validatePassword = (password: string) => {
    if (password.length < 3 || password.length > 30) {
      toast.error("❌ Password must be between 3 and 30 characters.");
      return false;
    }

    const passwordRegex = /^[a-z0-9!@#$%^&*()_+\-={};"':,.<>|?\\[\]]*$/;
    if (!passwordRegex.test(password)) {
      toast.error("❌ Password can only contain lowercase letters, numbers, and symbols.");
      return false;
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-={};"':,.<>|?\\[\]]/.test(password);

    if (!hasLowercase || !hasNumber || !hasSymbol) {
      toast.error("❌ Password must contain lowercase letters, numbers, and symbols together!");
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("❌ All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("❌ New passwords do not match!");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("❌ New password must be different from current password!");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `https://vps-backend-server-beta.vercel.app/api/user/update-password`,
        {
          email: user?.email,
          currentPassword,
          newPassword,
        }
      );

      if ((response.data as any).success || response.status === 200) {
        // Log the password change to admin dashboard
        try {
          await axios.post(
            `http://localhost:3200/api/user/log-change`,
            {
              userEmail: user?.email,
              fieldName: 'password',
              oldValue: '***hidden***',
              newValue: '***hidden***',
              changeType: 'update'
            }
          );
        } catch (logError) {
          console.error('Failed to log password change:', logError);
        }

        toast.success("✅ Password updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Auto logout after 2 seconds and redirect to login
        setTimeout(() => {
          logout();
          window.location.href = "/login";
        }, 2000);
      } else {
        toast.error((response.data as any).message || "❌ Failed to update password!");
      }
    } catch (err: any) {
      console.error("Update password error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.status === 401) {
        toast.error("❌ Current password is incorrect!");
      } else {
        toast.error("❌ Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-14">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Password</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          Please enter your current password to change your password.
        </p>

        <div className="space-y-4 sm:space-y-5 w-full max-w-xl">
          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <ul className="text-xs text-gray-500 list-disc pl-4 sm:pl-5 space-y-1">
            <li>Minimum length of 3-30 characters</li>
            <li>Must contain lowercase, numbers, and symbols together</li>
          </ul>

          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 sm:px-8 py-2 sm:py-2.5 border rounded-lg transition font-medium text-sm sm:text-base hover:bg-gray-50 disabled:opacity-50 min-h-10 sm:min-h-auto"
              style={{ borderColor: '#d4a643', color: '#d4a643' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={loading}
              className="px-4 sm:px-8 py-2 sm:py-2.5 text-white rounded-lg transition font-medium text-sm sm:text-base disabled:opacity-50 min-h-10 sm:min-h-auto"
              style={{ backgroundColor: '#d4a643' }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#c4952f')}
              onMouseLeave={(e) => !loading && ((e.target as HTMLButtonElement).style.backgroundColor = '#d4a643')}
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsSection = () => {
  const { user } = useAuth();
  const { data: userData } = useAuthHook();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getAllNotifications();
      const userRole = userData?.role;

      const myNotifs = Array.isArray(res)
        ? res.filter((n: any) => {
            const isDirect = n.userEmail === user?.email;
            const isAll = n.target === "all";
            const isRoleMatch = userRole && n.target === `${userRole}s`;
            return isDirect || isAll || isRoleMatch;
          })
        : [];

      const sortedNotifs = myNotifs.sort(
        (a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );

      setNotifications(sortedNotifs);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [user?.email, userData?.role]);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    };

    if (user?.email) {
      loadNotifications();
      const interval = setInterval(async () => {
        await fetchNotifications();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [user?.email, userData?.role, fetchNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
          Get notified on activities within Acctbazaar
        </p>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Get notified on activities within Acctbazaar
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0 min-h-10 sm:min-h-auto ${
            refreshing
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : 'text-white hover:opacity-90'
          }`}
          style={!refreshing ? { backgroundColor: '#d4a643' } : {}}
        >
          <svg
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          <span className="sm:hidden">{refreshing ? '...' : 'Refresh'}</span>
        </button>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-2 sm:space-y-3 max-h-[600px] overflow-y-auto pr-0 sm:pr-3">
          {notifications.map((notification, idx) => (
            <div
              key={notification._id || idx}
              className={`p-3 sm:p-5 rounded-lg sm:rounded-xl border-l-4 hover:shadow-lg transition-all ${
                notification.read
                  ? 'bg-gray-50 border-l-gray-300'
                  : 'bg-blue-50 border-l-blue-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">{notification.title}</p>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 leading-relaxed break-words">
                    {notification.message || notification.description || 'No description'}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-gray-500 font-medium">
                    {notification.createdAt
                      ? new Date(notification.createdAt).toLocaleString()
                      : 'Date not available'}
                  </p>
                </div>
                {notification.type && (
                  <span
                    className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase whitespace-nowrap flex-shrink-0"
                    style={{
                      backgroundColor:
                        notification.type === 'warning'
                          ? '#FEF3C7'
                          : notification.type === 'alert'
                          ? '#FEE2E2'
                          : '#DBEAFE',
                      color:
                        notification.type === 'warning'
                          ? '#92400E'
                          : notification.type === 'alert'
                          ? '#991B1B'
                          : '#1E40AF',
                    }}
                  >
                    {notification.type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <Bell size={40} className="mx-auto text-gray-200 mb-3 sm:mb-4 sm:w-12 sm:h-12" />
          <p className="text-sm sm:text-base text-gray-400 font-semibold">No notifications</p>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 sm:mt-2">You're all set! No new notifications at this time.</p>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;