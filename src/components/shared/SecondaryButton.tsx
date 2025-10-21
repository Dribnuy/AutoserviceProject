import { Button, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

interface SecondaryButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
}

const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ children, sx, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outlined"
        sx={{
          borderColor: '#004975',
          color: '#004975',
          px: 3,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#004975',
            color: 'white',
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
