import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack
} from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const ErrorPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 6, sm: 8 },
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '5rem', md: '7rem' },
              fontWeight: 700,
              color: '#e2e8f0',
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              mb: 1,
            }}
          >
            Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              mb: 6,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            The page you are looking for doesn't exist or has been moved.
          </Typography>

          {/* Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => window.location.href = '/'}
              sx={{
                px: 4,
                minWidth: 140,
                borderRadius: 2,
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
              }}
            >
              Go Home
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => window.history.back()}
              sx={{
                px: 4,
                minWidth: 140,
                borderRadius: 2,
                borderColor: '#cbd5e1',
                color: '#475569',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              Go Back
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;