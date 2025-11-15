'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';
import TelegramIcon from '@mui/icons-material/Telegram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('common.footer');

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1A1A1A',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
              KORZHINSKYISERVICE.COM
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#CCCCCC' }}>
              {t('rights')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component={Link}
                href="https://t.me/Hryhorii_Korzhinskyi"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#004975' }}
                aria-label="Telegram"
              >
                <TelegramIcon />
              </IconButton>
              <IconButton
                component={Link}
                href="https://www.tiktok.com/@grigoriy_korzhinskyi?_r=1&_t=ZM-91Hc1cKNoY0"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#004975' }}
                aria-label="TikTok"
              >
                <MusicNoteIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#004975' }}>
              {t('contactInfo')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, color: '#004975' }} />
              <Typography variant="body2" sx={{ color: '#CCCCCC' }}>
                {t('address')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, color: '#004975' }} />
              <Link href="tel:+380939679386" sx={{ color: '#CCCCCC', textDecoration: 'none' }}>
                {t('phone1')}
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, color: '#004975' }} />
              <Link href="tel:+380687235695" sx={{ color: '#CCCCCC', textDecoration: 'none' }}>
                {t('phone2')}
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, color: '#004975' }} />
              <Link href="mailto:info@remonttnvd.com" sx={{ color: '#CCCCCC', textDecoration: 'none' }}>
                {t('email')}
              </Link>
            </Box>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#004975' }}>
              {t('map')}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 200,
                borderRadius: 1,
                overflow: 'hidden',
                border: '2px solid #004975',
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
        </Box>

        <Box
          sx={{
            borderTop: '1px solid #333',
            mt: 3,
            pt: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#666' }}>
            © 2025 KorzhinskyiService.com. {t('rights')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
