'use client';

import { Box } from '@mui/material';
import ClientNavbar from '@/components/ClientNavbar';
import Footer from '@/components/Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <Box 
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <ClientNavbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default ClientLayout;
