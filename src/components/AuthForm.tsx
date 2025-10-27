'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  Paper,
  CircularProgress,
  Link,
  Stack
} from '@mui/material';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 

  const { signUp, signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Сталася помилка. Спробуйте ще раз.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Помилка входу через Google.');
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          {isLogin ? 'Вхід' : 'Реєстрація'}
        </Typography>
        
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          
          {error && <Alert severity="error">{error}</Alert>}
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </Button>

          <Button 
            variant="outlined" 
            fullWidth 
            onClick={handleGoogleSignIn} 
            disabled={loading}
          >
            Увійти через Google
          </Button>
          
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            sx={{ textAlign: 'center', mt: 2 }}
          >
            {isLogin 
              ? 'Немає акаунту? Зареєструватися' 
              : 'Вже є акаунт? Увійти'}
          </Link>
        </Stack>
      </Box>
    </Paper>
  );
}