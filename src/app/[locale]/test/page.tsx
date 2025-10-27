'use client';

import { Container, Box, Typography } from '@mui/material';
import FirebaseTest from '@/components/FirebaseText';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function TestPage() {
  const { user } = useAuth();

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

          <FirebaseTest />
        </Container>
      </Box>
    </main>
  );
}