'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { ArrowBack, CalendarToday, Schedule, LocalOffer } from '@mui/icons-material';
import { db } from '../../../../../config/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMD: string;
  contentHTML?: string;
  coverImageURL: string;
  tags: string[];
  status: string;
  publishedAt: any;
  createdAt: any;
  updatedAt: any;
}

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    setError('');
    
    try {
      const articlesQuery = query(
        collection(db, 'blogArticles'),
        where('slug', '==', slug),
        where('status', '==', 'published'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(articlesQuery);
      
      if (querySnapshot.empty) {
        setError('Статтю не знайдено');
        setLoading(false);
        return;
      }
      
      const articleData = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      } as BlogArticle;
      
      setArticle(articleData);
      
      loadRelatedArticles(articleData.tags);
      
    } catch (err) {
      console.error('Помилка завантаження статті:', err);
      setError('Не вдалося завантажити статтю');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async (tags: string[]) => {
    try {
      if (!tags || tags.length === 0) return;
      
      const relatedQuery = query(
        collection(db, 'blogArticles'),
        where('status', '==', 'published'),
        where('tags', 'array-contains-any', tags.slice(0, 3)),
        limit(3)
      );
      
      const querySnapshot = await getDocs(relatedQuery);
      const articles = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(a => a.slug !== slug) as BlogArticle[];
      
      setRelatedArticles(articles.slice(0, 3));
    } catch (err) {
      console.error('Помилка завантаження схожих статей:', err);
    }
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

  const getReadTime = (contentMD: string): string => {
    if (!contentMD) return '5 хв';
    const wordsPerMinute = 200;
    const words = contentMD.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} хв читання`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress size={60} sx={{ color: '#004975' }} />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Статтю не знайдено'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => router.push('/uk/blog')}
          sx={{ backgroundColor: '#004975' }}
        >
          Повернутися до блогу
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => router.push('/uk')}
            sx={{ cursor: 'pointer' }}
          >
            Головна
          </Link>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => router.push('/uk/blog')}
            sx={{ cursor: 'pointer' }}
          >
            Блог
          </Link>
          <Typography color="text.primary">{article.title}</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/uk/blog')}
          sx={{ mb: 3, color: '#004975' }}
        >
          Повернутися до блогу
        </Button>

        <Card sx={{ mb: 4 }}>
          <Box
            component="img"
            src={article.coverImageURL}
            alt={article.title}
            sx={{
              width: '100%',
              maxHeight: 500,
              objectFit: 'cover',
            }}
          />

          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                color: '#004975',
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              {article.title}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, color: '#666' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: 18 }} />
                <Typography variant="body2">
                  {formatDate(article.publishedAt)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule sx={{ fontSize: 18 }} />
                <Typography variant="body2">
                  {getReadTime(article.contentMD)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              <LocalOffer sx={{ fontSize: 20, color: '#004975', mr: 1 }} />
              {article.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: '#E0F2FF',
                    color: '#004975',
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box
              sx={{
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: '#004975',
                  fontWeight: 'bold',
                  mt: 4,
                  mb: 2,
                },
                '& h2': {
                  fontSize: '1.75rem',
                  borderBottom: '2px solid #E0F2FF',
                  paddingBottom: 1,
                },
                '& h3': {
                  fontSize: '1.5rem',
                },
                '& p': {
                  lineHeight: 1.8,
                  mb: 2,
                  fontSize: '1.05rem',
                  color: '#333',
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2,
                },
                '& li': {
                  mb: 1,
                  lineHeight: 1.6,
                },
                '& a': {
                  color: '#004975',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#FF6B35',
                  },
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  my: 3,
                },
                '& code': {
                  backgroundColor: '#F5F5F5',
                  padding: '2px 6px',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                },
                '& pre': {
                  backgroundColor: '#F5F5F5',
                  padding: 2,
                  borderRadius: 2,
                  overflow: 'auto',
                  mb: 2,
                  '& code': {
                    padding: 0,
                    backgroundColor: 'transparent',
                  },
                },
                '& blockquote': {
                  borderLeft: '4px solid #004975',
                  pl: 2,
                  ml: 0,
                  fontStyle: 'italic',
                  color: '#666',
                },
              }}
            >
              {article.contentHTML ? (
                <div dangerouslySetInnerHTML={{ __html: article.contentHTML }} />
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {article.contentMD}
                </ReactMarkdown>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowBack />}
                onClick={() => router.push('/uk/blog')}
                sx={{
                  backgroundColor: '#004975',
                  '&:hover': {
                    backgroundColor: '#003A5C',
                  },
                }}
              >
                Повернутися до блогу
              </Button>
            </Box>
          </CardContent>
        </Card>

        {relatedArticles.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: '#004975',
                fontWeight: 'bold',
                mb: 3,
              }}
            >
              Схожі статті
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {relatedArticles.map((relatedArticle) => (
                <Card
                  key={relatedArticle.id}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 73, 117, 0.15)',
                    },
                  }}
                  onClick={() => router.push(`/uk/blog/${relatedArticle.slug}`)}
                >
                  <Box
                    component="img"
                    src={relatedArticle.coverImageURL}
                    alt={relatedArticle.title}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#004975',
                        fontWeight: 'bold',
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {relatedArticle.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {relatedArticle.excerpt}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}