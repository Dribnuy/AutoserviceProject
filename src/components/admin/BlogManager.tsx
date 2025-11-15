'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Visibility,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { db, storage } from '../../../config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslations } from 'next-intl';
import { PrimaryButton } from '../shared';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMD: string;
  contentHTML?: string;
  coverImageURL: string;
  tags: string[];
  locale: string;
  status: 'draft' | 'published';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  createdByUid: string;
}

export default function BlogManager() {
  const t = useTranslations('common.admin.blogManager');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    contentMD: '',
    contentHTML: '',
    coverImageURL: '/images/blog/default.jpg',
    tags: [] as string[],
    locale: 'uk',
    status: 'draft' as 'draft' | 'published',
  });

  const [newTag, setNewTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'blogArticles'));
      const articlesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogArticle[];

      articlesData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setArticles(articlesData);
    } catch (err) {
      setError(t('errors.load'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (article: BlogArticle | null = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        contentMD: article.contentMD || '',
        contentHTML: article.contentHTML || '',
        coverImageURL: article.coverImageURL || '/images/blog/default.jpg',
        tags: article.tags || [],
        locale: article.locale || 'uk',
        status: article.status || 'draft',
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        contentMD: '',
        contentHTML: '',
        coverImageURL: '/images/blog/default.jpg',
        tags: [],
        locale: 'uk',
        status: 'draft',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingArticle(null);
    setImageFile(null);
    setNewTag('');
  };

  const generateSlug = (title: string): string => {
    const translitMap: { [key: string]: string } = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'h',
      ґ: 'g',
      д: 'd',
      е: 'e',
      є: 'ye',
      ж: 'zh',
      з: 'z',
      и: 'y',
      і: 'i',
      ї: 'yi',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'kh',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'shch',
      ь: '',
      ю: 'yu',
      я: 'ya',
    };

    return title
      .toLowerCase()
      .split('')
      .map((char) => translitMap[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          coverImageURL: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File | null): Promise<string> => {
    if (!file) return formData.coverImageURL;

    try {
      const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (err) {
      console.error('Помилка завантаження зображення:', err);
      return formData.coverImageURL;
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.contentMD) {
      setError(t('errors.requiredFields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const imageURL = await uploadImage(imageFile);

      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        contentMD: formData.contentMD,
        contentHTML: formData.contentHTML,
        coverImageURL: imageURL,
        tags: formData.tags,
        locale: formData.locale,
        status: formData.status,
        updatedAt: Timestamp.now(),
        ...(formData.status === 'published' &&
          !editingArticle?.publishedAt && {
            publishedAt: Timestamp.now(),
          }),
      };

      if (editingArticle) {
        await updateDoc(
          doc(db, 'blogArticles', editingArticle.id),
          articleData
        );
        setSuccess(t('success.updated'));
      } else {
        await addDoc(collection(db, 'blogArticles'), {
          ...articleData,
          createdAt: Timestamp.now(),
          createdByUid: 'admin-1',
        });
        setSuccess(t('success.created'));
      }

      handleCloseDialog();
      loadArticles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(t('errors.save'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'blogArticles', id));
      setSuccess(t('success.deleted'));
      loadArticles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(t('errors.delete'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderCardsView = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      {articles.map((article) => (
        <Card
          key={article.id}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            transition: 'all 0.3s',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: { xs: '100%', sm: 200, md: 240 },
              height: { xs: 180, sm: 'auto' },
              objectFit: 'cover',
            }}
            image={article.coverImageURL}
            alt={article.title}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: 0,
            }}
          >
            <CardContent sx={{ flex: 1, pb: { xs: 1, sm: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 1.5,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Chip
                  label={
                    article.status === 'published'
                      ? t('status.published')
                      : t('status.draft')
                  }
                  size="small"
                  color={article.status === 'published' ? 'success' : 'default'}
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={article.locale.toUpperCase()}
                  size="small"
                  variant="outlined"
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 'auto' }}
                >
                  {article.publishedAt
                    ? new Date(
                        article.publishedAt.seconds * 1000
                      ).toLocaleDateString('uk-UA')
                    : t('status.notPublished')}
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                }}
              >
                {article.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: { xs: 2, sm: 3 },
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.5,
                }}
              >
                {article.excerpt}
              </Typography>

              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {article.tags?.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
                {article.tags?.length > 3 && (
                  <Chip
                    label={`+${article.tags.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
              </Box>
            </CardContent>

            <CardActions
              sx={{
                justifyContent: 'flex-end',
                px: 2,
                pb: 2,
                pt: 0,
                gap: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() =>
                  window.open(`/${article.locale}/blog/${article.slug}`, '_blank')
                }
                title={t('actions.view')}
                sx={{
                  color: '#004975',
                  '&:hover': { backgroundColor: 'rgba(0, 73, 117, 0.08)' },
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(article)}
                title={t('actions.edit')}
                sx={{
                  color: '#004975',
                  '&:hover': { backgroundColor: 'rgba(0, 73, 117, 0.08)' },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(article.id)}
                color="error"
                title={t('actions.delete')}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </CardActions>
          </Box>
        </Card>
      ))}
    </Box>
  );

  const renderTableView = () => (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        overflowX: 'auto',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: '#F5F7FA' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>
              {t('table.image')}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('table.title')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>
              {t('table.slug')}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>
              {t('table.tags')}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              {t('table.status')}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>
              {t('table.publishedAt')}
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
              {t('table.actions')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id} hover>
              <TableCell>
                <Box
                  component="img"
                  src={article.coverImageURL}
                  alt={article.title}
                  sx={{
                    width: { xs: 60, sm: 80 },
                    height: { xs: 40, sm: 50 },
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {article.title}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    backgroundColor: '#F0F4F8',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {article.slug}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {article.tags?.slice(0, 2).map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                  {article.tags?.length > 2 && (
                    <Chip
                      label={`+${article.tags.length - 2}`}
                      size="small"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    article.status === 'published'
                      ? t('status.published')
                      : t('status.draft')
                  }
                  color={article.status === 'published' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Typography variant="body2">
                  {article.publishedAt
                    ? new Date(
                        article.publishedAt.seconds * 1000
                      ).toLocaleDateString('uk-UA')
                    : t('status.notPublished')}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      window.open(`/${article.locale}/blog/${article.slug}`, '_blank')
                    }
                    title={t('actions.view')}
                    sx={{ color: '#004975' }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(article)}
                    title={t('actions.edit')}
                    sx={{ color: '#004975' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(article.id)}
                    color="error"
                    title={t('actions.delete')}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#004975' }}>
          {t('title', { count: articles.length })}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {!isMobile && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="cards">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="table">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          <PrimaryButton
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            fullWidth={isMobile}
          >
            {t('addNew')}
          </PrimaryButton>
        </Box>
      </Box>

      {loading && articles.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : articles.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: '#F8F9FA',
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary" variant="h6">
            {t('emptyState')}
          </Typography>
        </Paper>
      ) : isMobile || viewMode === 'cards' ? (
        renderCardsView()
      ) : (
        renderTableView()
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingArticle ? t('dialog.titleEdit') : t('dialog.titleNew')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label={t('form.title.label')}
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={t('form.title.placeholder')}
                sx={{ flex: 1 }}
              />

              <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                <InputLabel>{t('form.locale.label')}</InputLabel>
                <Select
                  value={formData.locale}
                  label={t('form.locale.label')}
                  onChange={(e) =>
                    setFormData({ ...formData, locale: e.target.value })
                  }
                >
                  <MenuItem value="uk">🇺🇦 Українська</MenuItem>
                  <MenuItem value="en">🇬🇧 English</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label={t('form.slug.label')}
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              helperText={t('form.slug.helper')}
              placeholder={t('form.slug.placeholder')}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('form.excerpt.label')}
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              helperText={t('form.excerpt.helper')}
              placeholder={t('form.excerpt.placeholder')}
            />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 'bold' }}
              >
                {t('form.cover.title')}
              </Typography>
              {formData.coverImageURL && (
                <Box
                  sx={{
                    mb: 1,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={formData.coverImageURL}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}
              <Button variant="outlined" component="label">
                {t('form.cover.button')}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1 }}
              >
                {t('form.cover.helper')}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={10}
              label={t('form.contentMD.label')}
              value={formData.contentMD}
              onChange={(e) =>
                setFormData({ ...formData, contentMD: e.target.value })
              }
              helperText={t('form.contentMD.helper')}
              placeholder={t('form.contentMD.placeholder')}
              sx={{ fontFamily: 'monospace' }}
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label={t('form.contentHTML.label')}
              value={formData.contentHTML}
              onChange={(e) =>
                setFormData({ ...formData, contentHTML: e.target.value })
              }
              helperText={t('form.contentHTML.helper')}
              placeholder={t('form.contentHTML.placeholder')}
              sx={{ fontFamily: 'monospace' }}
            />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 'bold' }}
              >
                {t('form.tags.title')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="filled"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  size="small"
                  label={t('form.tags.label')}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                  }
                  placeholder={t('form.tags.placeholder')}
                  sx={{ flexGrow: 1 }}
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  {t('form.tags.button')}
                </Button>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.status === 'published'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? 'published' : 'draft',
                    })
                  }
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {t('form.publish.label')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.status === 'published'
                      ? t('form.publish.helperPublished')
                      : t('form.publish.helperDraft')}
                  </Typography>
                </Box>
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            {t('dialog.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              backgroundColor: '#004975',
              '&:hover': { backgroundColor: '#003A5C' },
              minWidth: 120,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : editingArticle ? (
              t('dialog.update')
            ) : (
              t('dialog.create')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}