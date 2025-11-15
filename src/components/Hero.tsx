'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Link from 'next/link';
const Hero = () => {
  const t = useTranslations('common.hero');
  const [currentSlide, setCurrentSlide] = useState(0);


  const galleryImages = [
    {
      id: 1,
      src: '/images/workshop-1.jpg',
      alt: 'Майстерня Тнвд',
      title: 'Наша майстерня',
      description: 'Сучасне обладнання для ремонту Тнвд'
    },
    {
      id: 2,
      src: '/images/workshop-2.jpg',
      alt: 'Діагностика Тнвд',
      title: 'Діагностика',
      description: 'Точна діагностика топливного насоса'
    },
    {
      id: 3,
      src: '/images/workshop-3.jpg',
      alt: 'Ремонт ТНВД',
      title: 'Ремонт',
      description: 'Якісний ремонт Тнвд'
    },
    {
      id: 4,
      src: '/images/workshop-4.jpg',
      alt: 'Тестування Тнвд',
      title: 'Тестування',
      description: 'Перевірка роботоспроможності після ремонту'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        {galleryImages.map((image, index) => (
          <Box
            key={image.id}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 73, 117, 0.6)',
              }
            }}
          />
        ))}
      </Box>

      
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: '#004975',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <ChevronRight />
      </IconButton>

      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          gap: 1,
        }}
      >
        {galleryImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', md: '3rem' },
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#E0F2FF',
            mb: 4,
            fontSize: { xs: '1.0rem', md: '1.5rem' },
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {t('subtitle')}
        </Typography>
        <Button
          component={Link}
          href="/contact"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#004975',
            color: 'white',
            px: 4,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: 3,
            
            '&:hover': {
              backgroundColor: '#008000',
              transform: 'translateY(-2px)',
             
            },
            transition: 'all 0.3s ease',
          }}
        >
          {t('cta')}
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;
