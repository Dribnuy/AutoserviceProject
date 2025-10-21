import { Button, ButtonProps, useTheme } from '@mui/material';
import { forwardRef } from 'react';

interface SecondaryButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
}

const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ children, sx, ...props }, ref) => {
    const theme = useTheme();
    
    return (
      <Button
        ref={ref}
        variant="outlined"
        sx={{
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
          ...sx,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;
