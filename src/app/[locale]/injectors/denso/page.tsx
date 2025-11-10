'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Build } from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import PrimaryButton from '@/components/shared/PrimaryButton';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../../config/firebase';  

interface Injector {
  id: string;
  name: string;
  nameEn: string;
  partNumber: string;
  manufacturerId: string;
  image: string;
  vehicles: string[];
  description: string;
  descriptionEn: string;
  specifications: {
    pressure: string;
    flowRate: string;
    voltage: string;
  };
}

export default function DensoInjectorsPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [pressureFilter, setPressureFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [injectors, setInjectors] = useState<Injector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [densoManufacturerId, setDensoManufacturerId] = useState<string>('');

  useEffect(() => {
    const findDensoManufacturer = async () => {
      try {
        console.log('Шукаємо виробника Denso...');
        const manufacturersQuery = query(
          collection(db, 'manufacturers'),
          where('name', '==', 'Denso')
        );
        const manufacturersSnapshot = await getDocs(manufacturersQuery);
        
        if (!manufacturersSnapshot.empty) {
          const densoDoc = manufacturersSnapshot.docs[0];
          console.log('Знайдено Denso ID:', densoDoc.id);
          setDensoManufacturerId(densoDoc.id);
        } else {
          console.log('Виробника Denso не знайдено');
          setError('Виробника Denso не знайдено в базі даних');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Помилка пошуку виробника:', err);
        setError('Помилка пошуку виробника: ' + err.message);
        setLoading(false);
      }
    };

    findDensoManufacturer();
  }, []);

  useEffect(() => {
    if (!densoManufacturerId) {
      console.log(' Waiting for manufacturer ID...');
      return;
    }

    const loadInjectors = async () => {
      try {
        setLoading(true);
        
        const q = query(
          collection(db, 'injectors'),
          where('manufacturerId', '==', densoManufacturerId)
        );
        const querySnapshot = await getDocs(q);
        
      
        
        const injectorsData: Injector[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(' Документ:', doc.id, data);
          
          injectorsData.push({
            id: doc.id,
            name: data.name || '',
            nameEn: data.nameEn || '',
            partNumber: data.partNumber || '',
            manufacturerId: data.manufacturerId || '',
            image: data.image || '',
            vehicles: data.vehicles || [],
            description: data.description || '',
            descriptionEn: data.descriptionEn || '',
            specifications: {
              pressure: data.specifications?.pressure || '',
              flowRate: data.specifications?.flowRate || '',
              voltage: data.specifications?.voltage || '',
            },
          });
        });
        
        console.log('Завантажено форсунок:', injectorsData.length);
        setInjectors(injectorsData);
      } catch (err: any) {
        console.error('Помилка завантаження форсунок:', err);
        setError('Помилка завантаження форсунок: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInjectors();
  }, [densoManufacturerId]);

  const uniquePressures = useMemo(() => {
    const pressures = injectors.map(inj => inj.specifications?.pressure).filter(Boolean);
    return ['all', ...Array.from(new Set(pressures))];
  }, [injectors]);

  const uniqueVehicleBrands = useMemo(() => {
    const brands = new Set<string>();
    injectors.forEach(inj => {
      if (inj.vehicles && Array.isArray(inj.vehicles)) {
        inj.vehicles.forEach(vehicle => {
          const brand = vehicle.split(' ')[0];
          if (brand) brands.add(brand);
        });
      }
    });
    return ['all', ...Array.from(brands)];
  }, [injectors]);

  const filteredInjectors = useMemo(() => {
    return injectors.filter(injector => {
      const displayName = locale === 'en' ? injector.nameEn : injector.name;
      const matchesSearch = 
        displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        injector.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (injector.vehicles && injector.vehicles.some(v => v.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesPressure = 
        pressureFilter === 'all' || 
        injector.specifications?.pressure === pressureFilter;

      const matchesVehicle = 
        vehicleFilter === 'all' || 
        (injector.vehicles && injector.vehicles.some(v => v.startsWith(vehicleFilter)));

      return matchesSearch && matchesPressure && matchesVehicle;
    });
  }, [searchQuery, pressureFilter, vehicleFilter, injectors, locale]);

  if (loading) {
    return (
      <main>
        <Box sx={{ py: 8, backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ ml: 2 }}>Завантаження форсунок Denso...</Typography>
        </Box>
      </main>
    );
  }

  return (
    <main>
      <Box sx={{ py: 8, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              <Link href={`/${locale}`} style={{ textDecoration: 'none', color: '#004975' }}>
                {t('nav.home')}
              </Link>
              {' / '}
              <Link href={`/${locale}/services`} style={{ textDecoration: 'none', color: '#004975' }}>
                {t('nav.services')}
              </Link>
              {' / '}
              <span>{t('densoPage.breadcrumb')}</span>
            </Typography>
          </Box>

        
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#004975',
              mb: 2,
            }}
          >
            {t('densoPage.title')}
          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            {t('densoPage.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

     
          <Card sx={{ mb: 4, p: 3 }}>
            <Box
              component="div" 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
                gap: 3 
              }}
            >
              <TextField
                fullWidth
                placeholder={t('densoPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#004975' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#004975' },
                    '&.Mui-focused fieldset': { borderColor: '#004975' },
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>{t('densoPage.filterPressure')}</InputLabel>
                <Select
                  value={pressureFilter}
                  label={t('densoPage.filterPressure')}
                  onChange={(e) => setPressureFilter(e.target.value)}
                >
                  {uniquePressures.map((pressure) => (
                    <MenuItem key={pressure} value={pressure}>
                      {pressure === 'all' ? t('densoPage.filterAll') : pressure}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{t('densoPage.filterVehicle')}</InputLabel>
                <Select
                  value={vehicleFilter}
                  label={t('densoPage.filterVehicle')}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                >
                  {uniqueVehicleBrands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand === 'all' ? t('densoPage.filterAll') : brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {(searchQuery || pressureFilter !== 'all' || vehicleFilter !== 'all') && (
              <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('densoPage.activeFilters')}
                </Typography>
                {searchQuery && (
                  <Chip
                    label={`${t('densoPage.activeSearch')} ${searchQuery}`}
                    onDelete={() => setSearchQuery('')}
                    color="primary"
                    size="small"
                  />
                )}
                {pressureFilter !== 'all' && (
                  <Chip
                    label={`${t('densoPage.activePressure')} ${pressureFilter}`}
                    onDelete={() => setPressureFilter('all')}
                    color="primary"
                    size="small"
                  />
                )}
                {vehicleFilter !== 'all' && (
                  <Chip
                    label={`${t('densoPage.activeVehicle')} ${vehicleFilter}`}
                    onDelete={() => setVehicleFilter('all')}
                    color="primary"
                    size="small"
                  />
                )}
                <Button
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    setPressureFilter('all');
                    setVehicleFilter('all');
                  }}
                  sx={{ ml: 'auto' }}
                >
                  {t('densoPage.resetAll')}
                </Button>
              </Box>
            )}
          </Card>

          <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
            {t('densoPage.foundPrefix')}{' '}
            {filteredInjectors.length}{' '}
            {filteredInjectors.length === 1
              ? t('densoPage.injectorNounSingular')
              : t('densoPage.injectorNounPlural')}
          </Typography>

         
          <Box sx={{ display: 'flex', flexWrap: 'wrap', m: -1.5 }}>
            {filteredInjectors.map((injector) => {
              const displayName = locale === 'en' ? injector.nameEn : injector.name;
              
              return (
                <Box
                  key={injector.id}
                  sx={{
                    p: 1.5,
                    boxSizing: 'border-box',
                    width: { xs: '100%', sm: '50%', md: '33.333%' }
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 73, 117, 0.15)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={injector.image || '/images/injectors/placeholder.jpg'}
                      alt={displayName}
                      sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                    />
                    
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: '#004975', mb: 1 }}
                      >
                        {displayName}
                      </Typography>

                      <Chip
                        label={`${t('densoPage.partNumber')} ${injector.partNumber}`}
                        size="small"
                        sx={{
                          mb: 2,
                          backgroundColor: '#E3F2FD',
                          color: '#004975',
                          fontWeight: 600,
                          alignSelf: 'flex-start',
                        }}
                      />

                      
                      {injector.specifications && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                            <strong>{t('densoPage.specPressure')}</strong> {injector.specifications.pressure}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                            <strong>{t('densoPage.specFlow')}</strong> {injector.specifications.flowRate}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
                            <strong>{t('densoPage.specVoltage')}</strong> {injector.specifications.voltage}
                          </Typography>
                        </Box>
                      )}

                      
                      {injector.vehicles && injector.vehicles.length > 0 && (
                        <Box sx={{ mb: 2, flexGrow: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#004975', display: 'block', mb: 1 }}>
                            {t('densoPage.specFits')}
                          </Typography>
                          {injector.vehicles.map((vehicle, idx) => (
                            <Chip
                              key={idx}
                              label={vehicle}
                              size="small"
                              variant="outlined"
                              sx={{
                                mr: 0.5,
                                mb: 0.5,
                                fontSize: '0.7rem',
                                borderColor: '#E0E0E0',
                              }}
                            />
                          ))}
                        </Box>
                      )}

                   
                      <PrimaryButton
                        fullWidth
                        startIcon={<Build />}
                        sx={{
                          mt: 'auto',
                        }}
                        href={`/${locale}/contact`}
                      >
                        {t('densoPage.orderButton')}
                      </PrimaryButton>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>

         
          {filteredInjectors.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {t('densoPage.noResultsTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('densoPage.noResultsSubtitle')}
              </Typography>
              
              <PrimaryButton
                onClick={() => {
                  setSearchQuery('');
                  setPressureFilter('all');
                  setVehicleFilter('all');
                }}
              >
                {t('densoPage.resetFilters')}
              </PrimaryButton>
            </Box>
          )}
        </Container>
      </Box>
    </main>
  );
}