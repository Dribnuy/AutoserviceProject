'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const ClientNavbar = dynamic(() => import("@/components/ClientNavbar"), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '64px', 
      backgroundColor: '#FFFFFF', 
      borderBottom: '1px solid #E0E0E0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      Loading...
    </div>
  )
});

const Footer = dynamic(() => import("@/components/Footer"), { 
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '100px', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      Loading...
    </div>
  )
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <Box 
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      suppressHydrationWarning
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
