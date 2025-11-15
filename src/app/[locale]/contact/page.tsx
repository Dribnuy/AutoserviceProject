'use client';

import { Container, Typography, Box, Card, CardContent, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { LocationOn, Phone, Email, AccessTime } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

const contactSchema = yup.object({
  name: yup
    .string()
    .required('Ім\'я є обов\'язковим')
    .min(2, 'Ім\'я повинно містити мінімум 2 символи')
    .max(100, 'Ім\'я повинно містити максимум 100 символів'),
  email: yup
    .string()
    .required('Email є обов\'язковим')
    .email('Введіть коректний email'),
  phone: yup
    .string()
    .required('Телефон є обов\'язковим')
    .matches(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      'Введіть коректний номер телефону'
    ),
  message: yup
    .string()
    .required('Повідомлення є обов\'язковим')
    .min(10, 'Повідомлення повинно містити мінімум 10 символів')
    .max(1000, 'Повідомлення повинно містити максимум 1000 символів'),
}).required();

type ContactFormData = yup.InferType<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations('common.contact');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await addDoc(collection(db, 'messages'), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        status: 'new', 
        createdAt: serverTimestamp(),
      });

      setSuccess('Ваше повідомлення успішно відправлено! Ми зв\'яжемося з вами найближчим часом.');
      reset(); 

    
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Error saving message:', err);
      setError('Помилка при відправці повідомлення: ' + (err.message || 'Спробуйте пізніше'));
    } finally {
      setLoading(false);
    }
  };

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
            {t('title')}
          </Typography>

     
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
           
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    {t('formTitle')}
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                   
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t('name')}
                          margin="normal"
                          variant="outlined"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          disabled={loading}
                        />
                      )}
                    />

                
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t('email')}
                          margin="normal"
                          variant="outlined"
                          type="email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          disabled={loading}
                        />
                      )}
                    />

                   
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t('phone')}
                          margin="normal"
                          variant="outlined"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          disabled={loading}
                          placeholder="+380XXXXXXXXX"
                        />
                      )}
                    />

                  
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t('message')}
                          margin="normal"
                          variant="outlined"
                          multiline
                          rows={4}
                          error={!!errors.message}
                          helperText={errors.message?.message}
                          disabled={loading}
                        />
                      )}
                    />

                   
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        backgroundColor: '#004975',
                        '&:hover': { backgroundColor: '#003A5C' },
                        minWidth: 120,
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        t('send')
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
                    {t('infoTitle')}
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocationOn sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('addressLabel')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          {t('addressValue')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Phone sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('phoneLabel')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          {t('phoneValue1')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          {t('phoneValue2')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Email sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('emailLabel')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666' }}>
                          {t('emailValue')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ mr: 2, color: '#004975' }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {t('hoursLabel')}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ color: '#666' }}
                          dangerouslySetInnerHTML={{ __html: t('hoursValue') }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
          
          
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ color: '#004975', fontWeight: 'bold' }}>
              {t('mapTitle')}
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 400,
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid #004975',
                mt: 3,
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
        </Container>
      </Box>
    </main>
  );
}