// Import React and useState hook for state management
import React, { useState } from 'react';

// Import Formik components for form handling
import { Formik, Form, Field } from 'formik';

// Import Yup for form validation
import * as Yup from 'yup';

// Import Material UI components for UI design
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';

// Import icons from Material UI
import { Delete, Edit } from '@mui/icons-material';

/* =========================
   TypeScript Interfaces
   ========================= */

// Structure of a single expense item
interface Expense {
  id: number;        // unique id for expense
  name: string;      // expense name
  cost: number;      // amount
  isIncome: boolean; // true if income, false if expense
}

// Structure of Formik form values
interface ExpenseFormValues {
  name: string;
  cost: string;
}

// Props coming from App.tsx
interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

/* =========================
   Yup Validation Schema
   ========================= */
const ExpenseSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),

  cost: Yup.number()
    .required('Cost is required')
    .positive('Cost must be positive')
    .typeError('Cost must be a number'),
});

/* =========================
   Dashboard Component
   ========================= */
/* =========================
   Dashboard Component
   ========================= */
import { useEffect } from 'react';

const Dashboard: React.FC<DashboardProps> = ({ setIsAuthenticated }) => {

  // Store base income value
  const [income, setIncome] = useState<number>(0);

  // Store all expenses in an array
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Store search text
  const [searchTerm, setSearchTerm] = useState('');

  // Used for editing income
  const [editingIncome, setEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const expensesRes = await fetch('/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (expensesRes.ok) {
        const expensesData = await expensesRes.json();
        setExpenses(expensesData.map((e: any) => ({
          id: e.id,
          name: e.name,
          cost: parseFloat(e.cost),
          isIncome: e.is_income
        })));
      }

      const incomeRes = await fetch('/api/income', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (incomeRes.ok) {
        const incomeData = await incomeRes.json();
        setIncome(incomeData.amount);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     Initial Form Values
     ========================= */
  const initialValues: ExpenseFormValues = {
    name: '',
    cost: '',
  };

  /* =========================
     Add Expense Function
     ========================= */
  /* =========================
     Add Expense Function
     ========================= */
  const handleAddExpense = async (
    values: ExpenseFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const isIncome = values.name.toLowerCase() === 'income';
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.name,
          cost: parseFloat(values.cost),
          isIncome,
        }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
        resetForm();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  /* =========================
     Delete Expense
     ========================= */
  /* =========================
     Delete Expense
     ========================= */
  const handleDeleteExpense = async (id: number) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setExpenses(expenses.filter((exp) => exp.id !== id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  /* =========================
     Calculations
     ========================= */

  // Calculate total spent (expenses only)
  const totalSpent = expenses
    .filter((exp) => !exp.isIncome)
    .reduce((sum, exp) => sum + exp.cost, 0);

  // Calculate total income (base income + income entries)
  const totalIncome =
    income +
    expenses
      .filter((exp) => exp.isIncome)
      .reduce((sum, exp) => sum + exp.cost, 0);

  // Remaining money
  const remaining = totalIncome - totalSpent;

  /* =========================
     Search Filter
     ========================= */
  const filteredExpenses = expenses.filter((exp) =>
    exp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =========================
     Edit Income
     ========================= */
  /* =========================
     Edit Income
     ========================= */
  const handleIncomeEdit = async () => {
    if (editingIncome && newIncome && parseFloat(newIncome) >= 0) {
      try {
        const response = await fetch('/api/income', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: parseFloat(newIncome) }),
        });

        if (response.ok) {
          setIncome(parseFloat(newIncome));
          setEditingIncome(false);
          setNewIncome('');
        }
      } catch (error) {
        console.error('Error updating income:', error);
      }
    } else {
      setEditingIncome(true);
      setNewIncome(income.toString());
    }
  };

  /* =========================
     Logout
     ========================= */
  const handleLogout = () => {
    setIsAuthenticated(false); // logout user
  };

  /* =========================
     UI Rendering
     ========================= */
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>

      {/* ===== TOP NAV BAR ===== */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>

          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ bgcolor: '#ef5350' }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* ===== SUMMARY CARDS ===== */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            mb: 4,
          }}
        >

          {/* INCOME CARD */}
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography>
                  Income: Rs {totalIncome.toFixed(2)}
                </Typography>

                {!editingIncome ? (
                  <Button onClick={handleIncomeEdit} startIcon={<Edit />}>
                    Edit
                  </Button>
                ) : (
                  <Box display="flex" gap={1}>
                    <TextField
                      size="small"
                      type="number"
                      value={newIncome}
                      onChange={(e) => setNewIncome(e.target.value)}
                    />
                    <Button onClick={handleIncomeEdit}>Save</Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* REMAINING CARD */}
          <Card sx={{ bgcolor: '#c8e6c9' }}>
            <CardContent>
              Remaining: Rs {remaining.toFixed(2)}
            </CardContent>
          </Card>

          {/* SPENT CARD */}
          <Card sx={{ bgcolor: '#bbdefb' }}>
            <CardContent>
              Spent: Rs {totalSpent.toFixed(2)}
            </CardContent>
          </Card>

        </Box>

        {/* ===== HISTORY ===== */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5">History</Typography>

          <TextField
            fullWidth
            placeholder="Search expenses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ my: 2 }}
          />

          <List>
            {filteredExpenses.length === 0 ? (
              <ListItem>
                <ListItemText primary="No expenses yet" />
              </ListItem>
            ) : (
              filteredExpenses.map((expense) => (
                <ListItem
                  key={expense.id}
                  secondaryAction={
                    <IconButton onClick={() => handleDeleteExpense(expense.id)}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText primary={expense.name} />
                  <Chip
                    label={`Rs ${expense.cost}`}
                    color={expense.isIncome ? 'success' : 'error'}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>

        {/* ===== ADD EXPENSE FORM ===== */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5">Add Expense</Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={ExpenseSchema}
            onSubmit={handleAddExpense}
          >
            {({ errors, touched }) => (
              <Form>

                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 2 }}
                />

                <Field
                  as={TextField}
                  name="cost"
                  label="Cost"
                  type="number"
                  fullWidth
                  error={touched.cost && Boolean(errors.cost)}
                  helperText={touched.cost && errors.cost}
                  sx={{ mb: 2 }}
                />

                <Button variant="contained" type="submit">
                  Save
                </Button>

              </Form>
            )}
          </Formik>
        </Paper>

      </Container>
    </Box>
  );
};

export default Dashboard;
