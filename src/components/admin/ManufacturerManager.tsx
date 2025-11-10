'use client';

import { useState, useEffect } from 'react';
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
  Paper,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import PrimaryButton from '@/components/shared/PrimaryButton';
import { useTranslations, useLocale } from 'next-intl';

interface Manufacturer {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
}

export default function ManufacturerManager() {
  const t = useTranslations('common.admin.manufacturerManager');
  const locale = useLocale();
  
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
  });

  useEffect(() => {
    loadManufacturers();
  }, []);

  const loadManufacturers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'manufacturers'));
      const data: Manufacturer[] = [];
      
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data()
        } as Manufacturer);
      });
      
      setManufacturers(data);
    } catch (err: any) {
      setError(t('errors.load') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.nameEn) {
        setError(t('errors.requiredFields'));
        return;
      }

      const manufacturerData = {
        name: formData.name,
        nameEn: formData.nameEn,
        description: formData.description,
        descriptionEn: formData.descriptionEn,
        updatedAt: serverTimestamp(),
      };

      if (editingManufacturer) {
        await updateDoc(doc(db, 'manufacturers', editingManufacturer.id), manufacturerData);
        setSuccess(t('success.updated'));
      } else {
        await addDoc(collection(db, 'manufacturers'), {
          ...manufacturerData,
          createdAt: serverTimestamp(),
        });
        setSuccess(t('success.created'));
      }

      setDialogOpen(false);
      resetForm();
      loadManufacturers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(t('errors.save') + ': ' + err.message);
    }
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setFormData({
      name: manufacturer.name,
      nameEn: manufacturer.nameEn,
      description: manufacturer.description || '',
      descriptionEn: manufacturer.descriptionEn || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteDoc(doc(db, 'manufacturers', id));
        setSuccess(t('success.deleted'));
        loadManufacturers();
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
      description: '',
      descriptionEn: '',
    });
    setEditingManufacturer(null);
  };

  const getLocalizedText = (manufacturer: Manufacturer, field: 'name' | 'description') => {
    if (field === 'name') {
      return locale === 'uk' ? manufacturer.name : manufacturer.nameEn;
    }
    return locale === 'uk' ? manufacturer.description : manufacturer.descriptionEn;
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004975' }}>
          {t('title')}
        </Typography>
        <PrimaryButton
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          {t('addNew')}
        </PrimaryButton>
      </Box>

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

      <Stack spacing={2}>
        {manufacturers.map((manufacturer) => (
          <Paper 
            key={manufacturer.id}
            sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              '&:hover': { backgroundColor: '#f9f9f9' }
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#004975', mb: 0.5 }}>
                {getLocalizedText(manufacturer, 'name')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {locale === 'uk' ? 'UK' : 'EN'}: {manufacturer.name} / {manufacturer.nameEn}
              </Typography>
              {getLocalizedText(manufacturer, 'description') && (
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  {getLocalizedText(manufacturer, 'description')}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleEdit(manufacturer)}
                sx={{ color: '#004975' }}
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(manufacturer.id)}
                sx={{ color: '#d32f2f' }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Stack>

      {manufacturers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {t('emptyState')}
          </Typography>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); resetForm(); }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingManufacturer ? t('dialog.titleEdit') : t('dialog.titleNew')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
              label={t('form.descriptionUk.label')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('form.descriptionUk.placeholder')}
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              label={t('form.descriptionEn.label')}
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              placeholder={t('form.descriptionEn.placeholder')}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); resetForm(); }}>
            {t('dialog.cancel')}
          </Button>
          <PrimaryButton onClick={handleSubmit}>
            {editingManufacturer ? t('dialog.update') : t('dialog.create')}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}