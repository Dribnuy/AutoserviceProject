'use client';

import { Container, Box, Typography, Button, Stack } from '@mui/material';
import FirebaseTest from '@/components/FirebaseText';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext'; 

export default function TestPage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <Box sx={{ py: 8, backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#004975',
              mb: 6,
            }}
          >
            Firebase Testing
          </Typography>

          {!user && (
            <Box sx={{ mb: 4 }}>
              <AuthForm />
            </Box>
          )}

         
          {user && (
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="h6">
                Вітаємо, {user.displayName || user.email}!
              </Typography>
              <Button variant="contained" color="secondary" onClick={logout}>
                Вийти
              </Button>
            </Box>
          )}

          <FirebaseTest />
        </Container>
      </Box>
    </main>
  );
}