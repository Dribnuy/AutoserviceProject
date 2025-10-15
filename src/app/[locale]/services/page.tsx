import Services from '../../../components/Services';
import { Container, Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function ServicesPage() {
  return (
    <main>
      <Box sx={{ py: 4, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#004975',
              mb: 4,
            }}
          >
            Наші послуги
          </Typography>
        </Container>
      </Box>
      <Services />
    </main>
  );
}
