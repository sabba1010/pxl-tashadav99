// import {
//   Autocomplete,
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   FormControlLabel,
//   InputAdornment,
//   Paper,
//   Radio,
//   RadioGroup,
//   Step,
//   StepLabel,
//   Stepper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { useAuthHook } from "../../hook/useAuthHook";

// interface Platform {
//   _id: string;
//   id: number;
//   name: string;
//   link: string;
// }

// interface FormData {
//   category: string;
//   categoryIcon: string;
//   name: string;
//   description: string;
//   price: string;
//   username: string;
//   accountPass: string;
//   previewLink: string;
//   email: string;
//   password: string;
//   additionalInfo: string;
//   userEmail: string;
//   userRole: string;
//   status: string;
//   createdAt: Date;
//   userAccountName: string;
// }

// interface SavedAccount extends FormData {
//   id: string;
//   savedAt: number;
// }

// const SellForm: React.FC = () => {
//   const [step, setStep] = useState(0);
//   const navigate = useNavigate();
//   const { data } = useAuthHook();
//   const user = data;
//   console.log(user?.name);

//   // --- Block logic start ---
//   const isBlocked = (user as any)?.status === "blocked";
//   // --- Block logic end ---

//   const [platforms, setPlatforms] = useState<Platform[]>([]);
//   const [loadingPlatforms, setLoadingPlatforms] = useState(true);

//   // Sales Credit State
//   const [salesCredit, setSalesCredit] = useState<number | null>(null);
//   const [loadingCredit, setLoadingCredit] = useState(true);
//   const [hasNoCredit, setHasNoCredit] = useState(false);

//   // Modal states
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);
//   const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string | null>(null);
//   const [customDeliveryTime, setCustomDeliveryTime] = useState("");
//   const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
//     const saved = localStorage.getItem("sellformSavedAccounts");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [formData, setFormData] = useState<FormData>({
//     category: "",
//     categoryIcon: "",
//     name: "",
//     description: "",
//     price: "",
//     username: "",
//     accountPass: "",
//     previewLink: "",
//     email: "",
//     password: "",
//     additionalInfo: "",
//     userEmail: `${user?.email}`,
//     userRole: user?.role || "",
//     status: "pending",
//     createdAt: new Date(),
//     userAccountName: `${user?.name}` || "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Fetch Platforms
//   useEffect(() => {
//     const fetchPlatforms = async () => {
//       try {
//         const response = await axios.get<{ data: Platform[] }>(
//           "http://localhost:3200/icon-data"
//         );
//         const data = Array.isArray(response.data)
//           ? response.data
//           : (response as any).data.data || [];
//         setPlatforms(data);
//       } catch (error) {
//         toast.error("Failed to load platforms.");
//         console.error(error);
//       } finally {
//         setLoadingPlatforms(false);
//       }
//     };

//     fetchPlatforms();
//   }, []);

//   // Fetch User's Sales Credit
//   useEffect(() => {
//     const fetchSalesCredit = async () => {
//       if (!user?.email) {
//         setLoadingCredit(false);
//         return;
//       }

//       try {
//         const response = await axios.get<{ salesCredit: number }>(
//           `http://localhost:3200/product/credit?email=${encodeURIComponent(
//             user.email
//           )}`
//         );
//         const credit = response.data.salesCredit ?? 0;
//         setSalesCredit(credit);
//         setHasNoCredit(credit <= 0);
//       } catch (error: any) {
//         toast.error("Failed to load listing credits.");
//         console.error(error);
//         setHasNoCredit(true);
//       } finally {
//         setLoadingCredit(false);
//       }
//     };

//     fetchSalesCredit();
//   }, [user?.email]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleCategoryChange = (_: any, value: Platform | null) => {
//     if (value) {
//       setFormData({
//         ...formData,
//         category: value.name,
//         categoryIcon: value.link,
//       });
//       setErrors({ ...errors, category: "" });
//     } else {
//       setFormData({ ...formData, category: "", categoryIcon: "" });
//     }
//   };

//   // Validation Step 0
//   const validateStep0 = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.category) newErrors.category = "Platform is required";
//     if (!formData.name.trim()) newErrors.name = "Account name is required";
//     if (!formData.description.trim())
//       newErrors.description = "Description is required";
//     if (!formData.price || Number(formData.price) <= 0)
//       newErrors.price = "Valid price is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Validation Step 1
//   const validateStep1 = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.username.trim()) newErrors.username = "Username is required";
//     if (!formData.accountPass)
//       newErrors.accountPass = "Account password is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handler to save account and clear form
//   const handleAddAccount = () => {
//     if (!validateStep1()) return;

//     const newSavedAccount: SavedAccount = {
//       ...formData,
//       id: Date.now().toString(),
//       savedAt: Date.now(),
//     };

//     const updatedAccounts = [...savedAccounts, newSavedAccount];
//     setSavedAccounts(updatedAccounts);
//     localStorage.setItem("sellformSavedAccounts", JSON.stringify(updatedAccounts));

//     // Clear the form
//     setFormData({
//       category: "",
//       categoryIcon: "",
//       name: "",
//       description: "",
//       price: "",
//       username: "",
//       accountPass: "",
//       previewLink: "",
//       email: "",
//       password: "",
//       additionalInfo: "",
//       userEmail: `${user?.email}`,
//       userRole: user?.role || "",
//       status: "pending",
//       createdAt: new Date(),
//       userAccountName: `${user?.name}` || "",
//     });

//     toast.success("Account details saved! You can add another one.");
//   };

//   const handleRemoveAccount = (id: string) => {
//     const updatedAccounts = savedAccounts.filter((acc) => acc.id !== id);
//     setSavedAccounts(updatedAccounts);
//     localStorage.setItem("sellformSavedAccounts", JSON.stringify(updatedAccounts));
//     toast.success("Account removed from the list.");
//   };

//   const nextStep = () => {
//     // Block check
//     if (isBlocked) {
//       toast.error("You are blocked and cannot perform this action.");
//       return;
//     }

