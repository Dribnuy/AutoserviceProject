import { Button, ButtonProps, useTheme } from '@mui/material';
import { forwardRef } from 'react';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, sx, ...props }, ref) => {
    const theme = useTheme();
    
    return (
      <Button
        ref={ref}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.primary.hover,
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

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
