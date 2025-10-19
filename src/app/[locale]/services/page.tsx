'use client';

import Services from '../../../components/Services';
import { 
  Container, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { useTranslations } from 'next-intl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BuildIcon from '@mui/icons-material/Build';

export default function ServicesPage() {
  const t = useTranslations('common.services.page');

  const injectorBrands = [
    { key: 'bosch', name: t('brands.bosch') },
    { key: 'piezo', name: t('brands.piezo') },
    { key: 'delphi', name: t('brands.delphi') },
    { key: 'denso', name: t('brands.denso') }
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
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <BuildIcon sx={{ 
                  fontSize: 48, 
                  color: '#004975',
                  mr: 2
                }} />
                <Box>
                  <Typography variant="h4" sx={{ 
                    color: '#004975', 
                    fontWeight: 'bold',
                    mb: 0.5
                  }}>
                    {t('injectorRepair')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('injectorRepairDesc')}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                {injectorBrands.map((brand, index) => (
                  <Accordion 
                    key={brand.key}
                    elevation={1}
                    sx={{ 
                      mb: 2,
                      '&:before': { display: 'none' },
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#004975',
                        transform: 'translateX(4px)',
                      },
                      '&.Mui-expanded': {
                        backgroundColor: '#f5f9fc',
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
                        minHeight: 64,
                        borderLeft: '4px solid transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          backgroundColor: '#f5f9fc',
                          borderLeftColor: '#004975'
                        },
                        '&.Mui-expanded': {
                          borderLeftColor: '#004975'
                        }
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
                      p: 3,
                      backgroundColor: '#fafafa',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <Typography variant="body1" sx={{ 
                        mb: 3, 
                        color: '#555',
                        lineHeight: 1.7
                      }}>
                        {t(`injectorBrands.${brand.key}.description`)}
                      </Typography>
                      <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          backgroundColor: '#004975',
                          px: 3,
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': { 
                            backgroundColor: '#003A5C',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        {t('learnMore')}
                      </Button>
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
