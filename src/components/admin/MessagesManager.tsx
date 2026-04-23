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
import { useTranslations } from 'next-intl';

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
    return new Intl.DateTimeFormat('uk-UA', {
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#004975', mb: 2 }}>
          {t('title')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Paper sx={{ px: 5, py: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MailOutline sx={{ color: '#d32f2f' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('stats.new')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {stats.newCount}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ color: '#1976d2' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('stats.read')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {stats.readCount}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ color: '#757575' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t('stats.archived')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flex: 1, minWidth: 200 }}
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
          />
          
          <FormControl sx={{ minWidth: 150 }}>
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
        </Box>

        {(searchQuery || statusFilter !== 'all') && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('search.resultsFound')} {filteredMessages.length}
            </Typography>
          </Box>
        )}
      </Paper>

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

      {filteredMessages.length > 0 && (
        <TablePagination
          component={Paper}
          sx={{ boxShadow: 1 }}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
          count={filteredMessages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('pagination.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} ${t('pagination.of')} ${count}`
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
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {t('dialog.title')}
          </Typography>
          <IconButton onClick={() => setViewDialogOpen(false)} size="small">
            <Clear />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t('dialog.status')}
                </Typography>
                <FormControl fullWidth>
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
                <Typography variant="body1">
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
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <Typography variant="body1">
                    {selectedMessage.message}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialogOpen(false)}>
            {t('dialog.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}