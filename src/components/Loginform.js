'use client';

import * as React from 'react';
import { Box, TextField, IconButton, InputAdornment, Button, Typography, Container, Paper } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '@/app/api/axiosInstanceFIle';

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Invalid Email Format");
      return;
    }

    if (!formData.email || !formData.password) {
      return toast.error("All Fields Are Required");
    }

    try {
      const response = await request.post('/user/login', formData);
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(response?.data?.data));
      toast.success("Login Successful");
      setTimeout(() => {
        router.push('/dashboard'); // Redirect to dashboard or homepage after login
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something Went Wrong";
      toast.error(errorMessage);
    }
  };

  return (
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
        <ToastContainer />
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
            File <span style={{ color: '#ff6600' }}>Explorer</span>
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>Login</Typography>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField required label="Email" name="email" type="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />
            <TextField
              required
              label="Password"
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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Don&apos;t have an account?   <Link component={NextLink} href="/signup" sx={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}><span style={{ color: '#1976d2' }}>Signup Here</span></Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
