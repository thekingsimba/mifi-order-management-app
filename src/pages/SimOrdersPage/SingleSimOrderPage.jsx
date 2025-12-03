import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Slide,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import {
  FlexBoxSpaceBetween,
  InfileManagerBox,
  OutFileManagerBox,
} from '../../components/sim-styles/simStyles';
import {
  SimIndexGridItem,
  SimIndexRightPaper,
} from '../../components/sim-styles/simStyles.js';
import {
  fetchAllOrderData,
  setConfigTitle,
  setSimManagementTableConfigUI,
} from '../../redux/features/manage-sim/simManagementDataSlice';
import { initOrderInfile, simOrderDetails } from '../../services/ApiService';
import {
  formatStringFromCamelCase,
  splitArray,
} from '../sim-management-utils/sim-management-utils';
import { batch_mapping_simulation_table_config } from '../tableTemplate/batchMappingTableTemplate.js';
import DynamicTable from '../../components/dynamicTable/DynamicTable.jsx';
import { CHECK_BATCH_MAPPING } from '../sim-components/addNewSimOrderUI/stepperUIs/stepperTitles.js';
import { format, isValid, parseISO } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { PENDING, REJECTED, SUBMITTED } from './simOrderConstant';

function CardWrapper({ children }) {
  return (
    <SimIndexGridItem item xs={12} ml={2}>
      <SimIndexRightPaper>{children}</SimIndexRightPaper>
    </SimIndexGridItem>
  );
}

function Row({ label, value = '', labelSize = 200, labelFontWeight = 'bold' }) {
  return (
    <Stack
      direction="row"
      sx={{ typography: 'caption', textTransform: 'capitalize' }}
    >
      <Box
        component="span"
        sx={{
          minWidth: labelSize,
          mr: 2,
        }}
      >
        <Typography
          sx={{
            lineHeight: 2,
            fontWeight: labelFontWeight,
          }}
        >
          {label}
          {' :'}
        </Typography>
      </Box>

      <Typography
        sx={{
          lineHeight: 2,
        }}
      >
        {value}{' '}
      </Typography>
    </Stack>
  );
}

