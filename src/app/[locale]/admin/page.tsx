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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PrimaryButton from '@/components/shared/PrimaryButton';
import ManufacturerManager from '@/components/admin/ManufacturerManager';
import InjectorManager from '@/components/admin/InjectorManager';
import BlogManager from '@/components/admin/BlogManager';
import WorksManager from '@/components/admin/WorksManager';
import { useTranslations } from 'next-intl';

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
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const t = useTranslations('common.admin');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
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
      setError(t('login.error'));
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#004975' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          py: { xs: 4, sm: 8 },
          px: { xs: 2, sm: 3 },
          backgroundColor: '#F8F9FA',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                gutterBottom
                sx={{
                  color: '#004975',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                {t('login.title')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                {t('login.subtitle')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              type="password"
              label={t('login.accessKeyLabel')}
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 3 }}
              autoFocus
            />

            <PrimaryButton fullWidth onClick={handleLogin} sx={{ py: 1.5 }}>
              {t('login.loginButton')}
            </PrimaryButton>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="caption">
                {t('login.accessHint')}
              </Typography>
            </Alert>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 },
        backgroundColor: '#F8F9FA',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: { xs: 3, md: 4 },
            p: { xs: 2, sm: 3 },
            backgroundColor: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{
                color: '#004975',
                fontWeight: 'bold',
                mb: 0.5,
              }}
            >
              {t('dashboard.title')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {t('dashboard.subtitle')}
            </Typography>
          </Box>
          <PrimaryButton
            onClick={handleLogout}
            variant="outlined"
            sx={{
              minWidth: { xs: '100%', sm: 120 },
              py: 1,
            }}
          >
            {t('dashboard.logoutButton')}
          </PrimaryButton>
        </Box>

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: '#fff',
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant={isTablet ? 'scrollable' : 'fullWidth'}
              scrollButtons={isTablet ? 'auto' : false}
              sx={{
                minHeight: { xs: 48, sm: 56 },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  minWidth: { xs: 100, sm: 120 },
                  minHeight: { xs: 48, sm: 56 },
                  py: { xs: 1, sm: 1.5 },
                  color: '#666',
                  transition: 'all 0.3s',
                  '&:hover': {
                    color: '#004975',
                    backgroundColor: 'rgba(0, 73, 117, 0.04)',
                  },
                },
                '& .Mui-selected': {
                  color: '#004975',
                  fontWeight: 700,
                },
              }}
              TabIndicatorProps={{
                sx: {
                  backgroundColor: '#004975',
                  height: 3,
                },
              }}
            >
              <Tab label={t('dashboard.tabs.blog')} />
              <Tab label={t('dashboard.tabs.manufacturers')} />
              <Tab label={t('dashboard.tabs.injectors')} />
              <Tab label={t('dashboard.tabs.fuelPumps')} />
            </Tabs>
          </Box>

          <Box sx={{ backgroundColor: '#fff' }}>
            <TabPanel value={currentTab} index={0}>
              <BlogManager />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <ManufacturerManager />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <InjectorManager />
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <WorksManager />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}