import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  buildTheCsvFileFromJson,
  editSimOrder,
  getResourceDetails,
  simOrderDetails,
  uploadOutfileCsvToDRM,
  uploadSimOrderOutfile,
} from '../../services/ApiService';
import { setSimManagementTableConfigUI } from '../../redux/features/manage-sim/simManagementDataSlice';
import { batch_mapping_simulation_table_config } from '../tableTemplate/batchMappingTableTemplate';
import DynamicTable from '../../components/dynamicTable/DynamicTable.jsx';
import ClearIcon from '@mui/icons-material/Clear';
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FlexBoxSpaceBetween,
  OtaOutFileContainer,
  SimIndexGridItem,
  SimIndexRightPaper,
} from '../../components/sim-styles/simStyles';
import {
  formatStringFromCamelCase,
  joinOutputVariablesData,
  prepareDataForDRM,
  splitArray,
} from '../sim-management-utils/sim-management-utils';
import DangerousIcon from '@mui/icons-material/Dangerous';

import { useTheme } from '@mui/material/styles';
import {
  CSV_FILE_TRANSFER_BODY,
  FILE_EXTENSION_FOR_OTA,
  FILE_EXTENSION_FOR_OUT,
  FILE_PREFIX,
  FILE_TYPE_FOR_OTA,
  FILE_TYPE_FOR_OUT,
  PHYSICAL_SIM,
  SUBMITTED,
} from './simOrderConstant';
function SingleBatchPage() {
  const [currentBatchData, setCurrentBatchData] = useState(null);
  const [currentSimOrder, setCurrentSimOrder] = useState(null);
  const [purchaseOrder, setPurchaseOrder] = useState('');
  const [otaFileName, setOtaFileName] = useState('');
  const [outFileName, setOutFileName] = useState('');
  const [orderResourceType, setOrderResourceType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [outFileNameError, setOutFileNameError] = useState(false);
  const [otaFileNameError, setOtaFileNameError] = useState(false);
  const [businessTypeKey, setBusinessTypeKey] = useState('PREPAID');
  const [cardData, setCardData] = useState({});
  const [otaFileData, setOtaFileData] = useState({});
  const [outFileData, setOutFileData] = useState({});
  const [combinedOutFileData, setCombinedOutFileData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { simOrderId, batchNumber, imsiStartNumber, imsiEndNumber } =
    useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const otaFileInputRef = useRef(null);
  const outFileInputRef = useRef(null);

  const { tableViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const checkFile = (event, fileType) => {
    let expectedFileName;
    const file = event.target.files[0];

    const currentFileName = file?.name;

    if (fileType === FILE_TYPE_FOR_OTA) {
      expectedFileName = FILE_PREFIX + batchNumber + FILE_EXTENSION_FOR_OTA;
      setOtaFileName(currentFileName);
    } else {
      expectedFileName = FILE_PREFIX + batchNumber + FILE_EXTENSION_FOR_OUT;
      setOutFileName(currentFileName);
    }

    if (currentFileName == expectedFileName) {
      //console.log('handleFileUpload called');
      handleFileUpload(file, fileType);
      setErrorMessage(null);
      setOtaFileNameError(false);
      setOutFileNameError(false);
    } else {
      setOtaFileName('');
      setOutFileName('');
      setSuccessMessage(null);
      setErrorMessage('The file name should be: ' + expectedFileName);
      if (fileType == FILE_TYPE_FOR_OTA) {
        setOtaFileNameError(true);
        handleOtaFileClear(event);
      } else {
        setOutFileNameError(true);
        handleOutFileClear(event);
      }
      setIsOpen(true);
    }
  };

  const isValidFile = (fileData) => {
    const validPurchaseOrder =
      purchaseOrder === fileData.header['PO_ref_number'];
    const validQuantity =
      Number(currentBatchData.quantityInBatch) ===
      Number(fileData.header['Quantity']);

    //console.log(currentBatchData.quantityInBatch);
    //console.log(fileData.header['Quantity']);

    const validBatchNumber = batchNumber === fileData.header['Batch'];
    const validImsiStart = imsiStartNumber === fileData.input_variables['IMSI'];
    const validImsiEnd =
      imsiEndNumber ===
      fileData.output_variables[fileData.output_variables.length - 1]['IMSI'];
    const validNumberOfRecords =
      Number(currentBatchData.quantityInBatch) ===
      Number(fileData.output_variables.length);

    const isValidManufacturerFile =
      validPurchaseOrder &&
      validBatchNumber &&
      validImsiStart &&
      validImsiEnd &&
      validQuantity &&
      validNumberOfRecords;

    const keysMatching = [
      { key: 'Purchase Order', isValid: validPurchaseOrder },
      { key: 'Batch Number', isValid: validBatchNumber },
      { key: 'Imsi Start', isValid: validImsiStart },
      { key: 'Imsi End', isValid: validImsiEnd },
      { key: 'Quantity', isValid: validQuantity },
      { key: 'Number Of Records', isValid: validNumberOfRecords },
    ];

    const invalidKeys = keysMatching
      .filter((keyObj) => !keyObj.isValid)
      .map((keyObject) => keyObject.key);

    return { status: isValidManufacturerFile, invalidKeys };
  };

  const handleFileUpload = async (file, fileType) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadSimOrderOutfile(formData);

      if (response.data.header?.['Batch']) {
        const isValid = isValidFile(response.data);

        if (isValid.status) {
          fileType === FILE_TYPE_FOR_OTA
            ? setOtaFileData(response.data)
            : setOutFileData(response.data);
          setSuccessMessage('File data successfully pulled');
          setErrorMessage(null);
        } else {
          fileType === FILE_TYPE_FOR_OTA
            ? setOtaFileData({})
            : setOutFileData({});
          const joinStr = isValid.invalidKeys.length > 1 ? ' | ' : ' ';
          setErrorMessage(
            `The content of the file uploaded does not match the expectation. Please check: ${isValid.invalidKeys.join(
              joinStr
            )}`
          );
        }
      } else {
        setErrorMessage(
          response.data.error || "The file uploaded couldn't be analyzed..."
        );
      }
    } catch (error) {
      setErrorMessage(
        'An error occurred during file upload. Please try again.'
      );
      //console.error('File upload error:', error);
    } finally {
      setIsOpen(true);
    }
  };

  const handleOtaFileClear = (event) => {
    event.preventDefault();
    setOtaFileName('');
    setOtaFileData({});
    setOutFileName('');
    setOutFileData({});
    if (otaFileInputRef.current) {
      otaFileInputRef.current.value = '';
    }
  };

  const handleOutFileClear = (event) => {
    event.preventDefault();
    setOutFileName('');
    setOutFileData({});
    if (outFileInputRef.current) {
      outFileInputRef.current.value = '';
    }
  };

  const backToBatchList = () => {
    navigate(`/sim-manager/${simOrderId}`);
  };

  const populateTableConfig = (configObject, tableDataArray) => {
    return {
      ...configObject,
      tableBodyData: tableDataArray,
    };
  };

  const displayTable = () => {
    // console.log(otaFileData);
    // console.log(outFileData);
    if (otaFileData?.header?.Batch && outFileData?.header?.Batch) {
      const transportKey = currentSimOrder.initialRequest.transportKey;
      const combinedData = joinOutputVariablesData(
        otaFileData,
        outFileData,
        businessTypeKey,
        transportKey
      );

      setCombinedOutFileData(combinedData);

      dispatch(
        setSimManagementTableConfigUI({
          tableViewConfig: populateTableConfig(
            batch_mapping_simulation_table_config,
            combinedData
          ),
        })
      );
    } else {
      dispatch(
        setSimManagementTableConfigUI({
          tableViewConfig: populateTableConfig(
            batch_mapping_simulation_table_config,
            combinedOutFileData
          ),
        })
      );
    }
  };

  const handleCloseAlert = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const setCardLabelAndKeys = (keyValueOject) => {
    return Object.keys(keyValueOject).map((key) => {
      return {
        label: formatStringFromCamelCase(key),
        key,
      };
    });
  };

  const displayCard = (batchObj) => {
    const cardDetailsKeyLabel = setCardLabelAndKeys(batchObj);
    const cardData = splitArray(cardDetailsKeyLabel);
    setCardData(cardData);
  };

  const getCurrentBatchData = async () => {
    try {
      const searchResult = await simOrderDetails(simOrderId);
      setCurrentSimOrder(searchResult);
      setOrderResourceType(searchResult[0].initialRequest.resourceType);
      const batchList = searchResult[0].allBatchMapping;
      // console.log(batchList);
      setPurchaseOrder(searchResult[0].purchaseOrder);

      const currentBatchData = batchList.find(
        (batchObj) => batchObj.batchNumber.toString() === batchNumber.toString()
      );
      //console.log(currentBatchData);
      displayCard(currentBatchData);
      setCurrentBatchData(currentBatchData);
    } catch (error) {
      return [];
    }
  };

  const submitToDrmApp = async () => {
    const csvArrayOfObject = prepareDataForDRM(combinedOutFileData);
    //console.log(csvArrayOfObject);

    const csvFileKeyList = Object.keys(csvArrayOfObject[0]);

    const allResourceDetails = await getResourceDetails();

    console.log('allResourceDetails', allResourceDetails.data);

    if (!allResourceDetails.data.length) {
      setErrorMessage('Resource endpoint respond with error. ');
      setSuccessMessage(null);
      setIsOpen(true);
      return;
    }

    const currentResourceDetails = allResourceDetails.data.find((obj) => {
      let resourceTypeConcerned = orderResourceType;
      if (orderResourceType == PHYSICAL_SIM) {
        resourceTypeConcerned = 'SIM';
      }
      return obj.name == resourceTypeConcerned;
    });
    console.log('currentResourceDetails', currentResourceDetails);

    const categoryId = currentResourceDetails?.id;
    const schemaId = currentResourceDetails?.categorySchema;
    if (!categoryId || !schemaId) {
      setErrorMessage(
        "We couldn't find a resource category called : " +
          currentBatchData.simType +
          ' in DRM resource inventory. Kindly check if ' +
          currentBatchData.simType +
          ' is currently in the available resource category of DRM'
      );
      setSuccessMessage(null);
      setIsOpen(true);
      return;
    }

    const csvResponse = await buildTheCsvFileFromJson(
      JSON.stringify(csvArrayOfObject)
    );

    if (csvResponse.data) {
      // DOWNLOAD CSV =============================================
      const url = window.URL.createObjectURL(new Blob([csvResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      const drmCsvFileName = batchNumber + '_OTA_OUT_FOR_DRM.csv';
      link.setAttribute('download', drmCsvFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // SEND CSV TO DRM =========================================
      const drmCsvFile = new File([csvResponse.data], drmCsvFileName, {
        type: 'text/csv',
      });

      let columnMapping = '';

      csvFileKeyList.forEach((key, index) => {
        const lastIndex = csvFileKeyList.length - 1;
        let keyToAppend = `${key},`;
        if (index == lastIndex) {
          keyToAppend = `${key}`;
        }
        columnMapping = columnMapping + keyToAppend;
      });

      const formData = new FormData();
      formData.append('file', drmCsvFile);
      formData.append('columnMapping', columnMapping);
      formData.append('categoryId', categoryId);
      formData.append('schemaId', schemaId);
      Object.keys(CSV_FILE_TRANSFER_BODY).forEach((bodyKey) => {
        formData.append(bodyKey, CSV_FILE_TRANSFER_BODY[bodyKey]);
      });

      const drmResponse = await transferCsvToDrm(formData, drmCsvFileName);

      if (drmResponse.data) {
        await updateTheBatchAndSave(batchNumber, SUBMITTED);
      }
    } else {
      setErrorMessage(
        'An error occurred when generating the CSV file from .OTA and .OUT'
      );
      setSuccessMessage(null);
      setIsOpen(true);
    }
  };

  const updateTheBatchAndSave = async (batchNumber, status) => {
    try {
      const searchResult = await simOrderDetails(simOrderId);
      const allBatchMapping = searchResult[0].allBatchMapping.map(
        (batchObj) => {
          if (batchObj.batchNumber === batchNumber) {
            return { ...batchObj, manufacturerFilesStatus: status };
          }
          return batchObj;
        }
      );

      const simOrderDataToEdit = {
        ...searchResult[0],
        allBatchMapping,
      };

      console.log('simOrderDataToEdit', simOrderDataToEdit);

      const simOrderUpdateResponse = await editSimOrder(simOrderDataToEdit);
      console.log(simOrderUpdateResponse);
      setErrorMessage(null);
      setSuccessMessage(
        'The manufacturer files status for the batch' +
          batchNumber +
          'is now updated !'
      );
      setIsOpen(true);
    } catch (error) {
      setErrorMessage(
        'An error occurred when updating the manufacturer files status for the batch' +
          batchNumber
      );
      setSuccessMessage(null);
      setIsOpen(true);
    }
  };

  const transferCsvToDrm = async (formData, drmCsvFileName) => {
    try {
      const drmResponse = await uploadOutfileCsvToDRM(formData);

      console.log('drmResponse', drmResponse);

      setErrorMessage(null);
      setSuccessMessage(
        'A CSV file was successfully sent to DRM: ' + drmCsvFileName
      );
      setIsOpen(true);
    } catch (error) {
      setErrorMessage(
        'An error occurred when transferring the csv file to DRM'
      );
      setSuccessMessage(null);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    getCurrentBatchData();
  }, []);

  useEffect(() => {
    displayTable();
  }, [otaFileData, outFileData]);

  return (
    <>
      {currentBatchData && (
        <CardWrapper>
          <Card
            variant="outlined"
            sx={{
              p: 2,
            }}
          >
            <FlexBoxSpaceBetween sx={{ marginBottom: '30px' }}>
              <Box>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'block', sm: 'block' } }}
                >
                  Current Batch: {batchNumber}
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
            <FlexBoxSpaceBetween>
              <Box sx={{ marginBottom: '10px', width: '150px' }}>
                <TextField
                  size="small"
                  name="simType"
                  label="Concerned Sim Type"
                  value={currentBatchData.simType}
                  fullWidth
                  disabled={true}
                />
              </Box>
              <Box sx={{ marginBottom: '10px', width: '150px' }}>
                <TextField
                  size="small"
                  name="businessTypeKey"
                  label="Business Type"
                  value={businessTypeKey}
                  onChange={(e) => {
                    setBusinessTypeKey(e.target.value);
                  }}
                  select
                  fullWidth
                  SelectProps={{
                    native: false,
                    sx: { textTransform: 'capitalize' },
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          px: 1,
                          maxHeight: 'unset',
                          '& .MuiMenuItem-root': {
                            px: 1,
                            borderRadius: 0.75,
                            typography: 'body2',
                            textTransform: 'capitalize',
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="PREPAID">PREPAID</MenuItem>
                  <MenuItem value="POSTPAID">POSTPAID</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ marginBottom: '10px' }}>
                {!otaFileName && (
                  <>
                    <input
                      ref={otaFileInputRef}
                      accept={FILE_EXTENSION_FOR_OTA}
                      style={{ display: 'none' }}
                      id="file-input"
                      type="file"
                      onChange={(e) => checkFile(e, FILE_TYPE_FOR_OTA)}
                    />
                    <label
                      htmlFor="file-input"
                      style={{
                        border: '1.3px solid #E0E0E0',
                        padding: '9px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <IconButton
                        color="primary"
                        aria-label="upload file"
                        component="span"
                      >
                        <UploadIcon />
                      </IconButton>
                      <Typography sx={{ display: 'inline' }}>
                        Upload {FILE_EXTENSION_FOR_OTA} file
                      </Typography>
                    </label>
                  </>
                )}
                {otaFileName && (
                  <span
                    style={{
                      border: '1.3px solid #E0E0E0',
                      padding: '9px',
                      borderRadius: '5px',
                    }}
                  >
                    <IconButton
                      color="primary"
                      aria-label="upload file"
                      component="span"
                    >
                      {otaFileData?.header?.Batch ? (
                        <CheckCircleIcon />
                      ) : (
                        <DangerousIcon
                          sx={{ color: theme.palette.error.main }}
                        />
                      )}
                    </IconButton>
                    <Typography
                      sx={{
                        display: 'inline',
                        color: otaFileData?.header?.Batch
                          ? ''
                          : theme.palette.error.main,
                      }}
                    >
                      {otaFileName}
                    </Typography>
                    <Tooltip title="Clear file">
                      <IconButton
                        style={{
                          cursor: 'pointer',
                        }}
                        aria-label="clear file"
                        onClick={handleOtaFileClear}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </span>
                )}
                {otaFileNameError && (
                  <Typography sx={{ color: 'red' }}>
                    The file name should be :
                    {FILE_PREFIX + batchNumber + FILE_EXTENSION_FOR_OTA}
                  </Typography>
                )}
              </Box>
              <Box sx={{ marginBottom: '10px' }}>
                {!outFileName && (
                  <>
                    <input
                      accept={FILE_EXTENSION_FOR_OUT}
                      style={{ display: 'none' }}
                      id="outfile-input"
                      type="file"
                      onChange={(e) => checkFile(e, FILE_TYPE_FOR_OUT)}
                    />
                    <label
                      htmlFor="outfile-input"
                      style={{
                        border: '1.3px solid #E0E0E0',
                        padding: '9px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      <IconButton
                        color="primary"
                        aria-label="upload file"
                        component="span"
                      >
                        <UploadIcon />
                      </IconButton>
                      <Typography sx={{ display: 'inline' }}>
                        Upload {FILE_EXTENSION_FOR_OUT} file
                      </Typography>
                    </label>
                  </>
                )}
                {outFileName && (
                  <span
                    style={{
                      border: '1.3px solid #E0E0E0',
                      padding: '9px',
                      borderRadius: '5px',
                    }}
                  >
                    <IconButton
                      color="primary"
                      aria-label="upload file"
                      component="span"
                    >
                      {outFileData?.header?.Batch ? (
                        <CheckCircleIcon />
                      ) : (
                        <DangerousIcon
                          sx={{ color: theme.palette.error.main }}
                        />
                      )}
                    </IconButton>
                    <Typography
                      sx={{
                        display: 'inline',
                        color: outFileData?.header?.Batch
                          ? ''
                          : theme.palette.error.main,
                      }}
                    >
                      {outFileName}
                    </Typography>
                    <Tooltip title="Clear file">
                      <IconButton
                        aria-label="clear file"
                        onClick={handleOutFileClear}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </span>
                )}
                {outFileNameError && (
                  <Typography sx={{ color: 'red' }}>
                    The file name should be :{' '}
                    {FILE_PREFIX + batchNumber + FILE_EXTENSION_FOR_OUT}
                  </Typography>
                )}
              </Box>
            </FlexBoxSpaceBetween>
            <Box
              sx={{
                marginTop: '30px',
                marginBottom: '10px',
                textAlign: 'right',
              }}
            >
              <Button
                variant="contained"
                disabled={
                  !otaFileData?.header?.Batch || !outFileData?.header?.Batch
                }
                color="primary"
                onClick={submitToDrmApp}
                style={{
                  position: 'relative',
                  top: '-3px',
                }}
              >
                Submit to DRM
              </Button>
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
              }}
            >
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
                          value={currentBatchData[element.key]}
                          key={element.label + index}
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
                          value={currentBatchData[element.key]}
                          key={element.label + index}
                        />
                      ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
          <OtaOutFileContainer
            sx={{
              mt: 4,
              minHeight: '450px',
              width: 'calc(100vw - 160px)',
              overflowX: 'scroll',
            }}
          >
            {tableViewConfig?.tableBodyData?.length > 0 && (
              <Box sx={{ minWidth: '2400px' }}>
                <DynamicTable tableConfig={tableViewConfig || []} />
              </Box>
            )}
          </OtaOutFileContainer>
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
}

export default SingleBatchPage;

function CardWrapper({ children }) {
  return (
    <SimIndexGridItem item xs={12} ml={2}>
      <SimIndexRightPaper>{children}</SimIndexRightPaper>
    </SimIndexGridItem>
  );
}

function Row({ label, value = '' }) {
  return (
    <Stack
      direction="row"
      sx={{ typography: 'caption', textTransform: 'capitalize' }}
    >
      <Box
        component="span"
        sx={{
          minWidth: 200,
          mr: 2,
        }}
      >
        <Typography
          sx={{
            lineHeight: 2,
            fontWeight: 'bold',
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
