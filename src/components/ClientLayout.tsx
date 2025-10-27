'use client';

import { Box } from '@mui/material';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <AuthProvider>
      <Box 
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <ClientNavbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </AuthProvider>
  );
};

export default ClientLayout;