const SingleSimOrderPage = () => {
  const simOrderGlobalData = useSelector(
    (state) => state.simManagementDataSlice.simOrderGlobalData
  );
  const navigate = useNavigate();
  const { simOrderId } = useParams();
  const [singleOrder, setSingleOrder] = useState({});
  const [cardData, setCardData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const theme = useTheme();

  const { configTitle, tableViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const { allSimOrderData } = simOrderGlobalData;

  const dispatch = useDispatch();

  const backToAllSimOrder = () => {
    navigate('/sim-manager', { replace: true });
  };

  const setCardLabelAndKeys = (keyValueOject) => {
    return Object.keys(keyValueOject).map((key) => {
      return {
        label: formatStringFromCamelCase(key),
        key,
      };
    });
  };

  const populateTableConfig = (configObject, tableDataArray) => {
    return {
      ...configObject,
      tableBodyData: tableDataArray,
      allowedActions: ['singleView'],
    };
  };

  const retrieveOrderCardData = (singleOrderObj) => {
    const simOrderDetailsToDisplay = {
      ...singleOrderObj,
      allBatchMapping: singleOrderObj.allBatchMapping.map((batchObj) => {
        return { ...batchObj, simOrderId };
      }),
    };
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: populateTableConfig(
          batch_mapping_simulation_table_config,
          simOrderDetailsToDisplay.allBatchMapping
        ),
      })
    );
    delete simOrderDetailsToDisplay.initialRequest;
    delete simOrderDetailsToDisplay.allBatchMapping;

    const cardDetailsKeyLabel = setCardLabelAndKeys(simOrderDetailsToDisplay);
    //console.log(cardDetailsKeyLabel);
    const cardData = splitArray(cardDetailsKeyLabel, [
      '_id',
      'seq_id',
      'comments',
      'modifiedBy',
    ]);

    setCardData(cardData);
  };

  const handleCloseAlert = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const navigateToOutfileUpload = () => {
    navigate(`/sim-manager/${singleOrder.seq_id}/manufacturer-files/`);
  };

  const handleInfile = async (orderId) => {
    const responseBlob = await initOrderInfile(orderId);
    //console.log(responseBlob);
    if (responseBlob.size > 0) {
      // const blobFile = responseBlob.data;

      // create "a" HTML element with href to file & click
      const link = document.createElement('a');

      const href = URL.createObjectURL(responseBlob);

      link.href = href;

      link.setAttribute('download', singleOrder.purchaseOrder + '.zip');

      document.body.appendChild(link);

      link.click();

      // clean up "a" element and remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      dispatch(fetchAllOrderData());
      setSuccessMessage('Infiles successfully generated !');
      setErrorMessage(null);
    } else {
      setErrorMessage('Error while generating Infiles!');
      setSuccessMessage(null);
    }

    setIsOpen(true);
  };

  const backToBatchList = () => {
    navigate(`/sim-manager`);
  };

  const getSimOrderData = async () => {
    try {
      const searchResult = await simOrderDetails(simOrderId);
      // console.log(searchResult[0]);
      setSingleOrder(searchResult[0]);
      retrieveOrderCardData(searchResult[0]);
    } catch (error) {
      return [];
    }
  };

  const isDate = (key) => {
    return key.toLowerCase().includes('date');
  };
  const formatDate = (value) => {
    let formattedValue = value;
    const dateValue = parseISO(value);
    if (isValid(dateValue)) {
      formattedValue = format(dateValue, 'MM/dd/yyyy hh:mm:ss a');
    }
    return formattedValue;
  };
  const filterByStatus = (arrayOfObj = [], status) => {
    return arrayOfObj?.length
      ? arrayOfObj.filter((item) => item?.manufacturerFilesStatus === status)
      : [];
  };

  const outfileSummary = [
    {
      icon: (
        <CheckCircleIcon
          sx={{
            color: theme.palette.primary.main,
            position: 'relative',
            top: '6px',
          }}
        />
      ),
      label: 'OTA/OUT Files Submitted',
      value: `${
        filterByStatus(singleOrder?.allBatchMapping, SUBMITTED).length
      }/${singleOrder?.allBatchMapping?.length}`,
      labelSize: 250,
      panel: 'panel1',
      data: filterByStatus(singleOrder?.allBatchMapping, SUBMITTED),
    },
    {
      icon: (
        <CancelIcon
          sx={{
            color: theme.palette.error.main,
            position: 'relative',
            top: '6px',
          }}
        />
      ),
      label: 'OTA/OUT files rejected',
      value: `${
        filterByStatus(singleOrder?.allBatchMapping, REJECTED).length
      }/${singleOrder?.allBatchMapping?.length}`,
      labelSize: 250,
      panel: 'panel2',
      data: filterByStatus(singleOrder?.allBatchMapping, REJECTED),
    },
    {
      icon: (
        <PendingIcon
          sx={{
            color: theme.palette.grey[600],
            position: 'relative',
            top: '6px',
          }}
        />
      ),
      label: 'OTA/OUT Files Pending',
      value: `${filterByStatus(singleOrder?.allBatchMapping, PENDING).length}/${
        singleOrder?.allBatchMapping?.length
      }`,
      labelSize: 250,
      panel: 'panel3',
      data: filterByStatus(singleOrder?.allBatchMapping, PENDING),
    },
  ];

  useEffect(() => {
    dispatch(setConfigTitle(CHECK_BATCH_MAPPING));
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: batch_mapping_simulation_table_config,
      })
    );
    if (!allSimOrderData.length || !singleOrder) {
      return backToAllSimOrder();
    }
    getSimOrderData();
  }, [simOrderId]);

  return (
    <>
      {singleOrder && (
        <CardWrapper>
          <FlexBoxSpaceBetween sx={{ marginBottom: '30px', padding: '0 10px' }}>
            <Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'block', sm: 'block' } }}
              >
                SIM ORDER DETAILS
              </Typography>
            </Box>
            <Box>
              <IconButton
                aria-label="Back to order details"
                onClick={backToBatchList}
              >
                <ClearIcon />
              </IconButton>
            </Box>
          </FlexBoxSpaceBetween>
          {singleOrder['purchaseOrder'] && (
            <>
              <Card
                variant="outlined"
                sx={{
                  mt: 4,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <InfileManagerBox>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <Typography variant="h6">
                        <b>Purchase Order: {singleOrder['purchaseOrder']}</b>
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        marginTop: '10px',
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleInfile(simOrderId)}
                        style={{}}
                      >
                        GENERATE ALL INFILES
                      </Button>
                    </Box>
                  </InfileManagerBox>
                  <Grid
                    sx={{ marginBottom: 2 }}
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Grid item xs={12} sm={6} md={6}>
                      <Box component="section" sx={{ p: 2 }}>
                        {cardData?.firstGridData?.length &&
                          cardData?.firstGridData?.map((element, index) => (
                            <Row
                              label={element.label}
                              value={
                                isDate(element.key)
                                  ? formatDate(singleOrder[element.key])
                                  : singleOrder[element.key]
                              }
                              key={element?.label + index}
                            />
                          ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                      <Box component="section" sx={{ p: 2 }}>
                        {cardData?.secondGridData?.length &&
                          cardData?.secondGridData?.map((element, index) => (
                            <Row
                              label={element.label}
                              value={
                                isDate(element.key)
                                  ? formatDate(singleOrder[element.key])
                                  : singleOrder[element.key]
                              }
                              key={element.label + index}
                            />
                          ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  mt: 4,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    paddingBottom: '20px 10px',
                  }}
                >
                  <OutFileManagerBox>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '10px',
                      }}
                    >
                      <Typography variant="h6">
                        <b>Manufacturer files status:</b>
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        marginTop: '10px',
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigateToOutfileUpload()}
                        style={{}}
                      >
                        HANDLE MANUFACTURER FILES
                      </Button>
                    </Box>
                  </OutFileManagerBox>
                  <Box sx={{ marginLeft: '10px' }}>
                    <Row
                      label="Total number of Batch"
                      value={tableViewConfig?.tableBodyData?.length}
                      labelSize={250}
                    />
                  </Box>
                  <Box sx={{ marginLeft: '10px' }}>
                    {outfileSummary.map(
                      (outfileReport, index) =>
                        outfileReport?.data?.length > 0 && (
                          <Row
                            key={index + outfileReport.label}
                            label={outfileReport.label}
                            value={outfileReport.value}
                            labelSize={250}
                          />
                        )
                    )}
                  </Box>
                </Box>
              </Card>
            </>
          )}

          <Card
            variant="outlined"
            sx={{
              p: 2,
              mt: 4,
            }}
          >
            <Box sx={{ marginBottom: '10px' }}>
              <Typography>
                <b>{configTitle}</b>
              </Typography>
              <Typography variant="body2">
                The {singleOrder.simTotalQuantity} units of {singleOrder.hlrFur}{' '}
                were divided in Batches ( of 5000 HLR maximum inside of each )
                mapped this way:{' '}
              </Typography>
            </Box>
            <Box>
              {tableViewConfig?.tableBodyData?.length > 0 && (
                <DynamicTable tableConfig={tableViewConfig} />
              )}
            </Box>
          </Card>
        </CardWrapper>
      )}
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

export default SingleSimOrderPage;
