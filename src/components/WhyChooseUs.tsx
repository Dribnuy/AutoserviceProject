'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function WhyChooseUs() {
  const t = useTranslations('common.whyChooseUs');
  const [index, setIndex] = useState(0);

  const features = [
    {
      key: 'quality',
      icon: <VerifiedIcon sx={{ fontSize: 80, color: '#004975' }} />,
    },
    {
      key: 'speed',
      icon: <SpeedIcon sx={{ fontSize: 80, color: '#004975' }} />,
    },
    {
      key: 'experience',
      icon: <SupportAgentIcon sx={{ fontSize: 80, color: '#004975' }} />,
    },
    {
      key: 'price',
      icon: <PriceCheckIcon sx={{ fontSize: 80, color: '#004975' }} />,
    },
  ];

  const next = () => setIndex((prev) => (prev + 1) % features.length);
  const prev = () => setIndex((prev) => (prev - 1 + features.length) % features.length);

  const feature = features[index];

  return (
    <Box sx={{ py: 10, backgroundColor: 'white', position: 'relative' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 'bold', color: '#004975', mb: 2 }}
        >
          {t('title')}
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          {t('subtitle')}
        </Typography>

        <Box sx={{ position: 'relative', height: 350 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                width: '100%',
                top: 0,
                left: 0,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 5,
                  borderRadius: 4,
                  border: '2px solid #E3F2FD',
                  textAlign: 'center',
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(0,73,117,0.15)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>

                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#004975' }}>
                  {t(`${feature.key}.title`)}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ color: '#004975', fontWeight: 600, mt: 1 }}
                >
                  {t(`${feature.key}.stat`)}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2, maxWidth: 500 }}
                >
                  {t(`${feature.key}.description`)}
                </Typography>
              </Paper>
            </motion.div>
          </AnimatePresence>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 4 }}>
          <IconButton onClick={prev} sx={{ color: '#004975' }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton onClick={next} sx={{ color: '#004975' }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
