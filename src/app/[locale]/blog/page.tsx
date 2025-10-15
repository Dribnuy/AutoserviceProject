
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import { ReadMore } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

export default function BlogPage() {
  const t = useTranslations('common.blog');

  
  const blogArticles = [
    {
      id: 1,
      title: t('articles.1.title'),
      excerpt: t('articles.1.excerpt'),
      image: '/images/blog/diagnosis.jpg',
      date: '2025-10-15',
      readTime: t('articles.1.readTime'),
      category: t('articles.1.category'),
      tags: [t('tags.tnvd'), t('tags.diagnostics'), t('tags.repair')],
    },
    {
      id: 2,
      title: t('articles.2.title'),
      excerpt: t('articles.2.excerpt'),
      image: '/images/blog/mistakes.jpg',
      date: '2025-10-12',
      readTime: t('articles.2.readTime'),
      category: t('articles.2.category'),
      tags: [t('tags.tnvd'), t('tags.mistakes'), t('tags.tips')],
    },
    {
      id: 3,
      title: t('articles.3.title'),
      excerpt: t('articles.3.excerpt'),
      image: '/images/blog/equipment.jpg',
      date: '2025-10-09',
      readTime: t('articles.3.readTime'),
      category: t('articles.3.category'),
      tags: [t('tags.equipment'), t('tags.tools'), t('tags.tnvd')],
    },
    {
      id: 4,
      title: t('articles.4.title'),
      excerpt: t('articles.4.excerpt'),
      image: '/images/blog/maintenance.jpg',
      date: '2025-10-07',
      readTime: t('articles.4.readTime'),
      category: t('articles.4.category'),
      tags: [t('tags.maintenance'), t('tags.tnvd')],
    },
    {
      id: 5,
      title: t('articles.5.title'),
      excerpt: t('articles.5.excerpt'),
      image: '/images/blog/comparison.jpg',
      date: '2025-10-04',
      readTime: t('articles.5.readTime'),
      category: t('articles.5.category'),
      tags: [t('tags.comparison'), t('tags.manufacturers'), t('tags.tnvd')],
    },
    {
      id: 6,
      title: t('articles.6.title'),
      excerpt: t('articles.6.excerpt'),
      image: '/images/blog/fuel-economy.jpg',
      date: '2025-10-01',
      readTime: t('articles.6.readTime'),
      category: t('articles.6.category'),
      tags: [t('tags.economy'), t('tags.fuel'), t('tags.tnvd')],
    },
  ];

  const categories = [
    t('categories.all'),
    t('categories.diagnostics'),
    t('categories.repair'),
    t('categories.equipment'),
    t('categories.maintenance'),
    t('categories.analysis'),
    t('categories.economy'),
  ];

  return (
    <main>
      <Box sx={{ py: 8, backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
              {t('title')}
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              {t('subtitle')}
            </Typography>
          </Box>

          <Box sx={{ mb: 6, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                variant={category === 'Всі' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: category === 'Всі' ? '#004975' : 'transparent',
                  color: category === 'Всі' ? 'white' : '#004975',
                  borderColor: '#004975',
                  '&:hover': {
                    backgroundColor: category === 'Всі' ? '#003A5C' : '#004975',
                    color: 'white',
                  },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 4 }}>
            {blogArticles.map((article) => (
              <Box key={article.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 73, 117, 0.15)',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.image}
                    alt={article.title}
                    sx={{ objectFit: 'cover' }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Chip
                      label={article.category}
                      size="small"
                      sx={{
                        backgroundColor: '#004975',
                        color: 'white',
                        mb: 2,
                        fontWeight: 'bold',
                      }}
                    />

                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#004975', mb: 2 }}>
                      {article.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {article.excerpt}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {article.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            borderColor: '#E0E0E0',
                            color: '#666',
                          }}
                        />
                      ))}
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      {new Date(article.date).toLocaleDateString('uk-UA')} • {article.readTime}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ReadMore />}
                      sx={{
                        backgroundColor: '#004975',
                        '&:hover': {
                          backgroundColor: '#003A5C',
                        },
                      }}
                    >
                      {t('buttons.readArticle')}
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>

          
          <Box sx={{ textAlign: 'center', mt: 8, p: 4, backgroundColor: '#004975', borderRadius: 3 }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              Підписуйтесь на оновлення блогу!
            </Typography>
            <Typography variant="h6" sx={{ color: '#E0F2FF', mb: 3 }}>
              Отримуйте нові статті про ремонт ТНВД прямо на пошту
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
            >
              Підписатися на розсилку
            </Button>
          </Box>
        </Container>
      </Box>
    </main>
  );
}