//     if (step === 0 && validateStep0()) {
//       setStep(step + 1);
//     } else if (step === 1 && validateStep1()) {
//       if (loadingCredit) {
//         toast.info("Loading your credits...");
//         return;
//       }
//       if (hasNoCredit) {
//         toast.error(
//           "You have no listing credits left. Purchase more to list an account."
//         );
//         return;
//       }
//       handleSubmit();
//     }
//   };

//   const prevStep = () => setStep(step - 1);

//   const handleSubmit = async () => {
//     if (!validateStep1() || isBlocked) return;

//     try {
//       const response = await axios.post(
//         "http://localhost:3200/product/sell",
//         formData
//       );

//       if (response.status === 201 || response.status === 200) {
//         toast.success("Your account has been listed successfully!");

//         // Update local credit count
//         if (salesCredit !== null && salesCredit > 0) {
//           const newCredit = salesCredit - 1;
//           setSalesCredit(newCredit);
//           setHasNoCredit(newCredit <= 0);
//         }

//         navigate("/myproducts");
//       }
//     } catch (error: any) {
//       const msg =
//         error.response?.data?.message || "Failed to list account. Try again.";
//       toast.error(msg);
//       console.error(error);
//     }
//   };

//   const steps = ["Account Details", "Access Information"];

//   const getSelectedPlatform = () => {
//     return platforms.find((p) => p.name === formData.category) || null;
//   };

//   const renderCreditBanner = () => {
//     // Render block message if blocked
//     if (isBlocked) {
//       return (
//         <Box sx={{ bgcolor: "#fee2e2", color: "#b91c1c", p: 3, borderRadius: 2, mb: 4, textAlign: "center", border: "1px solid #fca5a5" }}>
//           <Typography variant="h6" fontWeight="bold">🚫 Account Restricted</Typography>
//           <Typography variant="body2">Your account is currently blocked from selling. Please contact support.</Typography>
//         </Box>
//       );
//     }

//     if (loadingCredit) {
//       return (
//         <Box sx={{ textAlign: "center", py: 2 }}>
//           <CircularProgress size={24} />
//           <Typography variant="body2" ml={1} component="span">
//             Loading credits...
//           </Typography>
//         </Box>
//       );
//     }

//     if (hasNoCredit) {
//       return (
//         <Box
//           sx={{
//             bgcolor: "error.light",
//             color: "error.contrastText",
//             p: 3,
//             borderRadius: 2,
//             mb: 4,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold">
//             ⚠️ No Listing Credits Available
//           </Typography>
//           <Typography variant="body1" mt={1}>
//             You currently have 0 credits. You cannot list new accounts until you
//             purchase more listing credits.
//           </Typography>
//         </Box>
//       );
//     }

//     return (
//       <Box
//         sx={{
//           bgcolor: "success.light",
//           color: "success.contrastText",
//           p: 2,
//           borderRadius: 2,
//           mb: 4,
//           textAlign: "center",
//         }}
//       >
//         <Typography variant="body1">
//           <strong>Remaining Listing Credits: {salesCredit}</strong>
//         </Typography>
//         <Typography variant="body2" mt={0.5}>
//           Each new listing consumes 1 credit.
//         </Typography>
//       </Box>
//     );
//   };

//   const getStepContent = (stepIndex: number) => {
//     switch (stepIndex) {
//       case 0:
//         return (
//           <>
//             <Typography variant="h5" fontWeight="600" gutterBottom>
//               Tell us about the account you're selling
//             </Typography>
//             <Typography variant="body1" color="text.secondary" mb={4}>
//               Provide clear and accurate details to attract buyers faster.
//             </Typography>

//             <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               <Autocomplete
//                 options={platforms}
//                 getOptionLabel={(option) => option.name}
//                 value={getSelectedPlatform()}
//                 onChange={handleCategoryChange}
//                 loading={loadingPlatforms}
//                 disableClearable={!!formData.category}
//                 renderOption={(props, option) => (
//                   <Box
//                     component="li"
//                     {...props}
//                     sx={{ display: "flex", alignItems: "center", gap: 2 }}
//                   >
//                     <img
//                       src={option.link}
//                       alt={option.name}
//                       width={32}
//                       height={32}
//                       style={{ objectFit: "contain" }}
//                     />
//                     <Typography>{option.name}</Typography>
//                   </Box>
//                 )}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Platform / Category"
//                     required
//                     error={!!errors.category}
//                     helperText={errors.category}
//                     InputProps={{
//                       ...params.InputProps,
//                       startAdornment: formData.categoryIcon ? (
//                         <InputAdornment position="start">
//                           <img
//                             src={formData.categoryIcon}
//                             alt={formData.category}
//                             width={32}
//                             height={32}
//                             style={{ objectFit: "contain" }}
//                           />
//                         </InputAdornment>
//                       ) : null,
//                       endAdornment: (
//                         <>
//                           {loadingPlatforms && (
//                             <CircularProgress color="inherit" size={20} />
//                           )}
//                           {params.InputProps.endAdornment}
//                         </>
//                       ),
//                     }}
//                   />
//                 )}
//               />

//               <TextField
//                 fullWidth
//                 label="Account Title"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 error={!!errors.name}
//                 helperText={
//                   errors.name || "e.g., Gaming Instagram with 50K Followers"
//                 }
//               />

//               <TextField
//                 fullWidth
//                 label="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 multiline
//                 rows={5}
//                 required
//                 error={!!errors.description}
//                 helperText={
//                   errors.description ||
//                   "Include followers, niche, engagement rate, revenue, etc."
//                 }
//               />

//               <TextField
//                 fullWidth
//                 label="Price"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 type="number"
//                 required
//                 error={!!errors.price}
//                 helperText={errors.price}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">$</InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">USD</InputAdornment>
//                   ),
//                 }}
//               />

//               {/* Release Options Section */}
//               <Divider sx={{ my: 3 }} />
//               <Box>
//                 <Typography variant="h6" fontWeight="600" gutterBottom>
//                   Release Options
//                 </Typography>

