'use client';

import { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { ReadMore } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { db } from '../../../../config/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageURL: string;
  tags: string[];
  status: string;
  publishedAt: any;
  readTime?: string;
  category?: string;
}

export default function BlogPage() {
  const t = useTranslations('common.blog');
  const router = useRouter();
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');

  const categories = [
    'Всі',
    t('categories.diagnostics'),
    t('categories.repair'),
    t('categories.equipment'),
    t('categories.maintenance'),
    t('categories.analysis'),
    t('categories.economy'),
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const articlesQuery = query(
        collection(db, 'blogArticles'),
        where('status', '==', 'published'),
        where('locale', '==', 'uk'),
        orderBy('publishedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(articlesQuery);
      const articlesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogArticle[];
      
      setBlogArticles(articlesData);
    } catch (err) {
      console.error('Помилка завантаження статей:', err);
      setError('Не вдалося завантажити статті. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (slug: string) => {
    router.push(`/uk/blog/${slug}`);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    // Тут можна додати логіку фільтрації або завантаження статей по категорії
  };

  const getReadTime = (contentMD: string): string => {
    if (!contentMD) return '5 хв';
    const wordsPerMinute = 200;
    const words = contentMD.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} хв`;
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
                variant={category === selectedCategory ? 'filled' : 'outlined'}
                onClick={() => handleCategoryFilter(category)}
                sx={{
                  backgroundColor: category === selectedCategory ? '#004975' : 'transparent',
                  color: category === selectedCategory ? 'white' : '#004975',
                  borderColor: '#004975',
                  '&:hover': {
                    backgroundColor: category === selectedCategory ? '#003A5C' : '#E0F2FF',
                    color: category === selectedCategory ? 'white' : '#004975',
                  },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: category === selectedCategory ? 'bold' : 'normal',
                }}
              />
            ))}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#004975' }} />
            </Box>
          )}

          {!loading && !error && (
            <>
              {blogArticles.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Статей поки немає. Слідкуйте за оновленнями!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
                  gap: 4 
                }}>
                  {blogArticles.map((article) => (
                    <Box key={article.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 28px rgba(0, 73, 117, 0.2)',
                          }
                        }}
                        onClick={() => handleArticleClick(article.slug)}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={article.coverImageURL || '/images/blog/default.jpg'}
                          alt={article.title}
                          sx={{ objectFit: 'cover' }}
                        />

                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          {article.category && (
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
                          )}

                          <Typography 
                            variant="h6" 
                            gutterBottom 
                            sx={{ 
                              fontWeight: 'bold', 
                              color: '#004975', 
                              mb: 2,
                              minHeight: '64px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {article.title}
                          </Typography>

                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 3, 
                              lineHeight: 1.6,
                              minHeight: '72px',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {article.excerpt}
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, minHeight: '32px' }}>
                            {article.tags?.slice(0, 3).map((tag) => (
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
                            {formatDate(article.publishedAt)} • {article.readTime || '5 хв'}
                          </Typography>

                          <Divider sx={{ mb: 2 }} />

                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<ReadMore />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArticleClick(article.slug);
                            }}
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
              )}
            </>
          )}
        </Container>
      </Box>
    </main>
  );
}