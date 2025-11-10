'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import PrimaryButton from '@/components/shared/PrimaryButton';
import ManufacturerManager from '@/components/admin/ManufacturerManager';
import InjectorManager from '@/components/admin/InjectorManager';


const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const [accessKey, setAccessKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const urlKey = searchParams.get('key');
    const storedKey = localStorage.getItem('adminAccessKey');

    if (urlKey === ADMIN_ACCESS_KEY) {
      localStorage.setItem('adminAccessKey', urlKey);
      setIsAuthenticated(true);
      setLoading(false);
    } else if (storedKey === ADMIN_ACCESS_KEY) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleLogin = () => {
    if (accessKey === ADMIN_ACCESS_KEY) {
      localStorage.setItem('adminAccessKey', accessKey);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Невірний ключ доступу');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAccessKey');
    setIsAuthenticated(false);
    setAccessKey('');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ py: 8, backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold', textAlign: 'center' }}>
              Адмін-панель
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Введіть ключ доступу для входу в адмін-панель
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="password"
              label="Ключ доступу"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 3 }}
            />

            <PrimaryButton fullWidth onClick={handleLogin}>
              Увійти
            </PrimaryButton>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="caption">
                Для доступу використайте URL: /uk/admin?key=your-key
              </Typography>
            </Alert>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#004975', fontWeight: 'bold' }}>
            Адмін-панель
          </Typography>
          <PrimaryButton onClick={handleLogout} variant="outlined">
            Вийти
          </PrimaryButton>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }
            }}
          >
            <Tab label="Виробники" />
            <Tab label="Форсунки" />
            <Tab label="ТНВД" />
            <Tab label="Блог" />
          </Tabs>

          <TabPanel value={currentTab} index={0}>
            <ManufacturerManager />
          </TabPanel>
          
          <TabPanel value={currentTab} index={1}>
            <InjectorManager />
          </TabPanel>
          
          <TabPanel value={currentTab} index={2}>
            <Typography>Управління ТНВД (в розробці)</Typography>
          </TabPanel>
          
          <TabPanel value={currentTab} index={3}>
            <Typography>Управління блогом (в розробці)</Typography>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
