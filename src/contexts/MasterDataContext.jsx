import PropTypes from 'prop-types';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchDBOMasterData } from '../services/ApiService';
import { Alert, Slide, Snackbar } from '@mui/material';

const initialContextState = {
  code: 'Master data',
  desc: 'master data list',
  currency: 'Dollar',
  currencyConversion: '.01',
  daUpdateMultiFactor: '100',
  language: 'en',
  maUpdateMultiFactor: '100',
  module: '360',
  offerTypeDetails: [],
  offerdata: [],
  mifiPreActivationConfig: {},
  routes: [],
};

const MasterDataConfigContext = createContext(initialContextState);

export const MasterDataProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const [offerTypeDetails, setOfferTypeDetails] = useState([]);
  const [offerdata, setOfferdata] = useState([]);
  const [mifiPreActivationConfig, setMifiPreActivationConfig] = useState({});
  const [configs, setConfigs] = useState(initialContextState);
  const [headerStatus, setHeaderStatus] = useState('show');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    const response = await fetchDBOMasterData();
    console.log(response);
    if (response) {
      const routesData = response.routes[0].routeData;
      const tsatData = response.tsatConfigData[0].data;
      setRoutes(routesData);
      setHeaderStatus(tsatData.headerStatus);
      setOfferTypeDetails(tsatData.offerTypeDetails);
      setOfferdata(tsatData.offerdata);
      setMifiPreActivationConfig(tsatData.mifiPreActivationConfig);
      setConfigs({
        code: tsatData.code,
        currency: tsatData.currency,
        currencyConversion: tsatData.currencyConversion,
        daUpdateMultiFactor: tsatData.daUpdateMultiFactor,
        desc: tsatData.desc,
        language: tsatData.language,
        maUpdateMultiFactor: tsatData.maUpdateMultiFactor,
        module: tsatData.module,
      });
      setIsOpen(false);
      setErrorMessage(null);
    } else {
      setErrorMessage('Error while fetching master data');
      setIsOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setIsOpen(false);
  };

  const contextValue = useMemo(
    () => ({
      errorMessage,
      routes,
      offerTypeDetails,
      offerdata,
      configs,
      headerStatus,
      mifiPreActivationConfig,
    }),
    [
      routes,
      offerTypeDetails,
      offerdata,
      configs,
      mifiPreActivationConfig,
      errorMessage,
    ]
  );

  return (
    <>
      <MasterDataConfigContext.Provider value={contextValue}>
        {children}
      </MasterDataConfigContext.Provider>
      <Snackbar
        open={isOpen}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
        key={'slide'}
        autoHideDuration={5000}
      >
        <Alert
          severity={errorMessage ? 'error' : 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export const useMasterDataContext = () => useContext(MasterDataConfigContext);

MasterDataProvider.prototype = {
  children: PropTypes.node.isRequired,
};
