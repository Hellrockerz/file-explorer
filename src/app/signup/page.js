'use client';

import * as React from 'react';
import { Box, TextField, IconButton, InputAdornment, Button, Typography, Container, Paper } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import NextLink from 'next/link';
import { toast } from 'react-toastify';
import request from '@/app/api/axiosInstanceFIle';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

// Initialize toast notifications
import { ToastContainer } from 'react-toastify';
// toast.configure();

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({ fullName: '', email: '', password: '', cPassword: '' });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.cPassword) {
      toast.error("All Fields Are Required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Invalid Email Format");
      return;
    }

    if (formData.password !== formData.cPassword) {
      toast.error("Password and Confirm Password must be the same");
      return;
    }

    try {
      const response = await request.post('/user/signup', formData);
      toast.success(response.data.message || "Signed Up Successfully");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(to right, #d4eaf7, #ffffff)',
        }}
      >
        <Container maxWidth="xs">
          <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
              File <span style={{ color: '#ff6600' }}>Explorer</span>
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>Sign Up</Typography>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField required label="Full Name" name="fullName" variant="outlined" fullWidth value={formData.fullName} onChange={handleChange} />
              <TextField required label="Email" name="email" type="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />
              <TextField
                required
                label="New Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                label="Confirm Password"
                name="cPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={formData.cPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Sign Up
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already Signed Up? <Link component={NextLink} href="/" sx={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}><span style={{ color: '#1976d2' }}>Login Here</span></Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
