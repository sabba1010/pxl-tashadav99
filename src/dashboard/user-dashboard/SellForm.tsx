import {
  Autocomplete,
  Box,
  Button,
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
import { useAuth } from "../../context/AuthContext";

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
}

const SellForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const user = useAuth();

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(true);
  console.log(platforms)
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
    userEmail: user?.user?.email || "",
    userRole: user?.user?.role || "",
    status: "pending",
  });

useEffect(() => {
  const fetchPlatforms = async () => {
    try {
      const response = await axios.get<{response: any, platforms: any, data: any}>("https://vps-backend-server-beta.vercel.app/icon-data");
      // Adjust here depending on your API response
      console.log(response.data.data)
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      console.log(data)
      setPlatforms(data || []);
    } catch (error) {
      toast.error("Failed to load platforms. Please try again later.");
      console.error(error);
    } finally {
      setLoadingPlatforms(false);
    }
  };

  fetchPlatforms();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (_: any, value: Platform | null) => {
    if (value) {
      setFormData({
        ...formData,
        category: value.name,
        categoryIcon: value.link,
      });
    } else {
      setFormData({ ...formData, category: "", categoryIcon: "" });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    console.log("Submitted:", formData);
    try {
      const response = await axios.post<{ acknowledged: boolean }>(
        "https://vps-backend-server-beta.vercel.app/product/sell",
        formData
      );
      if (response.data.acknowledged) {
        toast.success("Product listed successfully!");
        navigate("/myproducts");
      } else {
        toast.error("Server did not acknowledge the operation.");
      }
    } catch (error) {
      toast.error("An error occurred during product listing.");
      console.error(error);
    }
  };

  const steps = ["Account Details", "Login & Info"];

const getSelectedPlatform = () => {
  if (!Array.isArray(platforms)) return null;
  return platforms.find((p) => p.name === formData.category) || null;
};


  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Tell us about the account you're selling
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
              <Autocomplete
                options={platforms}
                getOptionLabel={(option) => option.name}
                value={getSelectedPlatform()}
                onChange={handleCategoryChange}
                loading={loadingPlatforms}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <img
                      src={option.link}
                      alt={option.name}
                      width={24}
                      height={24}
                      style={{ objectFit: "contain" }}
                    />
                    <Typography variant="body1">{option.name}</Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Platform"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: formData.category ? (
                        <InputAdornment position="start">
                          <img
                            src={formData.categoryIcon}
                            alt={formData.category}
                            width={24}
                            height={24}
                            style={{ objectFit: "contain" }}
                          />
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                )}
              />
              <TextField
                fullWidth
                label="Account Name / Title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Describe the account: followers, niche, engagement, etc."
              />
              <TextField
                fullWidth
                label="Price (USD)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Box>
          </>
        );

      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Provide account access details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
              <TextField
                fullWidth
                label="Username / Handle"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Account Password"
                name="accountPass"
                value={formData.accountPass}
                onChange={handleChange}
                type="password"
                required
              />
              <TextField
                fullWidth
                label="Recovery Email Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
              />
              <TextField
                fullWidth
                label="Email Address (for recovery)"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
              />
              <TextField
                fullWidth
                label="Preview Link (optional)"
                name="previewLink"
                value={formData.previewLink}
                onChange={handleChange}
                placeholder="e.g., https://instagram.com/username"
              />
              <TextField
                fullWidth
                label="Additional Information"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="2FA status, original email, notes, etc."
              />
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", py: 6 }}>
      <Paper
        elevation={8}
        sx={{ maxWidth: 680, mx: "auto", borderRadius: 4, overflow: "hidden", bgcolor: "background.paper" }}
      >
        <Box sx={{ bgcolor: "#D4A643", color: "white", py: 4, px: 4 }}>
          <Typography variant="h4" align="center" fontWeight="bold">
            Sell Your Social Media Account
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 1, opacity: 0.9 }}>
            Securely list your account for sale
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 5 } }}>
          <Stepper activeStep={step} alternativeLabel sx={{ mb: 6 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="subtitle1" fontWeight={step === index ? "bold" : "medium"}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(step)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
            <Button disabled={step === 0} onClick={prevStep} size="large" variant="outlined" sx={{ px: 4 }}>
              Back
            </Button>
            <Button
              onClick={step === steps.length - 1 ? handleSubmit : nextStep}
              size="large"
              variant="contained"
              color="primary"
              sx={{ px: 6, py: 1.5, borderRadius: 2 }}
            >
              {step === steps.length - 1 ? "Submit Listing" : "Next"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SellForm;
