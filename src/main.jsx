import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import theme from './theme/theme.js';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './components/error-page/ErrorPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={{ ...theme }}>
      <ErrorBoundary
        FallbackComponent={ErrorPage}
        onReset={() => (location.href = '/')}
      >
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);