

import { Container, Typography, Box, Card, CardContent } from '@mui/material';

export default function AboutPage() {
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
            Про нас
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            <Box>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    Наша історія
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#666' }}>
                    Ми працюємо на ринку автосервісу понад 10 років. Наша команда кваліфікованих майстрів забезпечує якісний ремонт та обслуговування автомобілів різних марок та моделей.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            
            <Box>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    Наші переваги
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      Сучасне обладнання
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      Досвідчені майстри
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      Гарантія на роботи
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                      Швидкий сервіс
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
