
'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

const Navbar = () => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Виправлення гідратації
  useEffect(() => {
    setIsHydrated(true);
    console.log('Navbar locale:', locale);
    console.log('Navbar translations test:', {
      home: t('nav.home'),
      services: t('nav.services'),
      about: t('nav.about'),
      contact: t('nav.contact')
    });
    
    // Додаткова перевірка для UK локалі
    if (locale === 'uk') {
      console.log('UK locale in Navbar - checking translations:', {
        home: t('nav.home'),
        services: t('nav.services'),
        about: t('nav.about'),
        contact: t('nav.contact')
      });
    }
  }, [locale, t]);

  const navItems = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.services'), href: `/${locale}/services` },
    { label: t('nav.about'), href: `/${locale}/about` },
    { label: t('nav.works'), href: `/${locale}/works` },
    { label: t('nav.blog'), href: `/${locale}/blog` },
    { label: t('nav.contact'), href: `/${locale}/contact` },
  ];

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    if (!isHydrated) return;
    
    const newLocale = event.target.value;
    
    console.log('Language change initiated:', { 
      currentLocale: locale, 
      newLocale, 
      currentPath: pathname 
    });
    
    try {
      const currentPath = pathname || '/';
      let pathWithoutLocale = currentPath;
      
      // Remove current locale from path
      if (currentPath.startsWith(`/${locale}/`)) {
        pathWithoutLocale = currentPath.substring(`/${locale}`.length);
      } else if (currentPath === `/${locale}`) {
        pathWithoutLocale = '/';
      } else if (currentPath.startsWith(`/${locale}`)) {
        pathWithoutLocale = currentPath.substring(`/${locale}`.length);
      }
      
      // Ensure path starts with /
      if (!pathWithoutLocale || pathWithoutLocale === '' || !pathWithoutLocale.startsWith('/')) {
        pathWithoutLocale = '/';
      }
      
      // Create new path with new locale
      const newPath = `/${newLocale}${pathWithoutLocale}`.replace(/\/+/g, '/');
      
      console.log('Navigating to:', newPath);
      
      // Force page reload to ensure locale change
      window.location.assign(newPath);
    } catch (error) {
      console.error('Error switching language:', error);
      window.location.assign(`/${newLocale}`);
    }
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* logo */}
          <Link href={`/${locale}`} style={{ textDecoration: 'none' }}>
            <Box sx={{ 
              color: '#004975', 
              fontWeight: 700, 
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontFamily: 'Helvetica, Arial, sans-serif',
              '&:hover': {
                color: '#003A5C',
              },
              transition: 'color 0.3s ease',
            }}>
              REMONTTNVD.COM
            </Box>
          </Link>

          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{ 
                    color: isActive(item.href) ? '#004975' : '#1A1A1A',
                    fontWeight: isActive(item.href) ? 600 : 500,
                    fontSize: '0.95rem',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: isActive(item.href) ? 'rgba(0, 73, 117, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 73, 117, 0.1)',
                      color: '#004975',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* lan switcher 	*/}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                <LanguageIcon sx={{ color: '#004975', mr: 1, fontSize: '1.2rem' }} />
                {isHydrated ? (
                  <Select
                    value={locale}
                    onChange={handleLanguageChange}
                    size="small"
                    sx={{
                      minWidth: 70,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E0E0E0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004975',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#004975',
                      },
                      '& .MuiSelect-select': {
                        padding: '8px 12px',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="en" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>EN</MenuItem>
                    <MenuItem value="uk" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>UK</MenuItem>
                  </Select>
                ) : (
                  <Box sx={{ 
                    minWidth: 70, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid #E0E0E0',
                    borderRadius: 1,
                    backgroundColor: '#F5F5F5'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      {locale.toUpperCase()}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* mobile */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              
              {isHydrated ? (
                <Select
                  value={locale}
                  onChange={handleLanguageChange}
                  size="small"
                  sx={{
                    minWidth: 70,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E0E0E0',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004975',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#004975',
                    },
                    '& .MuiSelect-select': {
                      padding: '6px 10px',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem value="en" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>EN</MenuItem>
                  <MenuItem value="uk" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>UK</MenuItem>
                </Select>
              ) : (
                <Box sx={{ 
                  minWidth: 70, 
                  height: 36, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid #E0E0E0',
                  borderRadius: 1,
                  backgroundColor: '#F5F5F5'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {locale.toUpperCase()}
                  </Typography>
                </Box>
              )}

              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{ color: '#004975' }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    minWidth: 200,
                    mt: 1,
                  },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    component={Link}
                    href={item.href}
                    onClick={handleMobileMenuClose}
                    sx={{
                      color: isActive(item.href) ? '#004975' : '#1A1A1A',
                      fontWeight: isActive(item.href) ? 600 : 500,
                      backgroundColor: isActive(item.href) ? 'rgba(0, 73, 117, 0.1)' : 'transparent',
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;