//                 <RadioGroup
//                   value={deliveryMethod}
//                   onChange={(e) => setDeliveryMethod(e.target.value)}
//                 >
//                   {/* Auto Confirm Order */}
//                   <FormControlLabel
//                     value="automated"
//                     control={<Radio />}
//                     label={
//                       <Box sx={{ ml: 1 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                           <Typography variant="subtitle1" fontWeight="600">
//                             Auto Confirm Order
//                           </Typography>
//                           <Typography
//                             sx={{
//                               bgcolor: "#d1fae5",
//                               color: "#047857",
//                               px: 1.5,
//                               py: 0.5,
//                               borderRadius: 1,
//                               fontSize: "0.75rem",
//                               fontWeight: 600,
//                             }}
//                           >
//                             Recommended
//                           </Typography>
//                         </Box>
//                         <Typography
//                           variant="body2"
//                           color="#d97706"
//                           sx={{ mt: 0.5 }}
//                         >
//                           Perfect for products that don't need your attention.
//                           Logins are sent and the order is confirmed automatically —
//                           no action required.
//                         </Typography>
//                       </Box>
//                     }
//                     sx={{
//                       p: 2.5,
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 2,
//                       mb: 2,
//                       alignItems: "flex-start",
//                       "&:hover": {
//                         bgcolor: "#fafafa",
//                       },
//                     }}
//                   />

//                   {/* Manual Release */}
//                   <FormControlLabel
//                     value="manual"
//                     control={<Radio />}
//                     label={
//                       <Box sx={{ ml: 1 }}>
//                         <Typography variant="subtitle1" fontWeight="600">
//                           Manual Release
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           color="#d97706"
//                           sx={{ mt: 0.5 }}
//                         >
//                           Ideal for products that need your input - like those
//                           requiring a code or extra authentication before access.
//                           You'll manually send login details and confirm orders
//                           after each sale.
//                         </Typography>
//                       </Box>
//                     }
//                     sx={{
//                       p: 2.5,
//                       border:
//                         deliveryMethod === "manual"
//                           ? "2px solid #f97316"
//                           : "1px solid #e5e7eb",
//                       borderRadius: 2,
//                       mb: 2,
//                       alignItems: "flex-start",
//                       bgcolor:
//                         deliveryMethod === "manual" ? "#fef3c7" : "transparent",
//                       "&:hover": {
//                         bgcolor:
//                           deliveryMethod === "manual" ? "#fef3c7" : "#fafafa",
//                       },
//                     }}
//                   />
//                 </RadioGroup>

//                 {/* Show delivery time options when Manual is selected */}
//                 {deliveryMethod === "manual" && (
//                   <Box
//                     sx={{
//                       p: 3,
//                       bgcolor: "#fffbeb",
//                       borderRadius: 2,
//                       border: "1px solid #fcd34d",
//                       mt: 3,
//                     }}
//                   >
//                     <Typography variant="subtitle2" fontWeight="600" mb={2}>
//                       Expected Delivery Time
//                     </Typography>
//                     <Typography variant="caption" color="#6b7280" display="block" mb={2}>
//                       Delivery time
//                     </Typography>
//                     <Box
//                       sx={{
//                         display: "grid",
//                         gridTemplateColumns: {
//                           xs: "repeat(2, 1fr)",
//                           sm: "repeat(5, 1fr)",
//                         },
//                         gap: 1.5,
//                         mb: 3,
//                       }}
//                     >
//                       {["5 mins", "10 mins", "15 mins", "30 mins"].map((time) => (
//                         <Button
//                           key={time}
//                           onClick={() => {
//                             setSelectedDeliveryTime(time);
//                             setCustomDeliveryTime("");
//                           }}
//                           variant={selectedDeliveryTime === time ? "contained" : "outlined"}
//                           fullWidth
//                           sx={{
//                             py: 1,
//                             px: 1,
//                             borderRadius: 2,
//                             textTransform: "none",
//                             fontSize: "0.9rem",
//                             fontWeight: 500,
//                             borderColor: "#06b6d4",
//                             color: selectedDeliveryTime === time ? "white" : "#06b6d4",
//                             bgcolor: selectedDeliveryTime === time ? "#06b6d4" : "transparent",
//                             "&:hover": {
//                               borderColor: "#0891b2",
//                               bgcolor: selectedDeliveryTime === time ? "#06b6d4" : "#ecf0f1",
//                             },
//                           }}
//                         >
//                           {time}
//                         </Button>
//                       ))}
//                       <Button
//                         onClick={() => {
//                           setSelectedDeliveryTime("custom");
//                           setCustomDeliveryTime("");
//                         }}
//                         variant={selectedDeliveryTime === "custom" ? "contained" : "outlined"}
//                         fullWidth
//                         sx={{
//                           py: 1,
//                           px: 1,
//                           borderRadius: 2,
//                           textTransform: "none",
//                           fontSize: "0.9rem",
//                           fontWeight: 500,
//                           borderColor: selectedDeliveryTime === "custom" ? "#16a34a" : "#06b6d4",
//                           color: selectedDeliveryTime === "custom" ? "white" : "#06b6d4",
//                           bgcolor: selectedDeliveryTime === "custom" ? "#16a34a" : "transparent",
//                           "&:hover": {
//                             borderColor: selectedDeliveryTime === "custom" ? "#15803d" : "#0891b2",
//                             bgcolor: selectedDeliveryTime === "custom" ? "#16a34a" : "#ecf0f1",
//                           },
//                         }}
//                       >
//                         Custom
//                       </Button>
//                     </Box>

