import React from "react";
import { Box, Button, Card, CardContent, Container, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Review: React.FC = () => {
  const navigate = useNavigate();
  const steps = ["Make Payment", "Add account", "Credentials", "Review"];

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4, md: 6 } }}>
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight="bold"
        align="left"
        sx={{ mb: 3, fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.125rem" } }}
      >
        Review your listing
      </Typography>

      {/* STEPPER */}
      <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
        <Stepper activeStep={3}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Card sx={{ borderRadius: { xs: 2, md: 3 }, boxShadow: { xs: 2, md: 3 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4, fontSize: { xs: "0.85rem", md: "0.95rem" } }}
          >
            Please review the account information before submitting your listing.
          </Typography>

          {/* Placeholder area: you can expand this to show full preview of the form data */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: "0.95rem", md: "1.1rem" } }}>
              Account preview
            </Typography>
            <Box sx={{ mt: 2, p: { xs: 2, md: 3 }, border: "1px dashed #e0e0e0", borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                Preview of the account and credentials will appear here.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#33ac6f",
                "&:hover": { bgcolor: "#2e7d32" },
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
              onClick={() => {
                // submit action placeholder
                // after submit, navigate to a confirmation page or dashboard
                navigate("/");
              }}
            >
              Submit Listing
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Review;
