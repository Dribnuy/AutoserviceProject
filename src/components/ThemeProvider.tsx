'use client';

import { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

function createEmotionCache() {
  let insertionPoint: HTMLElement | undefined;
  if (typeof document !== 'undefined') {
    const metaTag = document.querySelector('meta[name="emotion-insertion-point"]') as HTMLMetaElement | null;
    insertionPoint = metaTag ?? undefined as any;
  }
  return createCache({ key: 'mui', insertionPoint });
}

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = useMemo(() => createEmotionCache(), []);
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
