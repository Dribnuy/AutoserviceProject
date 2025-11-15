'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import BuildIcon from '@mui/icons-material/Build';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { useTranslations } from 'next-intl';

const Services = () => {
  const t = useTranslations('common.services');

  const services = [
    {
      title: t('diagnostics'),
      description: t('diagnostics_desc'),
      icon: (
        <TroubleshootIcon sx={{ fontSize: 56, color: '#004975' }} />
      ),
    },
    {
      title: t('repair'),
      description: t('repair_desc'),
      icon: (
        <BuildIcon sx={{ fontSize: 56, color: '#004975' }} />
      ),
    },
    {
      title: t('maintenance'),
      description: t('maintenance_desc'),
      icon: (
        <SettingsSuggestIcon sx={{ fontSize: 56, color: '#004975' }} />
      ),
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: '#F8F9FA' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#004975',
            mb: 6,
          }}
        >
          {t('title')}
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {services.map((service, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 25px rgba(0, 73, 117, 0.15)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {service.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    color: '#004975',
                    mb: 2,
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        
      </Container>
    </Box>
  );
};

export default Services;