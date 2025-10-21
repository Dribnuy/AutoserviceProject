'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  CircularProgress,
  Stack
} from '@mui/material';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
import { useAuth } from '@/context/AuthContext';

export default function FirebaseTest() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testFirestoreWrite = async () => {
    setLoading(true);
    setError('');
    setTestResult('');

    try {
      const testData = {
        message: 'Test message from Firebase',
        timestamp: serverTimestamp(),
        userId: user?.uid || 'anonymous',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'test_collection'), testData);
      setTestResult(`✅ Success! Document written with ID: ${docRef.id}`);
      console.log('Document written with ID:', docRef.id);
    } catch (err: any) {
      setError(`❌ Error writing document: ${err.message}`);
      console.error('Error adding document:', err);
    } finally {
      setLoading(false);
    }
  };

  const testFirestoreRead = async () => {
    setLoading(true);
    setError('');
    setTestResult('');

    try {
      const querySnapshot = await getDocs(collection(db, 'test_collection'));
      const count = querySnapshot.size;
      
      if (count > 0) {
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestResult(`✅ Success! Found ${count} documents in test_collection`);
        console.log('Documents:', docs);
      } else {
        setTestResult('⚠️ No documents found in test_collection');
      }
    } catch (err: any) {
      setError(`❌ Error reading documents: ${err.message}`);
      console.error('Error getting documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAuthConnection = () => {
    if (user) {
      setTestResult(`✅ Auth Connected! User: ${user.email}`);
    } else {
      setTestResult('⚠️ No user logged in');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
        Firebase Connection Test
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Test your Firebase connection and authentication
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={testAuthConnection}
          disabled={loading}
          sx={{ 
            backgroundColor: '#004975',
            '&:hover': { backgroundColor: '#003A5C' }
          }}
        >
          Test Authentication
        </Button>

        <Button
          variant="contained"
          onClick={testFirestoreWrite}
          disabled={loading}
          sx={{ 
            backgroundColor: '#004975',
            '&:hover': { backgroundColor: '#003A5C' }
          }}
        >
          Test Firestore Write
        </Button>

        <Button
          variant="contained"
          onClick={testFirestoreRead}
          disabled={loading}
          sx={{ 
            backgroundColor: '#004975',
            '&:hover': { backgroundColor: '#003A5C' }
          }}
        >
          Test Firestore Read
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {testResult && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {testResult}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {user && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Current User:
          </Typography>
          <Typography variant="body2">Email: {user.email}</Typography>
          <Typography variant="body2">UID: {user.uid}</Typography>
        </Box>
      )}
    </Paper>
  );
}