//                     {/* Custom Delivery Time Input */}
//                     {selectedDeliveryTime === "custom" && (
//                       <TextField
//                         fullWidth
//                         placeholder="e.g., 45 minutes, 2 hours, 1 day"
//                         value={customDeliveryTime}
//                         onChange={(e) => setCustomDeliveryTime(e.target.value)}
//                         size="small"
//                         sx={{
//                           mb: 2,
//                           "& .MuiOutlinedInput-root": {
//                             borderColor: "#fcd34d",
//                             "&:hover fieldset": {
//                               borderColor: "#fcd34d",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "#06b6d4",
//                             },
//                           },
//                         }}
//                       />
//                     )}

//                     <Typography
//                       variant="caption"
//                       color="#6b7280"
//                       sx={{ display: "block", mt: 2 }}
//                     >
//                       Select a delivery time that reflects how quickly you can
//                       consistently provide the account login after payment. Fast and
//                       timely delivery boosts your rating and builds buyer trust.
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>
//             </Box>
//           </>
//         );

//       case 1:
//         return (
//           <>
//             <Typography variant="h5" fontWeight="600" gutterBottom>
//               Account Access Details
//             </Typography>
//             <Typography variant="body1" color="text.secondary" mb={4}>
//               Provide login credentials securely. This information is encrypted
//               and only shown to buyers after purchase.
//             </Typography>

//             <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//               <TextField
//                 fullWidth
//                 label="Username / Handle"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 error={!!errors.username}
//                 helperText={errors.username}
//               />

//               <TextField
//                 fullWidth
//                 label="Account Password"
//                 name="accountPass"
//                 value={formData.accountPass}
//                 onChange={handleChange}
//                 type="password"
//                 required
//                 error={!!errors.accountPass}
//                 helperText={errors.accountPass || "Current login password"}
//               />

//               <TextField
//                 fullWidth
//                 label="Recovery Email (if any)"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 type="email"
//                 placeholder="recovery@example.com"
//               />

//               <TextField
//                 fullWidth
//                 label="Recovery Email Password (if different)"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 type="password"
//               />

//               <TextField
//                 fullWidth
//                 label="Profile Preview Link"
//                 name="previewLink"
//                 value={formData.previewLink}
//                 onChange={handleChange}
//                 placeholder="https://instagram.com/username"
//                 helperText="Public link to view the account (highly recommended)"
//               />

//               <TextField
//                 fullWidth
//                 label="Additional Notes"
//                 name="additionalInfo"
//                 value={formData.additionalInfo}
//                 onChange={handleChange}
//                 multiline
//                 rows={4}
//                 placeholder="2FA status, original email included, monetization details, etc."
//               />

//               {/* Selling From Section */}
//               <Box sx={{ pt: 3, textAlign: "center" }}>
//                 <Typography variant="h6" fontWeight="600" gutterBottom>
//                   Selling From
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" mb={3}>
//                   Manage your account listings
//                 </Typography>
//                 <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     onClick={handleAddAccount}
//                     sx={{
//                       px: 4,
//                       py: 1.5,
//                       borderRadius: 2,
//                       textTransform: "none",
//                       fontSize: "1rem",
//                       borderColor: "#667eea",
//                       color: "#667eea",
//                       "&:hover": {
//                         bgcolor: "#f0f4ff",
//                         borderColor: "#667eea",
//                       },
//                     }}
//                   >
//                     Add Account
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     onClick={() => setShowReviewModal(true)}
//                     sx={{
//                       px: 4,
//                       py: 1.5,
//                       borderRadius: 2,
//                       textTransform: "none",
//                       fontSize: "1rem",
//                       borderColor: "#764ba2",
//                       color: "#764ba2",
//                       "&:hover": {
//                         bgcolor: "#faf5ff",
//                         borderColor: "#764ba2",
//                       },
//                     }}
//                   >
//                     Review
//                   </Button>
//                 </Box>
//               </Box>
//             </Box>
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 4, md: 8 } }}>
//       <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 } }}>
//         <Paper
//           elevation={12}
//           sx={{
//             borderRadius: 4,
//             overflow: "hidden",
//             bgcolor: "background.paper",
//             boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
//           }}
//         >
//           {/* Header */}
//           <Box
//             sx={{
//               bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//               color: "white",
//               py: 6,
//               px: 4,
//               textAlign: "center",
//             }}
//           >
//             <Typography
//               variant="h3"
//               fontWeight="bold"
//               gutterBottom
//               color="black"
//             >
//               Sell Your Account
//             </Typography>
//             <Typography className="md:w-2/3 md:mx-auto text-center text-black text-xl">
//               List your social media or gaming account securely and reach
//               thousands of buyers
//             </Typography>
//           </Box>

//           <Box sx={{ p: { xs: 4, md: 6 } }}>
//             {/* Credit/Block Banner */}
//             {renderCreditBanner()}

//             <Stepper activeStep={step} alternativeLabel sx={{ mb: 8 }}>
//               {steps.map((label, index) => (
//                 <Step key={label}>
//                   <StepLabel>
//                     <Typography
//                       variant="subtitle1"
//                       fontWeight={step === index ? 700 : 500}
//                       color={step === index ? "primary" : "text.secondary"}
//                     >
//                       {label}
//                     </Typography>
//                   </StepLabel>
//                 </Step>
//               ))}
//             </Stepper>

//             {/* Content area with block protection */}
//             <Box sx={{ opacity: isBlocked ? 0.5 : 1, pointerEvents: isBlocked ? 'none' : 'auto' }}>
//                {getStepContent(step)}
//             </Box>

//             {/* Navigation Buttons */}
//             <Box
//               sx={{ display: "flex", justifyContent: "space-between", mt: 8 }}
//             >
//               <Button
//                 onClick={prevStep}
//                 disabled={step === 0}
//                 size="large"
//                 variant="outlined"
//                 sx={{
//                   px: 5,
//                   py: 1.5,
//                   borderRadius: 3,
//                   textTransform: "none",
//                   fontSize: "1.1rem",
//                 }}
//               >
//                 Back
//               </Button>

