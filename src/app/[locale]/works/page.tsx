'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Dialog,
  IconButton,
} from '@mui/material';
import { 
  Close as CloseIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { Work } from '@/types/works';
import { Timestamp } from 'firebase/firestore';

export default function WorksPage() {
  const t = useTranslations('common.works');
  const locale = useLocale();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [openGallery, setOpenGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadWorks();
  }, [locale]);

  const loadWorks = async () => {
    try {
      setLoading(true);
      const worksRef = collection(db, 'works');
      const q = query(
        worksRef,
        where('locale', '==', locale),
        where('status', '==', 'published'),
        orderBy('workDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const worksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Work));
      
      setWorks(worksData);
    } catch (err: any) {
      console.error('Error loading works:', err);
      setError('Помилка завантаження робіт');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGallery = (work: Work, startIndex: number = 0) => {
    setSelectedWork(work);
    setCurrentImageIndex(startIndex);
    setOpenGallery(true);
  };

  const handleCloseGallery = () => {
    setOpenGallery(false);
    setSelectedWork(null);
    setCurrentImageIndex(0);
  };

  const formatDate = (date: Timestamp | Date) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return new Date(date).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <main>
      <Box sx={{ py: 8, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
              {t('title')}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              {locale === 'uk' 
                ? 'Наші виконані роботи з ремонту форсунок та ТНВД' 
                : 'Our completed works on injector and fuel pump repair'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {works.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                {locale === 'uk' ? 'Поки що немає опублікованих робіт' : 'No published works yet'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {works.map((work) => (
                <Grid item xs={12} md={6} key={work.id}>
                  <Card
                    sx={{
                      height: '100%', 
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0, 73, 117, 0.2)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', height: 250 }}>
                      <Box
                        sx={{
                          flex: 1,
                          position: 'relative',
                          cursor: 'pointer',
                          '&::after': {
                            content: '"ДО"',
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }
                        }}
                        onClick={() => handleOpenGallery(work, 0)}
                      >
                        {work.beforeImageURLs.length > 0 ? (
                          <CardMedia
                            component="img"
                            height="100%"
                            image={work.beforeImageURLs[0]}
                            alt="До ремонту"
                            sx={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">Немає фото</Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <Box
                        sx={{
                          flex: 1,
                          position: 'relative',
                          cursor: 'pointer',
                          '&::after': {
                            content: '"ПІСЛЯ"',
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(0, 119, 0, 0.7)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }
                        }}
                        onClick={() => handleOpenGallery(work, work.beforeImageURLs.length)}
                      >
                        {work.afterImageURLs.length > 0 ? (
                          <CardMedia
                            component="img"
                            height="100%"
                            image={work.afterImageURLs[0]}
                            alt="Після ремонту"
                            sx={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ height: '100%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">Немає фото</Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#004975' }}>
                        {work.title}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          <strong>Автомобіль:</strong> {work.vehicleMake} {work.vehicleModel} {work.vehicleYear}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          <strong>Дата:</strong> {formatDate(work.workDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          <strong>Клієнт:</strong> {work.customerInitials}
                        </Typography>
                      </Box>

                      {work.services.length > 0 && (
                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {work.services.map((service, idx) => (
                            <Chip
                              key={idx}
                              label={service}
                              size="small"
                              sx={{
                                backgroundColor: '#E3F2FD',
                                color: '#004975',
                                fontWeight: 600,
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      {work.testimonial && (
                        <Box 
                          sx={{ 
                            mt: 2, 
                            p: 2, 
                            backgroundColor: '#F8F9FA', 
                            borderRadius: 2,
                            borderLeft: '4px solid #004975'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StarIcon sx={{ color: '#FFB400', fontSize: 20, mr: 0.5 }} />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#004975' }}>
                              Відгук клієнта
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
                            "{work.testimonial}"
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Dialog
        open={openGallery}
        onClose={handleCloseGallery}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000',
            color: '#fff',
          }
        }}
      >
        <IconButton
          onClick={handleCloseGallery}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {selectedWork && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {[...selectedWork.beforeImageURLs, ...selectedWork.afterImageURLs].map((url, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={url}
                  alt={`Фото ${idx + 1}`}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    display: currentImageIndex === idx ? 'block' : 'none',
                  }}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[...selectedWork.beforeImageURLs, ...selectedWork.afterImageURLs].map((url, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={url}
                  alt={`Thumb ${idx + 1}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: currentImageIndex === idx ? '3px solid #004975' : '3px solid transparent',
                    borderRadius: 1,
                    opacity: currentImageIndex === idx ? 1 : 0.6,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      opacity: 1,
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Dialog>
    </main>
  );
}