'use client';

import { useState, useMemo } from 'react';
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
} from '@mui/material';
import { Search, Build } from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import { piezoContinentalInjectors } from '@/data/injectors/piezo-continental';
import Link from 'next/link';
import PrimaryButton from '@/components/shared/PrimaryButton'; 

export default function PiezoContinentalInjectorsPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [pressureFilter, setPressureFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');

  
  const uniquePressures = useMemo(() => {
    const pressures = piezoContinentalInjectors.map(inj => inj.specifications.pressure);
    return ['all', ...Array.from(new Set(pressures))];
  }, []);

  const uniqueVehicleBrands = useMemo(() => {
    const brands = new Set<string>();
    piezoContinentalInjectors.forEach(inj => {
      inj.vehicles.forEach(vehicle => {
        const brand = vehicle.split(' ')[0];
        brands.add(brand);
      });
    });
    return ['all', ...Array.from(brands)];
  }, []);

  
  const filteredInjectors = useMemo(() => {
    return piezoContinentalInjectors.filter(injector => {
      const matchesSearch = 
        injector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        injector.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        injector.vehicles.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPressure = 
        pressureFilter === 'all' || 
        injector.specifications.pressure === pressureFilter;

      const matchesVehicle = 
        vehicleFilter === 'all' || 
        injector.vehicles.some(v => v.startsWith(vehicleFilter));

      return matchesSearch && matchesPressure && matchesVehicle;
    });
  }, [searchQuery, pressureFilter, vehicleFilter]);

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
              <span>{t('piezoContinentalPage.breadcrumb')}</span>
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
            {t('piezoContinentalPage.title')}
          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            {t('piezoContinentalPage.subtitle')}
          </Typography>

          
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
                placeholder={t('piezoContinentalPage.searchPlaceholder')}
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
                <InputLabel>{t('piezoContinentalPage.filterPressure')}</InputLabel>
                <Select
                  value={pressureFilter}
                  label={t('piezoContinentalPage.filterPressure')}
                  onChange={(e) => setPressureFilter(e.target.value)}
                >
                  {uniquePressures.map((pressure) => (
                    <MenuItem key={pressure} value={pressure}>
                      {pressure === 'all' ? t('piezoContinentalPage.filterAll') : pressure}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{t('piezoContinentalPage.filterVehicle')}</InputLabel>
                <Select
                  value={vehicleFilter}
                  label={t('piezoContinentalPage.filterVehicle')}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                >
                  {uniqueVehicleBrands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand === 'all' ? t('piezoContinentalPage.filterAll') : brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {(searchQuery || pressureFilter !== 'all' || vehicleFilter !== 'all') && (
              <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {t('piezoContinentalPage.activeFilters')}
                </Typography>
                {searchQuery && (
                  <Chip
                    label={`${t('piezoContinentalPage.activeSearch')} ${searchQuery}`}
                    onDelete={() => setSearchQuery('')}
                    color="primary"
                    size="small"
                  />
                )}
                {pressureFilter !== 'all' && (
                  <Chip
                    label={`${t('piezoContinentalPage.activePressure')} ${pressureFilter}`}
                    onDelete={() => setPressureFilter('all')}
                    color="primary"
                    size="small"
                  />
                )}
                {vehicleFilter !== 'all' && (
                  <Chip
                    label={`${t('piezoContinentalPage.activeVehicle')} ${vehicleFilter}`}
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
                  {t('piezoContinentalPage.resetAll')}
                </Button>
              </Box>
            )}
          </Card>

          
          <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
            {t('piezoContinentalPage.foundPrefix')}{' '}
            {filteredInjectors.length}{' '}
            {filteredInjectors.length === 1
              ? t('piezoContinentalPage.injectorNounSingular')
              : t('piezoContinentalPage.injectorNounPlural')}
          </Typography>

          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', m: -1.5 }}>
            {filteredInjectors.map((injector) => (
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
                    image={injector.image}
                    alt={injector.name}
                    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 'bold', color: '#004975', mb: 1 }}
                    >
                      {injector.name}
                    </Typography>

                    <Chip
                      label={`${t('piezoContinentalPage.partNumber')} ${injector.partNumber}`}
                      size="small"
                      sx={{
                        mb: 2,
                        backgroundColor: '#E3F2FD',
                        color: '#004975',
                        fontWeight: 600,
                        alignSelf: 'flex-start',
                      }}
                    />

               

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                        <strong>{t('piezoContinentalPage.specPressure')}</strong> {injector.specifications.pressure}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 0.5 }}>
                        <strong>{t('piezoContinentalPage.specFlow')}</strong> {injector.specifications.flowRate}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
                        <strong>{t('piezoContinentalPage.specVoltage')}</strong> {injector.specifications.voltage}
                      </Typography>
                    </Box>

                    
                    <Box sx={{ mb: 2, flexGrow: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#004975', display: 'block', mb: 1 }}>
                        {t('piezoContinentalPage.specFits')}
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

                    
                    <PrimaryButton
                      fullWidth
                      startIcon={<Build />}
                      sx={{
                        mt: 'auto',
                      }}
                      href={`/${locale}/contact`}
                    >
                      {t('piezoContinentalPage.orderButton')}
                    </PrimaryButton>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          
          {filteredInjectors.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {t('piezoContinentalPage.noResultsTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('piezoContinentalPage.noResultsSubtitle')}
              </Typography>
              
              
              <PrimaryButton
                onClick={() => {
                  setSearchQuery('');
                  setPressureFilter('all');
                  setVehicleFilter('all');
                }}
              >
                {t('piezoContinentalPage.resetFilters')}
              </PrimaryButton>
            </Box>
          )}
        </Container>
      </Box>
    </main>
  );
}