//               <Button
//                 onClick={nextStep}
//                 disabled={loadingCredit || hasNoCredit || isBlocked}
//                 size="large"
//                 variant="contained"
//                 sx={{
//                   px: 7,
//                   py: 1.5,
//                   borderRadius: 3,
//                   textTransform: "none",
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   background: isBlocked ? "#9ca3af" : "linear-gradient(90deg, rgb(10, 26, 58) 0%, rgb(212, 166, 67) 100%)",
//                   boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
//                   "&:hover": {
//                     boxShadow: "0 12px 25px rgba(102, 126, 234, 0.4)",
//                   },
//                 }}
//               >
//                 {isBlocked ? "Blocked" : step === steps.length - 1 ? "Submit Listing" : "Continue"}
//               </Button>
//             </Box>
//           </Box>
//         </Paper>

//         {/* Review Modal */}
//         <Dialog
//           open={showReviewModal}
//           onClose={() => setShowReviewModal(false)}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
//             Account Listings Review ({savedAccounts.length})
//           </DialogTitle>
//           <DialogContent sx={{ pt: 2, maxHeight: "600px", overflowY: "auto" }}>
//             {savedAccounts.length > 0 ? (
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 {savedAccounts.map((account, index) => (
//                   <Paper
//                     key={account.id}
//                     sx={{
//                       p: 3,
//                       bgcolor: "#f9fafb",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "start",
//                         gap: 2,
//                         mb: 2,
//                       }}
//                     >
//                       {account.categoryIcon && (
//                         <img
//                           src={account.categoryIcon}
//                           alt={account.category}
//                           width={40}
//                           height={40}
//                           style={{ objectFit: "contain" }}
//                         />
//                       )}
//                       <Box sx={{ flex: 1 }}>
//                         <Typography variant="subtitle1" fontWeight="600">
//                           Account #{index + 1}: {account.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Platform: {account.category}
//                         </Typography>
//                       </Box>
//                       <Button
//                         size="small"
//                         color="error"
//                         variant="outlined"
//                         onClick={() => handleRemoveAccount(account.id)}
//                       >
//                         Remove
//                       </Button>
//                     </Box>
//                     <Divider sx={{ my: 2 }} />
//                     <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//                       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                         <Typography variant="body2" color="text.secondary">
//                           Price:
//                         </Typography>
//                         <Typography variant="body2" fontWeight="600">
//                           ${account.price} USD
//                         </Typography>
//                       </Box>
//                       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                         <Typography variant="body2" color="text.secondary">
//                           Username:
//                         </Typography>
//                         <Typography variant="body2" fontWeight="600">
//                           {account.username}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                         <Typography variant="body2" color="text.secondary">
//                           Status:
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           fontWeight="600"
//                           sx={{ color: "#f59e0b" }}
//                         >
//                           Pending Review
//                         </Typography>
//                       </Box>
//                     </Box>
//                     {account.description && (
//                       <Box sx={{ mt: 2 }}>
//                         <Typography variant="caption" fontWeight="600">
//                           Description
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
//                           {account.description}
//                         </Typography>
//                       </Box>
//                     )}
//                   </Paper>
//                 ))}
//               </Box>
//             ) : (
//               <Typography
//                 variant="body1"
//                 color="text.secondary"
//                 align="center"
//                 py={4}
//               >
//                 No accounts added yet. Fill in the account details and click "Add Account" to save them here.
//               </Typography>
//             )}
//           </DialogContent>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// };

// export default SellForm;
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthHook } from "../../hook/useAuthHook";

interface Platform {
  _id: string;
  id: number;
  name: string;
  link: string;
}

interface FormData {
  category: string;
  categoryIcon: string;
  name: string;
  description: string;
  price: string;
  username: string;
  accountPass: string;
  previewLink: string;
  email: string;
  password: string;
  additionalInfo: string;
  userEmail: string;
  userRole: string;
  status: string;
  createdAt: Date;
  userAccountName: string;
}

interface SavedAccount extends FormData {
  id: string;
  savedAt: number;
}

interface SellResponse {
  acknowledged: boolean;
  insertedCount: number;
  message: string;
}

const SellForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { data } = useAuthHook();
  const user = data;
  console.log(user?.name);

  // --- Block logic start ---
  const isBlocked = (user as any)?.status === "blocked";
  // --- Block logic end ---

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);

  // Sales Credit State
  const [salesCredit, setSalesCredit] = useState<number | null>(null);
  const [loadingCredit, setLoadingCredit] = useState(true);
  const [hasNoCredit, setHasNoCredit] = useState(false);

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string | null>(null);
  const [customDeliveryTime, setCustomDeliveryTime] = useState("");
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    const saved = localStorage.getItem("sellformSavedAccounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<FormData>({
    category: "",
    categoryIcon: "",
    name: "",
    description: "",
    price: "",
    username: "",
    accountPass: "",
    previewLink: "",
    email: "",
    password: "",
    additionalInfo: "",
    userEmail: `${user?.email}`,
    userRole: user?.role || "",
    status: "pending",
    createdAt: new Date(),
    userAccountName: `${user?.name}` || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch Platforms
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await axios.get<{ data: Platform[] }>(
          "http://localhost:3200/icon-data"
        );
        const data = Array.isArray(response.data)
          ? response.data
          : (response as any).data.data || [];
        setPlatforms(data);
      } catch (error) {
        toast.error("Failed to load platforms.");
        console.error(error);
      } finally {
        setLoadingPlatforms(false);
      }
    };

    fetchPlatforms();
  }, []);

  // Fetch User's Sales Credit
  useEffect(() => {
    const fetchSalesCredit = async () => {
      if (!user?.email) {
        setLoadingCredit(false);
        return;
      }

      try {
        const response = await axios.get<{ salesCredit: number }>(
          `http://localhost:3200/product/credit?email=${encodeURIComponent(
            user.email
          )}`
        );
        const credit = response.data.salesCredit ?? 0;
        setSalesCredit(credit);
        setHasNoCredit(credit <= 0);
      } catch (error: any) {
        toast.error("Failed to load listing credits.");
        console.error(error);
        setHasNoCredit(true);
      } finally {
        setLoadingCredit(false);
      }
    };

    fetchSalesCredit();
  }, [user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCategoryChange = (_: any, value: Platform | null) => {
    if (value) {
      setFormData({
        ...formData,
        category: value.name,
        categoryIcon: value.link,
      });
      setErrors({ ...errors, category: "" });
    } else {
      setFormData({ ...formData, category: "", categoryIcon: "" });
    }
  };

  // Validation Step 0
  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.category) newErrors.category = "Platform is required";
    if (!formData.name.trim()) newErrors.name = "Account name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation Step 1
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.accountPass)
      newErrors.accountPass = "Account password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler to save account and clear only Step 1 form
  const handleAddAccount = () => {
    if (!validateStep1()) return;

    const newSavedAccount: SavedAccount = {
      ...formData,
      id: Date.now().toString(),
      savedAt: Date.now(),
    };

    const updatedAccounts = [...savedAccounts, newSavedAccount];
    setSavedAccounts(updatedAccounts);
    localStorage.setItem("sellformSavedAccounts", JSON.stringify(updatedAccounts));

    // Clear only Step 1 fields (Account Access Details), keep Step 0 fields (Sell Your Account)
    setFormData({
      ...formData,
      username: "",
      accountPass: "",
      previewLink: "",
      email: "",
      password: "",
      additionalInfo: "",
    });

    toast.success("Account details saved! You can add another one.");
  };

  const handleRemoveAccount = (id: string) => {
    const updatedAccounts = savedAccounts.filter((acc) => acc.id !== id);
    setSavedAccounts(updatedAccounts);
    localStorage.setItem("sellformSavedAccounts", JSON.stringify(updatedAccounts));
    toast.success("Account removed from the list.");
  };

  const nextStep = () => {
    // Block check
    if (isBlocked) {
      toast.error("You are blocked and cannot perform this action.");
      return;
    }

    if (step === 0 && validateStep0()) {
      setStep(step + 1);
    } else if (step === 1 && validateStep1()) {
      if (loadingCredit) {
        toast.info("Loading your credits...");
        return;
      }
      if (hasNoCredit) {
        toast.error(
          "You have no listing credits left. Purchase more to list an account."
        );
        return;
      }
      handleSubmit();
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (isBlocked) return;

    // If there are saved accounts, submit all of them
    if (savedAccounts.length > 0) {
      // Remove the temporary 'id' and 'savedAt' fields added for local storage
      const accountsToSubmit = savedAccounts.map((account) => {
        const { id, savedAt, ...accountData } = account;
        return accountData;
      });

      try {
        const response = await axios.post<SellResponse>(
          "http://localhost:3200/product/sell",
          { products: accountsToSubmit }
        );

        if (response.status === 201 || response.status === 200) {
          const insertedCount = response.data?.insertedCount || accountsToSubmit.length;
          toast.success(`${insertedCount} account(s) listed successfully!`);

          // Update local credit count based on number of products submitted
          if (salesCredit !== null) {
            const newCredit = salesCredit - insertedCount;
            setSalesCredit(newCredit);
            setHasNoCredit(newCredit <= 0);
          }

          // Clear saved accounts and localStorage
          setSavedAccounts([]);
          localStorage.removeItem("sellformSavedAccounts");

          navigate("/myproducts");
        }
      } catch (error: any) {
        const msg =
          error.response?.data?.message || "Failed to list accounts. Try again.";
        toast.error(msg);
        console.error(error);
      }
    } else {
      // If no saved accounts, validate and submit current form data
      if (!validateStep1()) return;

      try {
        const response = await axios.post<SellResponse>(
          "http://localhost:3200/product/sell",
          { products: [formData] }
        );

        if (response.status === 201 || response.status === 200) {
          toast.success("Your account has been listed successfully!");

          // Update local credit count
          if (salesCredit !== null && salesCredit > 0) {
            const newCredit = salesCredit - 1;
            setSalesCredit(newCredit);
            setHasNoCredit(newCredit <= 0);
          }

          navigate("/myproducts");
        }
      } catch (error: any) {
        const msg =
          error.response?.data?.message || "Failed to list account. Try again.";
        toast.error(msg);
        console.error(error);
      }
    }
  };

  const steps = ["Account Details", "Access Information"];

  const getSelectedPlatform = () => {
    return platforms.find((p) => p.name === formData.category) || null;
  };

  const renderCreditBanner = () => {
    // Render block message if blocked
    if (isBlocked) {
      return (
        <Box sx={{ bgcolor: "#fee2e2", color: "#b91c1c", p: 3, borderRadius: 2, mb: 4, textAlign: "center", border: "1px solid #fca5a5" }}>
          <Typography variant="h6" fontWeight="bold">🚫 Account Restricted</Typography>
          <Typography variant="body2">Your account is currently blocked from selling. Please contact support.</Typography>
        </Box>
      );
    }

    if (loadingCredit) {
      return (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" ml={1} component="span">
            Loading credits...
          </Typography>
        </Box>
      );
    }

    if (hasNoCredit) {
      return (
        <Box
          sx={{
            bgcolor: "error.light",
            color: "error.contrastText",
            p: 3,
            borderRadius: 2,
            mb: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            ⚠️ No Listing Credits Available
          </Typography>
          <Typography variant="body1" mt={1}>
            You currently have 0 credits. You cannot list new accounts until you
            purchase more listing credits.
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          bgcolor: "success.light",
          color: "success.contrastText",
          p: 2,
          borderRadius: 2,
          mb: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="body1">
          <strong>Remaining Listing Credits: {salesCredit}</strong>
        </Typography>
        <Typography variant="body2" mt={0.5}>
          Each new listing consumes 1 credit.
        </Typography>
      </Box>
    );
  };

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Tell us about the account you're selling
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Provide clear and accurate details to attract buyers faster.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Autocomplete
                options={platforms}
                getOptionLabel={(option) => option.name}
                value={getSelectedPlatform()}
                onChange={handleCategoryChange}
                loading={loadingPlatforms}
                disableClearable={!!formData.category}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <img
                      src={option.link}
                      alt={option.name}
                      width={32}
                      height={32}
                      style={{ objectFit: "contain" }}
                    />
                    <Typography>{option.name}</Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Platform / Category"
                    required
                    error={!!errors.category}
                    helperText={errors.category}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: formData.categoryIcon ? (
                        <InputAdornment position="start">
                          <img
                            src={formData.categoryIcon}
                            alt={formData.category}
                            width={32}
                            height={32}
                            style={{ objectFit: "contain" }}
                          />
                        </InputAdornment>
                      ) : null,
                      endAdornment: (
                        <>
                          {loadingPlatforms && (
                            <CircularProgress color="inherit" size={20} />
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                fullWidth
                label="Account Title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={
                  errors.name || "e.g., Gaming Instagram with 50K Followers"
                }
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={5}
                required
                error={!!errors.description}
                helperText={
                  errors.description ||
                  "Include followers, niche, engagement rate, revenue, etc."
                }
              />

              <TextField
                fullWidth
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                required
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">USD</InputAdornment>
                  ),
                }}
              />

              {/* Release Options Section */}
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Release Options
                </Typography>

                <RadioGroup
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                >
                  {/* Auto Confirm Order */}
                  <FormControlLabel
                    value="automated"
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Typography variant="subtitle1" fontWeight="600">
                            Auto Confirm Order
                          </Typography>
                          <Typography
                            sx={{
                              bgcolor: "#d1fae5",
                              color: "#047857",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Recommended
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="#d97706"
                          sx={{ mt: 0.5 }}
                        >
                          Perfect for products that don't need your attention.
                          Logins are sent and the order is confirmed automatically —
                          no action required.
                        </Typography>
                      </Box>
                    }
                    sx={{
                      p: 2.5,
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      mb: 2,
                      alignItems: "flex-start",
                      "&:hover": {
                        bgcolor: "#fafafa",
                      },
                    }}
                  />

                  {/* Manual Release */}
                  <FormControlLabel
                    value="manual"
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          Manual Release
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#d97706"
                          sx={{ mt: 0.5 }}
                        >
                          Ideal for products that need your input - like those
                          requiring a code or extra authentication before access.
                          You'll manually send login details and confirm orders
                          after each sale.
                        </Typography>
                      </Box>
                    }
                    sx={{
                      p: 2.5,
                      border:
                        deliveryMethod === "manual"
                          ? "2px solid #f97316"
                          : "1px solid #e5e7eb",
                      borderRadius: 2,
                      mb: 2,
                      alignItems: "flex-start",
                      bgcolor:
                        deliveryMethod === "manual" ? "#fef3c7" : "transparent",
                      "&:hover": {
                        bgcolor:
                          deliveryMethod === "manual" ? "#fef3c7" : "#fafafa",
                      },
                    }}
                  />
                </RadioGroup>

                {/* Show delivery time options when Manual is selected */}
                {deliveryMethod === "manual" && (
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "#fffbeb",
                      borderRadius: 2,
                      border: "1px solid #fcd34d",
                      mt: 3,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="600" mb={2}>
                      Expected Delivery Time
                    </Typography>
                    <Typography variant="caption" color="#6b7280" display="block" mb={2}>
                      Delivery time
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(2, 1fr)",
                          sm: "repeat(5, 1fr)",
                        },
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      {["5 mins", "10 mins", "15 mins", "30 mins"].map((time) => (
                        <Button
                          key={time}
                          onClick={() => {
                            setSelectedDeliveryTime(time);
                            setCustomDeliveryTime("");
                          }}
                          variant={selectedDeliveryTime === time ? "contained" : "outlined"}
                          fullWidth
                          sx={{
                            py: 1,
                            px: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            borderColor: "#06b6d4",
                            color: selectedDeliveryTime === time ? "white" : "#06b6d4",
                            bgcolor: selectedDeliveryTime === time ? "#06b6d4" : "transparent",
                            "&:hover": {
                              borderColor: "#0891b2",
                              bgcolor: selectedDeliveryTime === time ? "#06b6d4" : "#ecf0f1",
                            },
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                      <Button
                        onClick={() => {
                          setSelectedDeliveryTime("custom");
                          setCustomDeliveryTime("");
                        }}
                        variant={selectedDeliveryTime === "custom" ? "contained" : "outlined"}
                        fullWidth
                        sx={{
                          py: 1,
                          px: 1,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          borderColor: selectedDeliveryTime === "custom" ? "#16a34a" : "#06b6d4",
                          color: selectedDeliveryTime === "custom" ? "white" : "#06b6d4",
                          bgcolor: selectedDeliveryTime === "custom" ? "#16a34a" : "transparent",
                          "&:hover": {
                            borderColor: selectedDeliveryTime === "custom" ? "#15803d" : "#0891b2",
                            bgcolor: selectedDeliveryTime === "custom" ? "#16a34a" : "#ecf0f1",
                          },
                        }}
                      >
                        Custom
                      </Button>
                    </Box>

                    {/* Custom Delivery Time Input */}
                    {selectedDeliveryTime === "custom" && (
                      <TextField
                        fullWidth
                        placeholder="e.g., 45 minutes, 2 hours, 1 day"
                        value={customDeliveryTime}
                        onChange={(e) => setCustomDeliveryTime(e.target.value)}
                        size="small"
                        sx={{
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            borderColor: "#fcd34d",
                            "&:hover fieldset": {
                              borderColor: "#fcd34d",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#06b6d4",
                            },
                          },
                        }}
                      />
                    )}

                    <Typography
                      variant="caption"
                      color="#6b7280"
                      sx={{ display: "block", mt: 2 }}
                    >
                      Select a delivery time that reflects how quickly you can
                      consistently provide the account login after payment. Fast and
                      timely delivery boosts your rating and builds buyer trust.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Account Access Details
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Provide login credentials securely. This information is encrypted
              and only shown to buyers after purchase.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Username / Handle"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                error={!!errors.username}
                helperText={errors.username}
              />

              <TextField
                fullWidth
                label="Account Password"
                name="accountPass"
                value={formData.accountPass}
                onChange={handleChange}
                type="password"
                required
                error={!!errors.accountPass}
                helperText={errors.accountPass || "Current login password"}
              />

              <TextField
                fullWidth
                label="Recovery Email (if any)"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="recovery@example.com"
              />

              <TextField
                fullWidth
                label="Recovery Email Password (if different)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
              />

              <TextField
                fullWidth
                label="Profile Preview Link"
                name="previewLink"
                value={formData.previewLink}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
                helperText="Public link to view the account (highly recommended)"
              />

              <TextField
                fullWidth
                label="Additional Notes"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="2FA status, original email included, monetization details, etc."
              />

              {/* Selling From Section */}
              <Box sx={{ pt: 3, textAlign: "center" }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Selling From
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Manage your account listings
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleAddAccount}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      borderColor: "#667eea",
                      color: "#667eea",
                      "&:hover": {
                        bgcolor: "#f0f4ff",
                        borderColor: "#667eea",
                      },
                    }}
                  >
                    Add Account
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setShowReviewModal(true)}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "1rem",
                      borderColor: "#764ba2",
                      color: "#764ba2",
                      "&:hover": {
                        bgcolor: "#faf5ff",
                        borderColor: "#764ba2",
                      },
                    }}
                  >
                    Review
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 4, md: 8 } }}>
      <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "background.paper",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              py: 6,
              px: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              color="black"
            >
              Sell Your Account
            </Typography>
            <Typography className="md:w-2/3 md:mx-auto text-center text-black text-xl">
              List your social media or gaming account securely and reach
              thousands of buyers
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 4, md: 6 } }}>
            {/* Credit/Block Banner */}
            {renderCreditBanner()}

            <Stepper activeStep={step} alternativeLabel sx={{ mb: 8 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography
                      variant="subtitle1"
                      fontWeight={step === index ? 700 : 500}
                      color={step === index ? "primary" : "text.secondary"}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Content area with block protection */}
            <Box sx={{ opacity: isBlocked ? 0.5 : 1, pointerEvents: isBlocked ? 'none' : 'auto' }}>
               {getStepContent(step)}
            </Box>

            {/* Navigation Buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 8 }}
            >
              <Button
                onClick={prevStep}
                disabled={step === 0}
                size="large"
                variant="outlined"
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Back
              </Button>

              <Button
                onClick={nextStep}
                disabled={loadingCredit || hasNoCredit || isBlocked}
                size="large"
                variant="contained"
                sx={{
                  px: 7,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background: isBlocked ? "#9ca3af" : "linear-gradient(90deg, rgb(10, 26, 58) 0%, rgb(212, 166, 67) 100%)",
                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    boxShadow: "0 12px 25px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                {isBlocked ? "Blocked" : step === steps.length - 1 ? "Submit Listing" : "Continue"}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Review Modal */}
        <Dialog
          open={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: "1.3rem" }}>
            Account Listings Review ({savedAccounts.length})
          </DialogTitle>
          <DialogContent sx={{ pt: 2, maxHeight: "700px", overflowY: "auto" }}>
            {savedAccounts.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {savedAccounts.map((account, index) => (
                  <Paper
                    key={account.id}
                    sx={{
                      p: 3,
                      bgcolor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                    }}
                  >
                    {/* Header with Remove Button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      {account.categoryIcon && (
                        <img
                          src={account.categoryIcon}
                          alt={account.category}
                          width={40}
                          height={40}
                          style={{ objectFit: "contain" }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          Account #{index + 1}: {account.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Platform: {account.category}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleRemoveAccount(account.id)}
                      >
                        Remove
                      </Button>
                    </Box>
                    
                    {/* SELL YOUR ACCOUNT DETAILS SECTION */}
                    <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5, color: "#667eea" }}>
                      📋 Sell Your Account Details
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3, pl: 2, borderLeft: "3px solid #667eea" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Price:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          ${account.price} USD
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Status:
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{ color: "#f59e0b" }}
                        >
                          Pending Review
                        </Typography>
                      </Box>
                    </Box>

                    {account.description && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" fontWeight="600" sx={{ color: "#667eea" }}>
                          Description
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                          {account.description}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* ACCOUNT ACCESS DETAILS SECTION */}
                    <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 1.5, color: "#764ba2" }}>
                      🔐 Account Access Details
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pl: 2, borderLeft: "3px solid #764ba2" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Username:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {account.username}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" color="text.secondary">
                          Password:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {'•'.repeat(account.accountPass.length)} (hidden for security)
                        </Typography>
                      </Box>
                      {account.previewLink && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Preview Link:
                          </Typography>
                          <Typography variant="body2" fontWeight="600" sx={{ color: "#0891b2" }}>
                            ✓ Provided
                          </Typography>
                        </Box>
                      )}
                      {account.email && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Recovery Email:
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            {account.email}
                          </Typography>
                        </Box>
                      )}
                      {account.password && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Email Password:
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            {'•'.repeat(account.password.length)} (hidden)
                          </Typography>
                        </Box>
                      )}
                      {account.additionalInfo && (
                        <Box>
                          <Typography variant="caption" fontWeight="600" sx={{ color: "#764ba2" }}>
                            Additional Notes
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                            {account.additionalInfo}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                py={4}
              >
                No accounts added yet. Fill in all account details and click "Add Account" to save them here.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
            <Button 
              onClick={() => setShowReviewModal(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                setShowReviewModal(false);
                await handleSubmit();
              }}
              variant="contained"
              disabled={savedAccounts.length === 0 || loadingCredit}
              sx={{
                background: "linear-gradient(90deg, rgb(10, 26, 58) 0%, rgb(212, 166, 67) 100%)",
              }}
            >
              Submit Listing ({savedAccounts.length})
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default SellForm;