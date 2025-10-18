'use client';

import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, Divider } from '@mui/material';
import { LocationOn, Phone, Email, AccessTime } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('common.contact');

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
              mb: 6,
            }}
          >
            {t('title')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    {t('formTitle')}
                  </Typography>
                  <Box component="form" sx={{ mt: 3 }}>
                    <TextField
                      fullWidth
                      label={t('name')}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label={t('email')}
                      margin="normal"
                      variant="outlined"
                      type="email"
                    />
                    <TextField
                      fullWidth
                      label={t('phone')}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label={t('message')}
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 3,
                        backgroundColor: '#004975',
                        '&:hover': { backgroundColor: '#003A5C' }
                      }}
                    >
                      {t('send')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    {t('infoTitle')}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocationOn sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('addressLabel')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          {t('addressValue')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Phone sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('phoneLabel')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          {t('phoneValue')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Email sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('emailLabel')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          {t('emailValue')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('hoursLabel')}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ color: '#666' }}
                          dangerouslySetInnerHTML={{ __html: t('hoursValue') }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
          
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
              {t('mapTitle')}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 400,
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid #004975',
                mt: 3,
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.145930085517!2d29.550056772535566!3d48.83345857142481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d28165809d8b3b%3A0xb7d1ba8e7971e00b!2sRemont%20Tnvd!5e0!3m2!1sru!2sua!4v1760478269307!5m2!1sru!2sua"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RemontTnvd Location Map"
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </main>
  );
}
