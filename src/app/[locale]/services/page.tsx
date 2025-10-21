'use client';

import Services from '../../../components/Services';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BuildIcon from '@mui/icons-material/Build';
import PrimaryButton from '@/components/shared/PrimaryButton';
import Link from 'next/link';

export default function ServicesPage() {
  const t = useTranslations('common.services.page');
  
  const locale = useLocale();

  
  const injectorBrands = [
    { key: 'bosch', name: t('brands.bosch'), path: 'bosch' },
    { key: 'piezo', name: t('brands.piezo'), path: 'piezo-continental' },
    { key: 'delphi', name: t('brands.delphi'), path: 'delphi' },
    { key: 'denso', name: t('brands.denso'), path: 'denso' }
  ];


  return (
    <main>
      <Box sx={{ py: 8, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
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
            {t('title')}
          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            {t('subtitle')}
          </Typography>

          <Card 
            elevation={2}
            sx={{ 
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden',
              borderTop: '4px solid #004975',
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4} }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <BuildIcon sx={{ 
                  fontSize: { xs: 36, md: 48 }, 
                  color: '#004975',
                  mr: 2
                }} />
                <Box>
                  <Typography variant="h4" component="h2" sx={{ 
                    color: '#004975', 
                    fontWeight: 'bold',
                    mb: 0.5,
                    fontSize: { xs: '1.75rem', md: '2.125rem' }
                  }}>
                    {t('injectorRepair')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('injectorRepairDesc')}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                {injectorBrands.map((brand) => (
                  <Accordion 
                    key={brand.key}
                    elevation={0} 
                    sx={{ 
                      mb: 2,
                      '&:before': { display: 'none' },
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        borderColor: '#004975',
                        boxShadow: '0 4px 12px rgba(0, 73, 117, 0.08)',
                      },
                      '&.Mui-expanded': {
                        backgroundColor: '#F8F9FA',
                        borderColor: '#004975',
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ 
                        color: '#004975',
                        fontSize: 28
                      }} />}
                      sx={{
                        py: 1, 
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                        },
                      }}
                    >
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: '#004975'
                      }}>
                        {brand.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ 
                      p: { xs: 2, md: 3 },
                      backgroundColor: 'white',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <Typography variant="body1" sx={{ 
                        mb: 3, 
                        color: '#555',
                        lineHeight: 1.7
                      }}>
                        {t(`injectorBrands.${brand.key}.description`)}
                      </Typography>
                      
                      
                      <PrimaryButton
                        component={Link}
                        href={`/${locale}/injectors/${brand.path}`}
                        endIcon={<ArrowForwardIcon />}
                      >
                        {t('learnMore')}
                      </PrimaryButton>

                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </CardContent>
          </Card>


        </Container>
      </Box>
      <Services />
    </main>
  );
}