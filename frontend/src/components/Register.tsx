// Import React and useState hook
import React, { useState } from 'react';

// useNavigate is used to move between pages
import { useNavigate } from 'react-router-dom';

// Formik helps manage forms easily
import { Formik, Form, Field } from 'formik';

// Yup is used for form validation
import * as Yup from 'yup';

// Material UI components for styling
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

// Icons for showing / hiding password
import { Visibility, VisibilityOff } from '@mui/icons-material';

/* =========================
   STEP 1: Form Values Type
   ========================= */
// This interface defines the structure of the register form data
interface RegisterFormValues {
  email: string;           // user email
  password: string;        // user password
  confirmPassword: string; // confirm password field
}

/* =========================
   STEP 2: Validation Schema
   ========================= */
// Rules for validating the register form
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')                    // must be valid email
    .required('Email is required')                    // cannot be empty
    .trim()                                           // remove whitespace
    .lowercase(),                                     // convert to lowercase

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')                                          // minimum length
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')                  // uppercase letter
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')                  // lowercase letter
    .matches(/[0-9]/, 'Password must contain at least one number')                            // number
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)') // special character
    .required('Password is required'),                                                        // cannot be empty

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match') // must match password field
    .required('Please confirm your password'),            // cannot be empty
});

/* =========================
   STEP 3: Register Component
   ========================= */
const Register: React.FC = () => {

  // Used for navigation between pages
  const navigate = useNavigate();

  // Controls password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Stores success message after registration
  const [successMessage, setSuccessMessage] = useState('');

  /* =========================
     STEP 4: Initial Values
     ========================= */
  const initialValues: RegisterFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  /* =========================
     STEP 5: Handle Form Submit
     ========================= */
  /* =========================
     STEP 5: Handle Form Submit
     ========================= */
  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  /* =========================
     STEP 6: UI Rendering
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

        {/* Show success message after registration */}
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
          Register
        </Typography>

        {/* =========================
            STEP 7: Formik Form
           ========================= */}
        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
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
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ marginBottom: 2, bgcolor: 'white' }}
                placeholder="you@example.com"
              />

              {/* PASSWORD FIELD */}
              <Field
                as={TextField}
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'} // show/hide password
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ marginBottom: 2, bgcolor: 'white' }}
                placeholder="Min 8 chars, uppercase, lowercase, number, special char"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle password visibility */}
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

              {/* CONFIRM PASSWORD FIELD */}
              <Field
                as={TextField}
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'} // show/hide password
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ marginBottom: 2, bgcolor: 'white' }}
                placeholder="Re-enter your password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* Toggle password visibility */}
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

              {/* REGISTER BUTTON */}
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
                Register
              </Button>

            </Form>
          )}
        </Formik>

        {/* BACK TO LOGIN BUTTON */}
        <Button
          onClick={() => navigate('/login')}
          sx={{ color: 'black', textTransform: 'none' }}
        >
          Back
        </Button>

      </Paper>
    </Box>
  );
};

export default Register;
