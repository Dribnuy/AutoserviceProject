
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { 
  PlayArrow, 
  Share, 
  Favorite, 
  Comment,
  OpenInNew,
  VideoLibrary
} from '@mui/icons-material';

export default function WorksPage() {
  const tiktokVideos = [
    {
      id: 1,
      title: 'Діагностика ТНВД',
      description: 'Процес діагностики топливного насоса високого тиску',
      thumbnail: '/images/tiktok-1.jpg',
      views: '12.5K',
      likes: '1.2K',
      comments: '89',
      duration: '0:45',
      tiktokUrl: 'https://www.tiktok.com/@remonttnvd/video/1234567890'
    },
    {
      id: 2,
      title: 'Ремонт плунжерних пар',
      description: 'Заміна плунжерних пар в ТНВД',
      thumbnail: '/images/tiktok-2.jpg',
      views: '8.7K',
      likes: '856',
      comments: '67',
      duration: '1:20',
      tiktokUrl: 'https://www.tiktok.com/@remonttnvd/video/1234567891'
    },
    {
      id: 3,
      title: 'Тестування після ремонту',
      description: 'Перевірка роботи ТНВД після ремонту',
      thumbnail: '/images/tiktok-3.jpg',
      views: '15.3K',
      likes: '2.1K',
      comments: '134',
      duration: '0:38',
      tiktokUrl: 'https://www.tiktok.com/@remonttnvd/video/1234567892'
    },
    {
      id: 4,
      title: 'Калібрування ТНВД',
      description: 'Налаштування тиску в топливному насосі',
      thumbnail: '/images/tiktok-4.jpg',
      views: '6.9K',
      likes: '743',
      comments: '45',
      duration: '1:05',
      tiktokUrl: 'https://www.tiktok.com/@remonttnvd/video/1234567893'
    },
    {
      id: 5,
      title: 'Обслуговування паливної системи',
      description: 'Чистка та обслуговування паливної системи',
      thumbnail: '/images/tiktok-5.jpg',
      views: '9.8K',
      likes: '1.1K',
      comments: '78',
      duration: '0:52',
      tiktokUrl: 'https://www.tiktok.com/@remonttnvd/video/1234567894'
    },
    {
      id: 6,
      title: 'Демонтаж ТНВД',
      description: 'Правильний демонтаж топливного насоса',
      thumbnail: '/images/tiktok-6.jpg',
      views: '11.2K',
      likes: '987',
      comments: '92',
      duration: '1:15',
      tiktokUrl: 'https://www.tiktok.com/@remonttnvd/video/1234567895'
    }
  ];

  return (
    <main>
      <Box sx={{ py: 8, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
              Наші роботи
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Дивіться наші роботи в TikTok та дізнавайтеся про процес ремонту ТНВД
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<VideoLibrary />}
              sx={{
                backgroundColor: '#000000',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                mb: 4,
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
              href="https://www.tiktok.com/@remonttnvd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Перейти до TikTok
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {tiktokVideos.map((video) => (
              <Box key={video.id}>
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
                  <Box
                    sx={{
                      position: 'relative',
                      height: 300,
                      backgroundImage: `url(${video.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      }
                    }}
                  >
                  
                    <IconButton
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#000000',
                        width: 60,
                        height: 60,
                        zIndex: 2,
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      href={video.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PlayArrow sx={{ fontSize: 30 }} />
                    </IconButton>

                    
                    <Chip
                      label={video.duration}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#004975' }}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {video.description}
                    </Typography>

                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Перегляди: {video.views}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Вподобайки: {video.likes}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Коментарі: {video.comments}
                      </Typography>
                    </Box>

                    {/* Кнопки дій */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<OpenInNew />}
                        href={video.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ flex: 1 }}
                      >
                        Дивитися
                      </Button>
                      <IconButton size="small" color="primary">
                        <Share />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 8, p: 4, backgroundColor: '#004975', borderRadius: 3 }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Підписуйтесь на наш TikTok!
            </Typography>
            <Typography variant="h6" sx={{ color: '#E0F2FF', mb: 3 }}>
              Щодня нові відео про ремонт ТНВД та корисні поради
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#FF6B35',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: '#E55A2B',
                },
              }}
              href="https://www.tiktok.com/@remonttnvd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Підписатися на TikTok
            </Button>
          </Box>
        </Container>
      </Box>
    </main>
  );
}
