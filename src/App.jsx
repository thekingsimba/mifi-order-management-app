import './utils/i18n';

import { Alert, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import CustomLoader from './common/customLoader/CustomLoaderView';
import config from './config';
import CompositeProvider from './contexts/CompositeProvider';
import Routes from './routes/Routes';
import './App.css'

const App = () => {
  return (
    <Suspense fallback={<CustomLoader loaderProperty={{ isLoader: true }} />}>
      <BrowserRouter basename={config.basePath}>
        <CompositeProvider initialConfig={config}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Routes />
          </LocalizationProvider>
        </CompositeProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
