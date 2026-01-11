// Import React and useState hook for component state
import React, { useState } from 'react';

// useNavigate is used to move between pages (routes)
import { useNavigate } from 'react-router-dom';

// Formik is used to manage forms easily
import { Formik, Form, Field } from 'formik';

// Yup is used for form validation rules
import * as Yup from 'yup';

// Import Material UI components for UI
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';

// Import icons for show/hide password
import { Visibility, VisibilityOff } from '@mui/icons-material';

/* =========================
   STEP 1: Form Values Type
   ========================= */
// This interface defines what data the login form contains
interface LoginFormValues {
  email: string;    // user's email
  password: string; // user's password
}

/* =========================
   STEP 2: Yup Validation
   ========================= */
// Validation rules for login form
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')   // must be valid email
    .required('Email is required'),  // cannot be empty

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters') // minimum length
    .required('Password is required'),                // cannot be empty
});

/* =========================
   STEP 3: Props Interface
   ========================= */
// setIsAuthenticated comes from App.tsx
interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

/* =========================
   STEP 4: Login Component
   ========================= */
const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {

  // Used to navigate to other pages
  const navigate = useNavigate();

  // Controls show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Stores success message after login
  const [successMessage, setSuccessMessage] = useState('');

  /* =========================
     STEP 5: Initial Values
     ========================= */
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  /* =========================
     STEP 6: Form Submit
     ========================= */
  /* =========================
     STEP 6: Form Submit
     ========================= */
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful!');
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1000);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  /* =========================
     STEP 7: UI Rendering
     ========================= */
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#c0c0c0',
        padding: 2,
      }}
    >
      {/* Card container */}
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          bgcolor: '#a0a0a0',
        }}
      >

        {/* Show success message if login is successful */}
        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Page title */}
        <Typography
          variant="h4"
          sx={{ marginBottom: 3, fontWeight: 'bold' }}
        >
          Login
        </Typography>

        {/* =========================
            STEP 8: Formik Form
           ========================= */}
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form>

              {/* EMAIL FIELD */}
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ marginBottom: 2, bgcolor: 'white' }}
              />

              {/* PASSWORD FIELD */}
              <Field
                as={TextField}
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'} // toggle password
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ marginBottom: 2, bgcolor: 'white' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Show / Hide password icon */}
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* LOGIN BUTTON */}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  marginBottom: 2,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                }}
              >
                Sign In
              </Button>

            </Form>
          )}
        </Formik>

        {/* =========================
            Navigation Links
           ========================= */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

          {/* Go to Register page */}
          <Button
            onClick={() => navigate('/register')}
            sx={{ color: 'black', textTransform: 'none' }}
          >
            Create Account
          </Button>

          {/* Go to Reset Password page */}
          <Button
            onClick={() => navigate('/reset-password')}
            sx={{ color: 'black', textTransform: 'none' }}
          >
            Forgot password
          </Button>

        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
