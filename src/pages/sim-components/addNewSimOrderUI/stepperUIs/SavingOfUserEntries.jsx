import {
  Alert,
  Box,
  Button,
  CardContent,
  Slide,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  DataSavingCardContainer,
  FlexBox,
  InfileDownloadCardContainer,
  StepperNavigation,
} from '../../../../components/sim-styles/simStyles';
import LinearProgress from '@mui/material/LinearProgress';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  createSimOrder,
  getOrderSequenceId,
  initOrderInfile,
  updateHLRBatchNumberRange,
  updateHLRImsiNumberRange,
  updateHLRSerialNumberRange,
} from '../../../../services/ApiService';
import {
  fetchAllOrderData,
  setResetCreateSimOrderData,
} from '../../../../redux/features/manage-sim/simManagementDataSlice';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { removePrefix } from '../../../sim-management-utils/sim-management-utils';
import { UDCHLR } from 'src/pages/appConfigPage/SimManagementTableFormUI/configTitleConstant';
import InfoIcon from '@mui/icons-material/Info';

function SavingOfUserEntries({
  previousStepFn = () => {},
  toggleDrawer = () => {},
}) {
  const [canProceed, setCanProceed] = useState(false);
  const [infileReady, setInfileReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [savePurchaseOrderProgress, setSavePurchaseOrderProgress] = useState(0);
  const [saveBatchRangeProgress, setSaveBatchRangeProgress] = useState(0);
  const [preProcessingProgress, setPreProcessingProgress] = useState(0);

  const { basicSimOrderData, hlrRequestSampleData, requestMappingData } =
    useSelector(
      (state) => state.simManagementDataSlice.createNewSimOrderFormData
    );

  const { otherConfigData, allSimManufacturers } = useSelector(
    (state) => state.simManagementDataSlice.simConfigData
  );

  const { allSerialNumberRange, allBatchNumberRange, allImsiNumberRange } =
    useSelector((state) => state.simManagementDataSlice.simHlrRangeData);

  const dispatch = useDispatch();

  const handleCloseAlert = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const itemToSave = [
    'Processing Purchase Order Details',
    'Processing Batch Mapping Details',
  ];

  const currentSimManufacturer = allSimManufacturers.find((manufObj) => {
    // console.log(manufObj?.name);
    // console.log(basicSimOrderData?.simManufacturer);
    return manufObj?.name === basicSimOrderData?.simManufacturer;
  });

  let newSimOrder = {
    ...basicSimOrderData,
    initialRequest: hlrRequestSampleData,
    allBatchMapping: requestMappingData,
    partCode: otherConfigData.find((config) => config.name == 'partCode')
      ?.value,
    simPrefix: requestMappingData[0]?.serialStartNumber.toString().slice(0, 7),
    subsidiaryCode: otherConfigData.find(
      (config) => config?.name == 'subsidiaryCode'
    )?.value,
    locationCode: otherConfigData.find(
      (config) => config?.name == 'locationCode'
    )?.value,
    customer: otherConfigData.find((config) => config?.name == 'customer')
      ?.value,
    simConnectionType: otherConfigData.find(
      (config) => config?.name == 'simConnectionType'
    )?.value,
    simManufacturerCode: currentSimManufacturer?.internalCode,
    status: 'generated',
  };

  const activateProgressBar = () => {
    const pOrderInterval = setInterval(() => {
      setSavePurchaseOrderProgress((prevProgress) => {
        if (prevProgress >= 75) {
          clearInterval(pOrderInterval);
          return prevProgress;
        }
        return prevProgress + 10;
      });
    }, 500);

    const poBathRangeInterval = setInterval(() => {
      setSaveBatchRangeProgress((prevProgress) => {
        if (prevProgress >= 50) {
          clearInterval(poBathRangeInterval);
          return prevProgress;
        }
        return prevProgress + 2;
      });
    }, 500);
  };

  const savePurchaseOrder = async () => {
    setCanProceed(true);
    activateProgressBar();
    try {
      const poSeq_id = await getOrderSequenceId();
      newSimOrder = {
        ...newSimOrder,
        seq_id: poSeq_id.sequence_value.toString(),
      };
      console.log(newSimOrder);
      const resp = await createSimOrder(newSimOrder);
      if (resp.code == '200') {
        setSavePurchaseOrderProgress(100);
        setSaveBatchRangeProgress(100);
        updateAllRange();
        dispatch(fetchAllOrderData());
        generateInfile();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateInfile = async () => {
    const responseBlob = await initOrderInfile(newSimOrder.seq_id);
    //console.log(responseBlob);
    if (responseBlob.size > 0) {
      // const blobFile = responseBlob.data;

      // create "a" HTML element with href to file & click
      const link = document.createElement('a');

      const href = URL.createObjectURL(responseBlob);

      link.href = href;

      link.setAttribute('download', newSimOrder.purchaseOrder + '.zip');

      document.body.appendChild(link);

      link.click();

      // clean up "a" element and remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      setInfileReady(true);
      setSuccessMessage('Infiles successfully generated !');
      setErrorMessage(null);
    } else {
      setErrorMessage('Error while generating Infiles!');
      setSuccessMessage(null);
      setInfileReady(false);
    }

    setIsOpen(true);
  };

  const cleanDataAndLeave = () => {
    dispatch(setResetCreateSimOrderData());
    toggleDrawer(false);
  };

  const updateAllRange = async () => {
    const lastBatchCreated =
      newSimOrder.allBatchMapping[newSimOrder.allBatchMapping.length - 1];
    // console.log(lastBatchCreated);

    const lastBatchStr = lastBatchCreated.batchNumber;

    const lastSerialNumberUsed = Number(
      removePrefix(9, lastBatchCreated.serialEndNumber)
    );
    const lastIMSINumberUsed = Number(
      removePrefix(6, lastBatchCreated.imsiEndNumber)
    );
    const lastBatchNumberUsed = Number(lastBatchStr);

    // console.log('lastSerialNumberUsed', lastSerialNumberUsed);
    // console.log('lastIMSINumberUsed', lastIMSINumberUsed);
    // console.log('lastBatchNumberUsed', lastBatchNumberUsed);

    try {
      await Promise.all([
        updateBatchRangeNumber(lastBatchNumberUsed),
        updateImsiNumberRange(lastIMSINumberUsed),
        updateSerialNumberRange(lastSerialNumberUsed),
      ]);
      // console.log(result);
    } catch (error) {
      console.log(error);
      setErrorMessage(
        'Error while updating the range setting of IMSI | SERIAL NUMBER | BATCH NUMBER !'
      );
      setSuccessMessage(null);
    }
  };

  const updateBatchRangeNumber = async (lastBatchNumberUsed) => {
    const concernedBatchNbRange = allBatchNumberRange[0];

    const updatedObj = {
      lastNumberUsed: lastBatchNumberUsed,
    };

    try {
      return await updateHLRBatchNumberRange(
        updatedObj,
        concernedBatchNbRange.seq_id
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const updateSerialNumberRange = async (lastSerialNumberUsed) => {
    const concernedSerialNbRange = allSerialNumberRange[0];

    const updatedObj = {
      lastSrNumberUsed: lastSerialNumberUsed,
      serialNumberPrefix: concernedSerialNbRange.serialNumberPrefix,
    };

    try {
      return await updateHLRSerialNumberRange(
        updatedObj,
        concernedSerialNbRange.seq_id
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const updateImsiNumberRange = async (lastIMSINumberUsed) => {
    const hlrFur = newSimOrder.hlrFur;

    if (hlrFur === UDCHLR) {
      return 'IMSI update is not allowed for UDC HLR';
    }

    const concernedImsiNbRange = allImsiNumberRange?.find(
      (imsiNbRangeObject) => imsiNbRangeObject.hlrFur === hlrFur
    );

    const updatedObj = {
      lastNumberUsed: lastIMSINumberUsed,
      startNumber: concernedImsiNbRange.startNumber,
      endNumber: concernedImsiNbRange.endNumber,
      imsiPrefixNumber: concernedImsiNbRange.imsiPrefixNumber,
      hlrFur: concernedImsiNbRange.hlrFur,
    };

    try {
      return await updateHLRImsiNumberRange(
        updatedObj,
        concernedImsiNbRange.seq_id
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  useEffect(() => {
    const preProcessingInterval = setInterval(() => {
      setPreProcessingProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(preProcessingInterval);
          return prevProgress;
        }
        return prevProgress + 2;
      });
    }, 500);

    return () => {
      clearInterval(preProcessingInterval);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '1200px',
          marginInline: 'auto',
          minHeight: '58vh',
          marginTop: '30px',
          padding: '10px 0 0 0',
        }}
      >
        {preProcessingProgress >= 100 && canProceed && !infileReady && (
          <FlexBox>
            <DataSavingCardContainer>
              <CardContent sx={{ paddingTop: '40px' }}>
                {itemToSave.map((item, index) => (
                  <Box sx={{ marginBottom: '25px' }} key={index + item}>
                    <Typography sx={{ marginBottom: '10px' }}>
                      <b>{item}</b>
                    </Typography>

                    {index === 0 && (
                      <FlexBox>
                        <Box sx={{ width: '90%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={savePurchaseOrderProgress}
                          />
                        </Box>
                        <Box sx={{ padding: '0 5px' }}>
                          <Typography
                            variant="body2"
                            sx={{ position: 'relative', bottom: '5px' }}
                          >
                            {Math.floor(savePurchaseOrderProgress)}%
                          </Typography>
                        </Box>
                      </FlexBox>
                    )}
                    {index === 1 && (
                      <FlexBox>
                        <Box sx={{ width: '90%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={saveBatchRangeProgress}
                          />
                        </Box>
                        <Box sx={{ padding: '0 5px' }}>
                          <Typography
                            variant="body2"
                            sx={{ position: 'relative', bottom: '5px' }}
                          >
                            {Math.floor(saveBatchRangeProgress)}%
                          </Typography>
                        </Box>
                      </FlexBox>
                    )}
                  </Box>
                ))}
              </CardContent>
            </DataSavingCardContainer>

            <InfileDownloadCardContainer>
              {savePurchaseOrderProgress < 100 && (
                <Box sx={{ marginTop: '60px', width: '50%', marginX: 'auto' }}>
                  <Box sx={{ textAlign: 'center', marginBottom: '15px' }}>
                    <Typography variant="h5">
                      {' '}
                      Building Infiles for Batches{' '}
                    </Typography>
                  </Box>
                  <LinearProgress />
                  <Box
                    sx={{
                      width: '300px',
                      textAlign: 'center',
                      marginX: 'auto',
                      marginTop: '15px',
                    }}
                  >
                    <Typography variant="body2">
                      This process could take some time, based on the quantity
                      requested.
                    </Typography>
                  </Box>
                </Box>
              )}
              {savePurchaseOrderProgress == 100 && (
                <Box sx={{ marginTop: '60px', width: '50%', marginX: 'auto' }}>
                  <Box sx={{ textAlign: 'center', marginBottom: '15px' }}>
                    <Typography variant="h5">Process completed !</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '450px',
                      marginX: 'auto',
                      marginTop: '15px',
                    }}
                  >
                    {savePurchaseOrderProgress == 100 && (
                      <Box sx={{ marginLeft: '30px' }}>
                        <Typography variant="body2">
                          <CheckCircleIcon
                            sx={{
                              marginRight: '10px',
                              position: 'relative',
                              top: '6px',
                            }}
                          />
                          The Purchase order was successfully saved
                        </Typography>
                      </Box>
                    )}
                    {!infileReady && (
                      <Box sx={{ marginLeft: '30px' }}>
                        <Typography variant="body2">
                          <InfoIcon
                            sx={{
                              marginRight: '10px',
                              position: 'relative',
                              top: '6px',
                            }}
                          />
                          The infiles can still be found in the order details
                          page
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        textAlign: 'center',
                        marginBottom: '15px',
                        marginTop: '20px',
                      }}
                    >
                      <Button
                        type="button"
                        variant="contained"
                        onClick={() => cleanDataAndLeave()}
                      >
                        Back to Sim Order
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </InfileDownloadCardContainer>
          </FlexBox>
        )}

        {preProcessingProgress < 100 && (
          <Box sx={{ marginTop: '60px', width: '50%', marginX: 'auto' }}>
            <Box sx={{ textAlign: 'center', marginBottom: '15px' }}>
              <Typography variant="h5">Preprocessing all the data</Typography>

              <LinearProgress
                sx={{ marginTop: '15px' }}
                variant="determinate"
                value={preProcessingProgress}
              />
            </Box>
          </Box>
        )}

        {preProcessingProgress >= 100 && !canProceed && (
          <Box sx={{ marginTop: '60px', width: '50%', marginX: 'auto' }}>
            <Box sx={{ textAlign: 'center', marginBottom: '15px' }}>
              <Typography variant="h5">
                The Purchase Order is ready to be generated !
              </Typography>
              <Box
                sx={{
                  textAlign: 'center',
                  marginBottom: '15px',
                  marginTop: '20px',
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => savePurchaseOrder()}
                >
                  <RocketLaunchIcon sx={{ marginRight: '10px' }} /> Proceed
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {infileReady && (
          <Box sx={{ width: '50%', marginX: 'auto' }}>
            <Box sx={{ textAlign: 'center', marginBottom: '15px' }}>
              <Box
                sx={{
                  textAlign: 'center',
                  marginBottom: '15px',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 200 }} />
              </Box>
              <Typography variant="h5">
                Infile successfully downloaded !
              </Typography>
              <Box
                sx={{
                  textAlign: 'center',
                  marginBottom: '15px',
                  marginTop: '20px',
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => cleanDataAndLeave()}
                >
                  Back to Sim Order
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

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

      {!canProceed && (
        <StepperNavigation>
          <Box sx={{ position: 'relative' }}>
            <Button
              sx={{ position: 'absolute', left: '10px' }}
              type="button"
              variant="outlined"
              onClick={() => previousStepFn()}
            >
              Previous
            </Button>
          </Box>
        </StepperNavigation>
      )}
    </>
  );
}

export default SavingOfUserEntries;
