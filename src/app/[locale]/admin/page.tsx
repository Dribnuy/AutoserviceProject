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
  Badge,
} from '@mui/material';
import PrimaryButton from '@/components/shared/PrimaryButton';
import ManufacturerManager from '@/components/admin/ManufacturerManager';
import InjectorManager from '@/components/admin/InjectorManager';
import BlogManager from '@/components/admin/BlogManager';
import WorksManager from '@/components/admin/WorksManager';
import MessagesManager from '@/components/admin/MessagesManager';
import { useTranslations } from 'next-intl';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

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
      {value === index && <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>{children}</Box>}
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
  const [newMessagesCount, setNewMessagesCount] = useState(0);

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

  useEffect(() => {
    if (isAuthenticated) {
      loadNewMessagesCount();
      const interval = setInterval(loadNewMessagesCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNewMessagesCount = async () => {
    try {
      const q = query(collection(db, 'messages'), where('status', '==', 'new'));
      const snapshot = await getDocs(q);
      setNewMessagesCount(snapshot.size);
    } catch (err) {
      console.error('Error loading new messages count:', err);
    }
  };

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
    if (newValue === 0) {
      loadNewMessagesCount();
    }
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
          py: { xs: 2, sm: 4, md: 8 },
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
              p: { xs: 2.5, sm: 4, md: 5 },
              borderRadius: { xs: 2, sm: 3 },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                gutterBottom
                sx={{
                  color: '#004975',
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                }}
              >
                {t('login.title')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.813rem', sm: '0.875rem' },
                }}
              >
                {t('login.subtitle')}
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.813rem', sm: '0.875rem' },
                }}
              >
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
              sx={{ 
                mb: 3,
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.938rem', sm: '1rem' },
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.938rem', sm: '1rem' },
                },
              }}
              autoFocus
            />

            <PrimaryButton 
              fullWidth 
              onClick={handleLogin} 
              sx={{ 
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '0.938rem', sm: '1rem' },
              }}
            >
              {t('login.loginButton')}
            </PrimaryButton>

            <Alert 
              severity="info" 
              sx={{ 
                mt: 3,
                '& .MuiAlert-message': {
                  fontSize: { xs: '0.75rem', sm: '0.813rem' },
                },
              }}
            >
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
        py: { xs: 1.5, sm: 3, md: 4, lg: 6 },
        px: { xs: 0.5, sm: 2, md: 3 },
        backgroundColor: '#F8F9FA',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 2 },
            mb: { xs: 1.5, sm: 3, md: 4 },
            p: { xs: 2, sm: 2, md: 3 },
            backgroundColor: '#fff',
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            mx: { xs: 0.5, sm: 0 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? 'h6' : 'h4'}
              sx={{
                color: '#004975',
                fontWeight: 'bold',
                mb: { xs: 0.25, sm: 0.5 },
                fontSize: { xs: '1.125rem', sm: '1.5rem', md: '2rem' },
              }}
            >
              {t('dashboard.title')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontSize: { xs: '0.813rem', sm: '0.875rem' },
              }}
            >
              {t('dashboard.subtitle')}
            </Typography>
          </Box>
          <PrimaryButton
            onClick={handleLogout}
            variant="outlined"
            sx={{
              minWidth: { xs: '100%', sm: 120 },
              py: { xs: 0.75, sm: 1 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {t('dashboard.logoutButton')}
          </PrimaryButton>
        </Box>

        <Paper
          elevation={2}
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden',
            mx: { xs: 0.5, sm: 0 },
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: '#fff',
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: { xs: 4, sm: 6 },
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#004975',
                borderRadius: 3,
              },
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : isTablet ? 'scrollable' : 'fullWidth'}
              scrollButtons={isMobile || isTablet ? 'auto' : false}
              allowScrollButtonsMobile
              sx={{
                minHeight: { xs: 48, sm: 48, md: 56 },
                '& .MuiTabs-scrollButtons': {
                  width: { xs: 32, sm: 40 },
                  color: '#004975',
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },
                '& .MuiTabs-flexContainer': {
                  gap: { xs: 0, sm: 0.5 },
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: { xs: '0.813rem', sm: '0.875rem', md: '1rem' },
                  fontWeight: 600,
                  minWidth: { xs: 'auto', sm: 100, md: 120 },
                  minHeight: { xs: 48, sm: 48, md: 56 },
                  px: { xs: 1.5, sm: 2, md: 2.5 },
                  py: { xs: 1, sm: 1, md: 1.5 },
                  color: '#666',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
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
                  height: { xs: 3, sm: 3 },
                },
              }}
            >
              <Tab 
                label={
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pr: newMessagesCount > 0 ? { xs: 2.5, sm: 3 } : 0,
                    }}
                  >
                    <span>
                      {t('dashboard.tabs.messages')}
                    </span>
                    {newMessagesCount > 0 && (
                      <Badge 
                        badgeContent={newMessagesCount} 
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: { xs: 2, sm: -1 },
                          right: { xs: 9, sm: 14 },
                          '& .MuiBadge-badge': {
                            fontSize: { xs: '0.625rem', sm: '0.7rem' },
                            height: { xs: 18, sm: 20 },
                            minWidth: { xs: 18, sm: 20 },
                            padding: { xs: '0 1px', sm: '0 5px' },
                            backgroundColor: '#004975',
                            fontWeight: 700,
                          },
                        }}
                      >
                        <span style={{ visibility: 'hidden', width: 0 }} />
                      </Badge>
                    )}
                  </Box>
                } 
              />
              <Tab label={t('dashboard.tabs.blog')} />
              <Tab label={t('dashboard.tabs.manufacturers')} />
              <Tab label={t('dashboard.tabs.injectors')} />
              <Tab label={t('dashboard.tabs.fuelPumps')} />
            </Tabs>
          </Box>

          <Box sx={{ backgroundColor: '#fff' }}>
            <TabPanel value={currentTab} index={0}>
              <MessagesManager />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <BlogManager />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <ManufacturerManager />
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <InjectorManager />
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <WorksManager />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}