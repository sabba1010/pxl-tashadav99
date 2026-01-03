import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
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

const SellForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { data } = useAuthHook();
  const user = data;
  console.log(user?.name);

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);

  // Sales Credit State
  const [salesCredit, setSalesCredit] = useState<number | null>(null);
  const [loadingCredit, setLoadingCredit] = useState(true);
  const [hasNoCredit, setHasNoCredit] = useState(false);

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
          "https://vps-backend-server-beta.vercel.app/icon-data"
        );
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
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
          `https://vps-backend-server-beta.vercel.app/product/credit?email=${encodeURIComponent(
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

  const nextStep = () => {
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
    if (!validateStep1()) return;

    try {
      const response = await axios.post(
        "https://vps-backend-server-beta.vercel.app/product/sell",
        formData
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
  };

  const steps = ["Account Details", "Access Information"];

  const getSelectedPlatform = () => {
    return platforms.find((p) => p.name === formData.category) || null;
  };

  const renderCreditBanner = () => {
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
            {/* Credit Banner */}
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

            {getStepContent(step)}

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
                disabled={loadingCredit || hasNoCredit}
                size="large"
                variant="contained"
                sx={{
                  px: 7,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(90deg, rgb(10, 26, 58) 0%, rgb(212, 166, 67) 100%)",
                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    boxShadow: "0 12px 25px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                {step === steps.length - 1 ? "Submit Listing" : "Continue"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SellForm;
