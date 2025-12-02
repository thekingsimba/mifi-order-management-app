/* eslint-disable react/function-component-definition */
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import { Alert, AlertTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useToast } from '../../contexts/ToastContext';

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root ': {
    backgroundColor: theme.palette.background.hint,
    display: 'flex',
    alignItems: 'flex-start',
    borderRadius: '1rem',
  },
}));

const StyledCancelIconGrey = styled(CancelRoundedIcon)(({ theme }) => ({
  color: theme.palette.text.hint,
}));

export default function ToastMessage() {
  const [open, setOpen] = useState(false);

  const {
    snackbarContent: { type, message, title },
    handleHideToast,
  } = useToast();

  const handleClose = () => {
    handleHideToast();
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (message) {
      setOpen(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      // Clear the timeout if the component unmounts or message changes
      return () => {
        clearTimeout(timer);
      };
    }
    setOpen(false);
  }, [message]);

  if (!message && !title) {
    return null;
  }
  return (
    <StyledSnackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={6000}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          sx={{ p: 0.5 }}
          onClick={handleClose}
        >
          <StyledCancelIconGrey />
        </IconButton>
      }
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <AlertTitle>
          <Typography variant="body1" textTransform="capitalize">
            {title}
          </Typography>
        </AlertTitle>
        <Typography variant="subtitle2">{message}</Typography>
      </Alert>
    </StyledSnackbar>
  );
}
