'use client';

import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('common.about');

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
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            <Box>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    {t('ourStory')}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#666' }}>
                    {t('storyText')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    {t('ourAdvantages')}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      ✓ {t('advantages.modernEquipment')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      ✓ {t('advantages.experiencedMasters')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      ✓ {t('advantages.warranty')}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      ✓ {t('advantages.fastService')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </main>
  );
}
