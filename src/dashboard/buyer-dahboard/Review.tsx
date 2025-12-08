import React from "react";
import { Box, Button, Card, CardContent, Container, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Review: React.FC = () => {
  const navigate = useNavigate();
  const steps = ["Make Payment", "Add account", "Credentials", "Review"];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" align="left" sx={{ mb: 3 }}>
        Review your listing
      </Typography>

      {/* STEPPER */}
      <Stepper activeStep={3} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Please review the account information before submitting your listing.
          </Typography>

          {/* Placeholder area: you can expand this to show full preview of the form data */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Account preview
            </Typography>
            <Box sx={{ mt: 2, p: 3, border: "1px dashed #e0e0e0", borderRadius: 2 }}>
              <Typography variant="body2">Preview of the account and credentials will appear here.</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#33ac6f", '&:hover': { bgcolor: '#2e7d32' } }}
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
