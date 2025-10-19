import { Button, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="contained"
        sx={{
          backgroundColor: '#004975',
          color: 'white',
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#008000',
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
