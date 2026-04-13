'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Close, Search, Clear } from '@mui/icons-material';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../../../config/firebase';
import PrimaryButton from '@/components/shared/PrimaryButton';
import { useTranslations, useLocale } from 'next-intl';

interface Manufacturer {
  id: string;
  name: string;
  nameEn: string;
}

interface Injector {
  id: string;
  name: string;
  nameEn: string;
  partNumber: string;
  manufacturerId: string;
  manufacturerName?: string;
  image: string;
  vehicles: string[];
  description: string;
  descriptionEn: string;
  specifications: {
    pressure: string;
    flowRate: string;
    voltage: string;
  };
}

export default function InjectorManager() {
  const t = useTranslations('common.admin.injectorManager');
  const locale = useLocale();

  const [injectors, setInjectors] = useState<Injector[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInjector, setEditingInjector] = useState<Injector | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    partNumber: '',
    manufacturerId: '',
    vehicles: '',
    description: '',
    descriptionEn: '',
    pressure: '',
    flowRate: '',
    voltage: '12V',
    image: null as File | null,
    imageUrl: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const manufacturersSnapshot = await getDocs(collection(db, 'manufacturers'));
      const manufacturersData: Manufacturer[] = [];
      manufacturersSnapshot.forEach((doc) => {
        manufacturersData.push({
          id: doc.id,
          ...doc.data()
        } as Manufacturer);
      });
      setManufacturers(manufacturersData);

      const injectorsSnapshot = await getDocs(collection(db, 'injectors'));
      const injectorsData: Injector[] = [];
      injectorsSnapshot.forEach((doc) => {
        const data = doc.data();
        const manufacturer = manufacturersData.find(m => m.id === data.manufacturerId);
        injectorsData.push({
          id: doc.id,
          ...data,
          manufacturerName: manufacturer?.name || 'Unknown'
        } as Injector);
      });
      setInjectors(injectorsData);
    } catch (err: any) {
      setError(t('errors.load') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (item: Injector | Manufacturer, field: 'name' | 'description') => {
    if (field === 'name') {
      return locale === 'uk' ? item.name : item.nameEn;
    }
    if ('description' in item && 'descriptionEn' in item) {
       return locale === 'uk' ? item.description : item.descriptionEn;
    }
    return '';
  };

  const filteredInjectors = useMemo(() => {
    if (!searchQuery.trim()) return injectors;

    const query = searchQuery.toLowerCase().trim();
    
    return injectors.filter((injector) => {
      const nameMatch = injector.name.toLowerCase().includes(query) || 
                       injector.nameEn.toLowerCase().includes(query);
      const partNumberMatch = injector.partNumber.toLowerCase().includes(query);
      const manufacturerMatch = injector.manufacturerName?.toLowerCase().includes(query);
      const vehiclesMatch = injector.vehicles.some(v => v.toLowerCase().includes(query));
      const specsMatch = injector.specifications?.pressure?.toLowerCase().includes(query) ||
                        injector.specifications?.flowRate?.toLowerCase().includes(query) ||
                        injector.specifications?.voltage?.toLowerCase().includes(query);
      
      return nameMatch || partNumberMatch || manufacturerMatch || vehiclesMatch || specsMatch;
    });
  }, [injectors, searchQuery]);

  
  const paginatedInjectors = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredInjectors.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInjectors, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPage(0);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('errors.fileSize'));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError(t('errors.fileType'));
        return;
      }

      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url, image: null });
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `injectors/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setError('');

      if (!formData.name || !formData.partNumber || !formData.manufacturerId) {
        setError(t('errors.requiredFields'));
        setUploading(false);
        return;
      }

      let imageUrl = formData.imageUrl || '';
      
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const injectorData = {
        name: formData.name,
        nameEn: formData.nameEn,
        partNumber: formData.partNumber,
        manufacturerId: formData.manufacturerId,
        vehicles: formData.vehicles.split(',').map(v => v.trim()).filter(v => v),
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        specifications: {
          pressure: formData.pressure,
          flowRate: formData.flowRate,
          voltage: formData.voltage,
        },
        image: imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingInjector) {
        await updateDoc(doc(db, 'injectors', editingInjector.id), injectorData);
        setSuccess(t('success.updated'));
      } else {
        await addDoc(collection(db, 'injectors'), {
          ...injectorData,
          createdAt: serverTimestamp(),
        });
        setSuccess(t('success.created'));
      }

      setDialogOpen(false);
      resetForm();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(t('errors.save') + ': ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (injector: Injector) => {
    setEditingInjector(injector);
    setFormData({
      name: injector.name,
      nameEn: injector.nameEn,
      partNumber: injector.partNumber,
      manufacturerId: injector.manufacturerId,
      vehicles: injector.vehicles.join(', '),
      description: injector.description || '',
      descriptionEn: injector.descriptionEn || '',
      pressure: injector.specifications?.pressure || '',
      flowRate: injector.specifications?.flowRate || '',
      voltage: injector.specifications?.voltage || '12V',
      imageUrl: injector.image,
      image: null,
    });
    setImagePreview(injector.image);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteDoc(doc(db, 'injectors', id));
        setSuccess(t('success.deleted'));
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(t('errors.delete') + ': ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      partNumber: '',
      manufacturerId: '',
      vehicles: '',
      description: '',
      descriptionEn: '',
      pressure: '',
      flowRate: '',
      voltage: '12V',
      image: null,
      imageUrl: '',
    });
    setImagePreview('');
    setEditingInjector(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004975' }}>
          {t('title')}
        </Typography>
        <PrimaryButton
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          disabled={manufacturers.length === 0}
        >
          {t('addNew')}
        </PrimaryButton>
      </Box>

      {manufacturers.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('noManufacturers')}
        </Alert>
      )}

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

      
      <Paper sx={{ p: 2, mb: 2, boxShadow: 1 }}>
        <TextField
          fullWidth
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#004975' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={clearSearch} 
                  size="small"
                  title={t('search.clear')}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#004975',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#004975',
              },
            },
          }}
        />
        {searchQuery && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('search.resultsFound')} {filteredInjectors.length}
            </Typography>
            {filteredInjectors.length > 0 && (
              <Chip 
                label={searchQuery} 
                size="small" 
                onDelete={clearSearch}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Paper>

      <TableContainer component={Paper} sx={{ boxShadow: 1, mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('table.manufacturer')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('table.name')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('table.partNumber')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('table.pressure')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('table.vehicles')}</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>{t('table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInjectors.map((injector) => (
              <TableRow 
                key={injector.id}
                sx={{ 
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  '&:last-child td': { border: 0 }
                }}
              >
                <TableCell>{injector.manufacturerName}</TableCell>
                <TableCell>
                    {getLocalizedText(injector, 'name')}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {locale === 'uk' ? injector.nameEn : injector.name}
                    </Typography>
                </TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'inline-block',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    {injector.partNumber}
                  </Box>
                </TableCell>
                <TableCell>
                  {injector.specifications?.pressure || '-'}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', maxWidth: 200 }}>
                  <Typography noWrap title={injector.vehicles.join(', ')}>
                    {injector.vehicles.length > 0 ? injector.vehicles.join(', ') : '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(injector)}
                      sx={{ color: '#004975' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(injector.id)}
                      sx={{ color: '#d32f2f' }}
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

      
      {filteredInjectors.length > 0 && (
        <TablePagination
          component={Paper}
          sx={{ boxShadow: 1 }}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
          count={filteredInjectors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('pagination.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => 
            t('pagination.displayedRows', { from, to, count })
          }
        />
      )}

      {filteredInjectors.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchQuery 
              ? t('search.noResults')
              : (manufacturers.length > 0 ? t('emptyState') : '')
            }
          </Typography>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); resetForm(); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {editingInjector ? t('dialog.titleEdit') : t('dialog.titleNew')}
          </Typography>
          <IconButton onClick={() => { setDialogOpen(false); resetForm(); }} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>{t('form.manufacturer.label')}</InputLabel>
              <Select
                value={formData.manufacturerId}
                label={t('form.manufacturer.label')}
                onChange={(e) => setFormData({ ...formData, manufacturerId: e.target.value })}
              >
                {manufacturers.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {getLocalizedText(m, 'name')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label={t('form.nameUk.label')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('form.nameUk.placeholder')}
            />

            <TextField
              fullWidth
              label={t('form.nameEn.label')}
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              placeholder={t('form.nameEn.placeholder')}
            />
            
            <TextField
              fullWidth
              label={t('form.partNumber.label')}
              value={formData.partNumber}
              onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              placeholder={t('form.partNumber.placeholder')}
            />

            <TextField
              fullWidth
              label={t('form.vehicles.label')}
              value={formData.vehicles}
              onChange={(e) => setFormData({ ...formData, vehicles: e.target.value })}
              placeholder={t('form.vehicles.placeholder')}
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label={t('form.descriptionUk.label')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label={t('form.descriptionEn.label')}
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              multiline
              rows={2}
            />

            <Typography variant="subtitle2" sx={{ color: '#004975' }}>
              {t('form.specifications.title')}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              <TextField
                fullWidth
                label={t('form.specifications.pressure')}
                value={formData.pressure}
                onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                placeholder={t('form.specifications.pressurePlaceholder')}
              />
              
              <TextField
                fullWidth
                label={t('form.specifications.flowRate')}
                value={formData.flowRate}
                onChange={(e) => setFormData({ ...formData, flowRate: e.target.value })}
                placeholder={t('form.specifications.flowRatePlaceholder')}
              />
              
              <TextField
                fullWidth
                label={t('form.specifications.voltage')}
                value={formData.voltage}
                onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                placeholder={t('form.specifications.voltagePlaceholder')}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#004975' }}>
                {t('form.image.title')}
              </Typography>
              
              <TextField
                fullWidth
                label={t('form.image.urlLabel')}
                value={formData.imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder={t('form.image.urlPlaceholder')}
                helperText={t('form.image.urlHelper')}
              />
              
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center', position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 200, 
                      borderRadius: 8 
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image: null, imageUrl: '' });
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => { setDialogOpen(false); resetForm(); }} disabled={uploading}>
            {t('dialog.cancel')}
          </Button>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={uploading || !formData.name || !formData.partNumber}
          >
            {uploading ? <CircularProgress size={24} /> : (editingInjector ? t('dialog.update') : t('dialog.create'))}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}