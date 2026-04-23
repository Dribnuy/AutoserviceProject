'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function HowItWorks() {
  const t = useTranslations('common.howItWorks');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    { key: 'diagnostics', icon: <SearchIcon sx={{ fontSize: 48, color: 'white' }} /> },
    { key: 'assessment', icon: <AssignmentIcon sx={{ fontSize: 48, color: 'white' }} /> },
    { key: 'repair', icon: <BuildCircleIcon sx={{ fontSize: 48, color: 'white' }} /> },
    { key: 'testing', icon: <CheckCircleIcon sx={{ fontSize: 48, color: 'white' }} /> },
  ];

  return (
    <Box sx={{ py: 10, backgroundColor: '#F8F9FA' }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 'bold', color: '#004975', mb: 2 }}
        >
          {t('title')}
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 8 }}>
          {t('subtitle')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            gap: isMobile ? 5 : 8,
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.key}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #004975 0%, #0078C2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0, 73, 117, 0.3)',
                  '&::before': {
                    content: `"${(index + 1).toString().padStart(2, '0')}"`,
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    color: '#004975',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  },
                }}
              >
                {step.icon}
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  width: 230,
                  borderRadius: 3,
                  border: '2px solid #E3F2FD',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 8px 16px rgba(0,73,117,0.15)',
                    borderColor: '#004975',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: '#004975', fontWeight: 'bold', mb: 1 }}
                >
                  {t(`${step.key}.title`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`${step.key}.description`)}
                </Typography>
              </Paper>

              {index < steps.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: isMobile ? '50%' : '-130px',
                    top: isMobile ? '100%' : '45px',
                    width: isMobile ? '2px' : '200px',
                    height: isMobile ? '60px' : '2px',
                    border: '2px dashed #004975',
                    opacity: 0.4,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
