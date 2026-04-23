'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Divider,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import { Delete, Search, Clear, Visibility, MailOutline, CheckCircle, Schedule } from '@mui/icons-material';
import { 
  collection, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useTranslations, useLocale } from 'next-intl';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: Timestamp;
}

export default function MessagesManager() {
  const t = useTranslations('common.admin.messagesManager');
  const locale = useLocale();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const messagesSnapshot = await getDocs(q);
      const messagesData: Message[] = [];
      
      messagesSnapshot.forEach((doc) => {
        messagesData.push({
          id: doc.id,
          ...doc.data()
        } as Message);
      });
      
      setMessages(messagesData);
    } catch (err: any) {
      setError(t('errors.load') + ': ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = useMemo(() => {
    let filtered = messages;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((msg) => {
        const nameMatch = msg.name.toLowerCase().includes(query);
        const emailMatch = msg.email.toLowerCase().includes(query);
        const phoneMatch = msg.phone.toLowerCase().includes(query);
        const messageMatch = msg.message.toLowerCase().includes(query);
        
        return nameMatch || emailMatch || phoneMatch || messageMatch;
      });
    }

    return filtered;
  }, [messages, searchQuery, statusFilter]);

  const paginatedMessages = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredMessages.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredMessages, page, rowsPerPage]);

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

  const handleView = async (message: Message) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);

    if (message.status === 'new') {
      try {
        await updateDoc(doc(db, 'messages', message.id), {
          status: 'read'
        });
        loadMessages();
      } catch (err: any) {
        console.error('Error updating message status:', err);
      }
    }
  };

  const handleStatusChange = async (messageId: string, newStatus: 'new' | 'read' | 'archived') => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: newStatus
      });
      setSuccess(t('success.statusUpdated'));
      loadMessages();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(t('errors.updateStatus') + ': ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        setSuccess(t('success.deleted'));
        loadMessages();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(t('errors.delete') + ': ' + err.message);
      }
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      new: { label: t('status.new'), color: 'error' as const, icon: <MailOutline fontSize="small" /> },
      read: { label: t('status.read'), color: 'info' as const, icon: <CheckCircle fontSize="small" /> },
      archived: { label: t('status.archived'), color: 'default' as const, icon: <Schedule fontSize="small" /> },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const getMessageStats = () => {
    const newCount = messages.filter(m => m.status === 'new').length;
    const readCount = messages.filter(m => m.status === 'read').length;
    const archivedCount = messages.filter(m => m.status === 'archived').length;
    
    return { newCount, readCount, archivedCount };
  };

  const stats = getMessageStats();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderMobileCard = (message: Message) => (
    <Card 
      key={message.id}
      sx={{ 
        mb: 2,
        backgroundColor: message.status === 'new' ? 'rgba(211, 47, 47, 0.04)' : 'transparent',
        border: message.status === 'new' ? '1px solid rgba(211, 47, 47, 0.2)' : '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {message.name}
          </Typography>
          {getStatusChip(message.status)}
        </Box>

        <Stack spacing={1}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Email:
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {message.email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t('table.contact')}:
            </Typography>
            <Typography variant="body2">
              {message.phone}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t('table.message')}:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {message.message}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {formatDate(message.createdAt)}
          </Typography>
        </Stack>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => handleView(message)}
          sx={{ color: '#004975' }}
        >
          {t('actions.view')}
        </Button>
        <Button
          size="small"
          startIcon={<Delete />}
          onClick={() => handleDelete(message.id)}
          color="error"
        >
          {t('actions.delete')}
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          sx={{ fontWeight: 'bold', color: '#004975', mb: 2 }}
        >
          {t('title')}
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: isSmallMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 1.5
        }}>
          <Paper sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MailOutline sx={{ color: '#d32f2f', fontSize: isSmallMobile ? 20 : 24 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('stats.new')}
              </Typography>
              <Typography 
                variant={isSmallMobile ? "body1" : "h6"} 
                component="div"
                sx={{ fontWeight: 'bold' }}
              >
                {stats.newCount}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle sx={{ color: '#1976d2', fontSize: isSmallMobile ? 20 : 24 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('stats.read')}
              </Typography>
              <Typography 
                variant={isSmallMobile ? "body1" : "h6"} 
                component="div"
                sx={{ fontWeight: 'bold' }}
              >
                {stats.readCount}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ color: '#757575', fontSize: isSmallMobile ? 20 : 24 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('stats.archived')}
              </Typography>
              <Typography 
                variant={isSmallMobile ? "body1" : "h6"} 
                component="div"
                sx={{ fontWeight: 'bold' }}
              >
                {stats.archivedCount}
              </Typography>
            </Box>
          </Paper>
        </Box>
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

      <Paper sx={{ p: 2, mb: 2, boxShadow: 1 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            size={isMobile ? "small" : "medium"}
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
          />
          
          <FormControl fullWidth size={isMobile ? "small" : "medium"}>
            <InputLabel>{t('filter.status')}</InputLabel>
            <Select
              value={statusFilter}
              label={t('filter.status')}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">{t('filter.all')}</MenuItem>
              <MenuItem value="new">{t('status.new')}</MenuItem>
              <MenuItem value="read">{t('status.read')}</MenuItem>
              <MenuItem value="archived">{t('status.archived')}</MenuItem>
            </Select>
          </FormControl>

          {(searchQuery || statusFilter !== 'all') && (
            <Typography variant="caption" color="text.secondary">
              {t('search.resultsFound')} {filteredMessages.length}
            </Typography>
          )}
        </Stack>
      </Paper>

      {isMobile ? (
        <Box>
          {paginatedMessages.map(renderMobileCard)}
        </Box>
      ) : (
        
        <TableContainer component={Paper} sx={{ boxShadow: 1, mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('table.status')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('table.name')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('table.contact')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('table.message')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('table.date')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>{t('table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMessages.map((message) => (
                <TableRow 
                  key={message.id}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f9f9f9' },
                    '&:last-child td': { border: 0 },
                    backgroundColor: message.status === 'new' ? 'rgba(211, 47, 47, 0.04)' : 'transparent'
                  }}
                >
                  <TableCell>
                    {getStatusChip(message.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {message.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {message.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {message.phone}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography 
                      variant="body2" 
                      noWrap 
                      title={message.message}
                      sx={{ color: 'text.secondary' }}
                    >
                      {message.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(message.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleView(message)}
                        sx={{ color: '#004975' }}
                        title={t('actions.view')}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(message.id)}
                        sx={{ color: '#d32f2f' }}
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
      )}

      {filteredMessages.length > 0 && (
        <TablePagination
          component={Paper}
          sx={{ boxShadow: 1 }}
          rowsPerPageOptions={isMobile ? [5, 10, 15] : [5, 10, 15, 20, 25, 50]}
          count={filteredMessages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? '' : t('pagination.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => 
            isMobile ? `${from}-${to} / ${count}` : `${from}-${to} ${t('pagination.of')} ${count}`
          }
        />
      )}

      {filteredMessages.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchQuery || statusFilter !== 'all'
              ? t('search.noResults')
              : t('emptyState')
            }
          </Typography>
        </Box>
      )}

      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            {t('dialog.title')}
          </Typography>
          <IconButton onClick={() => setViewDialogOpen(false)} size="small">
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('dialog.status')}
                </Typography>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                  <Select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(
                      selectedMessage.id, 
                      e.target.value as 'new' | 'read' | 'archived'
                    )}
                  >
                    <MenuItem value="new">{t('status.new')}</MenuItem>
                    <MenuItem value="read">{t('status.read')}</MenuItem>
                    <MenuItem value="archived">{t('status.archived')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('dialog.name')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedMessage.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('dialog.email')}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ wordBreak: 'break-all' }}
                >
                  <a href={`mailto:${selectedMessage.email}`} style={{ color: '#004975' }}>
                    {selectedMessage.email}
                  </a>
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('dialog.phone')}
                </Typography>
                <Typography variant="body1">
                  <a href={`tel:${selectedMessage.phone}`} style={{ color: '#004975' }}>
                    {selectedMessage.phone}
                  </a>
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('dialog.date')}
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedMessage.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('dialog.message')}
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 2,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  <Typography variant="body2">
                    {selectedMessage.message}
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setViewDialogOpen(false)} fullWidth={isMobile}>
            {t('dialog.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}