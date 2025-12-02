import { createContext, useContext, useState, useMemo } from 'react';
import propTypes from 'prop-types';

const initialValues = { type: '', title: '', message: '' };

export const ToastContext = createContext({
  snackbarContent: initialValues,
  handleShowToast: () => { },
  handleHideToast: () => { },
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [snackbarContent, setSnackbarContent] = useState(initialValues);

  const handleShowToast = ({ type = '', message = '', title }) => {
    setSnackbarContent({ type, message, title });
  };

  const handleHideToast = () => {
    setSnackbarContent(initialValues);
  };

  const contextValue = useMemo(
    () => ({
      handleShowToast,
      snackbarContent,
      setSnackbarContent,
      handleHideToast,
    }),
    [snackbarContent, handleShowToast, handleHideToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: propTypes.node.isRequired,
};
