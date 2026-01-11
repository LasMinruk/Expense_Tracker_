// Import React and useState hook
import React, { useState } from 'react';

// useNavigate is used to move between pages
import { useNavigate } from 'react-router-dom';

// Formik helps manage forms
import { Formik, Form, Field } from 'formik';

// Yup is used for validation rules
import * as Yup from 'yup';

// Material UI components for styling
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';

/* =========================
   STEP 1: Form Values Type
   ========================= */
// This interface defines the reset password form data
interface ResetPasswordFormValues {
  email: string; // user email
}

/* =========================
   STEP 2: Validation Schema
   ========================= */
// Validation rules for reset password form
const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')  // must be valid email
    .required('Email is required'), // cannot be empty
});

/* =========================
   STEP 3: ResetPassword Component
   ========================= */
const ResetPassword: React.FC = () => {

  // Used to navigate between pages
  const navigate = useNavigate();

  // Stores success message after sending reset link
  const [successMessage, setSuccessMessage] = useState('');

  /* =========================
     STEP 4: Initial Values
     ========================= */
  const initialValues: ResetPasswordFormValues = {
    email: '',
  };

  /* =========================
     STEP 5: Handle Form Submit
     ========================= */
  const handleSubmit = (values: ResetPasswordFormValues) => {
    console.log('Reset password for:', values.email);

    // Simulate sending password reset email
    setSuccessMessage('Password reset link sent to your email!');

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
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

        {/* Show success message after sending reset link */}
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
          Reset Password
        </Typography>

        {/* =========================
            STEP 7: Formik Form
           ========================= */}
        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
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

              {/* SUBMIT BUTTON */}
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
                Send Password Reset Link
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

export default ResetPassword;
