import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SimIndexContainer, SimIndexGridItem, SimIndexRightPaper } from '../../components/sim-styles/simStyles.js';
import {
  fetchAllOrderData,
  fetchAllSerialNumberRange,
  fetchAllBatchNumberRange,
  fetchAllImsiNumberRange,
  fetchAllSimCategory,
  fetchAllSimTypes,
  fetchAllSimManufacturers,
  fetchAllSimPrefixes,
  fetchAllSimConnectionTypes,
  fetchAllSimHLR,
  fetchOtherConstantConfigData,
} from '../../redux/features/manage-sim/simManagementDataSlice.js';
import SimManagementTableView from '../sim-components/SimManagementTableView';
import CustomLoaderView from '../../common/customLoader/CustomLoaderView.jsx';
import { Alert, Slide, Snackbar } from '@mui/material';

const SimOrdersPage = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const dispatch = useDispatch();

  const fetchData = async () => {
    //console.log('called');
    try {
      // Use Promise.all to await multiple async actions
      setLoading(true);
      // console.log(loading, " the loading state")
      const response = await Promise.all([
        dispatch(fetchAllOrderData()),
        dispatch(fetchAllSerialNumberRange()),
        dispatch(fetchAllBatchNumberRange()),
        dispatch(fetchAllImsiNumberRange()),
        dispatch(fetchAllSimCategory()),
        dispatch(fetchAllSimTypes()),
        dispatch(fetchAllSimManufacturers()),
        dispatch(fetchAllSimPrefixes()),
        dispatch(fetchAllSimConnectionTypes()),
        dispatch(fetchAllSimHLR()),
        dispatch(fetchOtherConstantConfigData()),
      ]);
      if (response) {
        setLoading(false);
      }
      // console.log(loading, ' the final loading state');
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Error fetching data: ' + error);
      setSuccessMessage(null);
      setIsOpen(true);
    }
  };

  const handleCloseAlert = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <SimIndexContainer container spacing={{ xs: 2 }}>
        {loading ? (
          <CustomLoaderView loaderProperty={{ isLoader: loading }} />
        ) : (
          <SimIndexGridItem item xs={12} ml={2}>
            <SimIndexRightPaper elevation={1}>
              <SimManagementTableView />
            </SimIndexRightPaper>
          </SimIndexGridItem>
        )}
      </SimIndexContainer>

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
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SimOrdersPage;
