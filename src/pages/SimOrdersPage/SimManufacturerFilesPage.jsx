import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Drawer,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Slide,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import {
  FlexBox,
  FlexBoxSpaceBetween,
  OutFileManagerBox,
  ValidInfoBox,
} from '../../components/sim-styles/simStyles';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import {
  SimIndexGridItem,
  SimIndexRightPaper,
} from '../../components/sim-styles/simStyles.js';
import {
  setConfigTitle,
  setSimManagementTableConfigUI,
} from '../../redux/features/manage-sim/simManagementDataSlice';
import {
  buildTheCsvFileFromJson,
  editSimOrder,
  getFileGeneratorWebSocketUrl,
  getResourceDetails,
  simOrderDetails,
  uploadAllManufacturerFiles,
  uploadOutfileCsvToRMS,
} from '../../services/ApiService';
import DynamicTable from '../../components/dynamicTable/DynamicTable.jsx';
import { MANUFACTURER_FILE_STATUS } from '../sim-components/addNewSimOrderUI/stepperUIs/stepperTitles.js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  CSV_FILE_TRANSFER_BODY,
  FAILED_SUBMISSION,
  INVALID_FILES,
  PENDING,
  PHYSICAL_SIM,
  REJECTED,
  SUBMITTED,
  VALID_FILES,
} from './simOrderConstant';
import { manufacturerFileStatus_table_config } from '../tableTemplate/manufacturerFileStatusTableTemplate';
import UploadIcon from '@mui/icons-material/Upload';
import DangerousIcon from '@mui/icons-material/Dangerous';
import CircularProgress from '@mui/material/CircularProgress';
import {
  DrawerCloseBtnBox,
  DrawerFilesDetailsWrapper,
  ManufacturerDrawerInnerBox,
} from '../sim-components/simStyles';
import { manufacturerFileReport_table_config } from '../tableTemplate/manufacturerFileReportTableTemplate';
import {
  downloadCsvFormJson,
  joinOutputVariablesData,
  prepareDataForRMS,
} from '../sim-management-utils/sim-management-utils';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

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

function CardWrapper({ children }) {
  return (
    <SimIndexGridItem item xs={12} ml={2}>
      <SimIndexRightPaper sx={{ minHeight: '80vh' }}>
        {children}
      </SimIndexRightPaper>
    </SimIndexGridItem>
  );
}

const SimManufacturerFilesPage = () => {
  const simOrderGlobalData = useSelector(
    (state) => state.simManagementDataSlice.simOrderGlobalData
  );
  const navigate = useNavigate();
  const { simOrderId } = useParams();
  const [singleOrder, setSingleOrder] = useState({});
  const [orderResourceType, setOrderResourceType] = useState('');
  const [orderSimType, setOrderSimType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [zipFileName, setZipFileName] = useState('');
  const [zipFileNameError, setZipFileNameError] = useState(false);
  const [manufacturerZipFile, setManufacturerZipFile] = useState(null);
  const [fileProcessingProgress, setFileProcessingProgress] = useState(0);
  const [currentQty, setCurrentQty] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [validOtaOutPer, setValidOtaOutPer] = useState([]);
  const [invalidOtaOutPer, setInvalidOtaOutPer] = useState([]);
  const [rmsSuccessSaving, setRmsSuccessSaving] = useState([]);
  const [rmsFailureSaving, setRmsFailureSaving] = useState([]);
  const [savingToRms, setSavingToRms] = useState(false);
  const [drawerDataType, setDrawerDataType] = useState('');
  const [businessTypeKey, setBusinessTypeKey] = useState('PREPAID');
  const [expanded, setExpanded] = useState(false);

  const theme = useTheme();
  const zipFileInputRef = useRef(null);
  const { tableViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );
  const dispatch = useDispatch();
  let socket = null;

  const { allSimOrderData } = simOrderGlobalData;

  const backToAllSimOrder = () => {
    navigate('/sim-manager', { replace: true });
  };

  const handleCloseAlert = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setInfoMessage(null);
  };

  const alertSeverity = () => {
    if (infoMessage) {
      return 'info';
    }
    return errorMessage ? 'error' : 'success';
  };
  const getDrawerTableData = () => {
    if (drawerDataType === FAILED_SUBMISSION) {
      return rmsFailureSaving;
    }
    return drawerDataType == VALID_FILES ? validOtaOutPer : invalidOtaOutPer;
  };

  const backToSimOrderDetails = () => {
    navigate(`/sim-manager/${singleOrder.seq_id}`);
  };

  const resetSocket = async () => {
    return new Promise((resolve, reject) => {
      if (socket) {
        console.log('an existing socket connection found and closed');
        socket.close();
      }
      const socketUrl = getFileGeneratorWebSocketUrl();

      console.log('socketUrl', socketUrl);
      socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        setSocketConnected(true);
        console.log('WebSocket Connected');
      };

      socket.onclose = () => {
        reject(socket);
        console.log('WebSocket Disconnected');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const manufacturerFileData = data.message;
        resolve(data?.client_channel_name);

        if (manufacturerFileData.batchNumber) {
          const analysisProgress = manufacturerFileData.progress;

          const finalStatement = handleFileAnalysis(manufacturerFileData);

          if (finalStatement.result === 'Valid File') {
            setValidOtaOutPer((existing) => [...existing, finalStatement]);
          } else {
            setInvalidOtaOutPer((existing) => [...existing, finalStatement]);
          }

          setCurrentQty(analysisProgress.current);
          setTotalQty(analysisProgress.total);
          setFileProcessingProgress(
            (analysisProgress.current * 100) / analysisProgress.total
          );

          if (analysisProgress.current == analysisProgress.total) {
            setFileProcessingProgress(100);
            console.log('data ended and socket closed');
            socket.close();
          }
        }
      };
    });
  };

  const handleFileAnalysis = (manufacturerFileData) => {
    const concernedBatchData = getCurrentBatchData(
      manufacturerFileData.batchNumber
    );
    const wrongFilename = `- File name matched no \n batch in the PO`;

    let otafileStatus = {
      status: false,
      invalidKeys: [wrongFilename],
    };

    let outfileStatus = {
      status: false,
      invalidKeys: [wrongFilename],
    };

    if (concernedBatchData) {
      otafileStatus = isValidFile(
        concernedBatchData,
        manufacturerFileData.otaFileData
      );
      outfileStatus = isValidFile(
        concernedBatchData,
        manufacturerFileData.outFileData
      );
    }

    const otaErrorJoinStr = otafileStatus.invalidKeys.length > 1 ? `\n` : ' ';
    const otaRejectionMsg = `Invalid .OTA file: \n${otafileStatus.invalidKeys.join(
      otaErrorJoinStr
    )}`;

    const outErrorJoinStr = outfileStatus.invalidKeys.length > 1 ? `\n` : ' ';
    const outRejectionMsg = `Invalid .OUT file: \n${outfileStatus.invalidKeys.join(
      outErrorJoinStr
    )}`;

    const finalReport = {
      batchNumber: manufacturerFileData.batchNumber,
      otafileName: 'MNI' + manufacturerFileData.batchNumber + '.OTA',
      outfileName: 'MNI' + manufacturerFileData.batchNumber + '.OUT',
      otafileStatus: otafileStatus.status ? 'Valid File' : otaRejectionMsg,
      outfileStatus: outfileStatus.status ? 'Valid File' : outRejectionMsg,
      result:
        otafileStatus.status && outfileStatus.status
          ? 'Valid File'
          : 'Invalid File',
    };

    const { otaFileData, outFileData } = manufacturerFileData;

    return { ...finalReport, otaFileData, outFileData };
  };

  const getSimOrderData = async () => {
    try {
      const searchResult = await simOrderDetails(simOrderId);
      // console.log(searchResult[0]);
      const simOrderDetailsToDisplay = {
        ...searchResult[0],
        allBatchMapping: searchResult[0].allBatchMapping.map((batchObj) => {
          return { ...batchObj, simOrderId };
        }),
      };
      // console.log(simOrderDetailsToDisplay);
      setSingleOrder(simOrderDetailsToDisplay);
      setOrderSimType(simOrderDetailsToDisplay.simType);
      setOrderResourceType(
        simOrderDetailsToDisplay['initialRequest'].resourceType
      );
    } catch (error) {
      return [];
    }
  };

  const getCurrentBatchData = (batchNumberToFind) => {
    const currentBatchData = singleOrder.allBatchMapping.find(
      (batchObj) =>
        batchObj.batchNumber.toString() === batchNumberToFind.toString()
    );
    return currentBatchData;
  };

  const provideZipFile = (event) => {
    let expectedFileName;
    const file = event.target.files[0];

    const currentFileName = file?.name;

    setZipFileName(currentFileName);

    expectedFileName = 'OUTPUT_' + singleOrder['purchaseOrder'] + '.zip';

    if (currentFileName == expectedFileName) {
      setManufacturerZipFile(file);
      setErrorMessage(null);
      setZipFileNameError(false);
    } else {
      setZipFileName('');
      setSuccessMessage(null);
      setInfoMessage(null);
      setErrorMessage(
        'File should be: ' +
          expectedFileName +
          ' and root folder should be: ' +
          'OUTPUT_' +
          singleOrder['purchaseOrder']
      );
      setZipFileNameError(true);
      handleZipFileClear(event);
      setIsOpen(true);
    }
  };

  const isValidFile = (currentBatchData, fileData) => {
    const validPurchaseOrder =
      singleOrder['purchaseOrder'] === fileData?.header['PO_ref_number'];
    const validQuantity =
      Number(currentBatchData?.quantityInBatch) ===
      Number(fileData?.header['Quantity']);

    //console.log(currentBatchData.quantityInBatch);
    //console.log(fileData.header['Quantity']);

    const validBatchNumber =
      currentBatchData?.batchNumber === fileData?.header['Batch'];
    const validImsiStart =
      currentBatchData?.imsiStartNumber === fileData?.input_variables['IMSI'];
    const validImsiEnd =
      currentBatchData?.imsiEndNumber ===
      fileData?.output_variables[fileData?.output_variables?.length - 1][
        'IMSI'
      ];
    const eSimQr = fileData?.output_variables[0]['QR'];
    const isEsim = orderResourceType === 'E-SIM';
    const validResource = isEsim ? !!eSimQr : !eSimQr;

    const validNumberOfRecords =
      Number(currentBatchData?.quantityInBatch) ===
      Number(fileData?.output_variables?.length);

    const isValidManufacturerFile =
      validPurchaseOrder &&
      validBatchNumber &&
      validImsiStart &&
      validImsiEnd &&
      validResource &&
      validQuantity &&
      validNumberOfRecords;

    const keysMatching = [
      { key: '- Purchase Order', isValid: validPurchaseOrder },
      { key: '- Batch Number', isValid: validBatchNumber },
      { key: '- Imsi Start', isValid: validImsiStart },
      { key: '- Imsi End', isValid: validImsiEnd },
      {
        key: `- File does not match for ${orderResourceType}`,
        isValid: validResource,
      },
      { key: '- Quantity', isValid: validQuantity },
      { key: '- Number Of Records', isValid: validNumberOfRecords },
    ];

    const invalidKeys = keysMatching
      .filter((keyObj) => !keyObj.isValid)
      .map((keyObject) => keyObject.key);

    return { status: isValidManufacturerFile, invalidKeys };
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    resetSocket()
      .then(async (clientChannelName) => {
        formData.append('clientChannelName', clientChannelName);

        try {
          await sendFileToAnalysis(formData);
        } catch (error) {
          if (socket) {
            console.log(
              'An error occurred during file upload... and socket closed'
            );
            socket.close();
          }
          setErrorMessage(
            'An error occurred during file upload. Please try again.'
          );
          console.error('File upload error:', error);
        } finally {
          if (socket) {
            console.log('File analysis terminated and socket closed');
            socket.close();
          }
          setIsOpen(true);
          setManufacturerZipFile(null);
          setZipFileName('');
          setZipFileNameError(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setInfoMessage(
          'Files Analysis is on going. Response may take some time'
        );
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsOpen(true);
        formData.append('clientChannelName', 'defaultChannel');
        sendFileToAnalysis(formData);
      });
  };

  const sendFileToAnalysis = async (formData) => {
    setIsAnalyzing(true);
    const response = await uploadAllManufacturerFiles(formData);
    const manufacturerFileData = response?.data;
    // console.log(manufacturerFileData);
    if (manufacturerFileData?.length) {
      setSocketConnected(true);
      const validOtaOutPerList = [];
      const invalidOtaOutPerList = [];
      manufacturerFileData?.forEach((element) => {
        const validityCheckObj = handleFileAnalysis(element);
        if (validityCheckObj.result === 'Valid File') {
          validOtaOutPerList.push(validityCheckObj);
        } else {
          invalidOtaOutPerList.push(validityCheckObj);
        }
      });
      setInvalidOtaOutPer(invalidOtaOutPerList);
      setValidOtaOutPer(validOtaOutPerList);
      setCurrentQty(manufacturerFileData.length);
      setTotalQty(manufacturerFileData.length);
      setFileProcessingProgress(100);
      if (socket) {
        console.log('Final files analysis response provided and socket closed');
        socket.close();
      }
      setSuccessMessage('Files analysis done successfully !');
    } else {
      if (socket) {
        console.log(
          "The file uploaded couldn't be analyzed... and socket closed"
        );
        socket.close();
      }
      setIsAnalyzing(false);
      setSuccessMessage(null);
      setInfoMessage(null);
      setErrorMessage(
        "Unexpected error: The file uploaded couldn't be analyzed..."
      );
      setIsOpen(true);
    }
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

  const handleZipFileClear = (event) => {
    event.preventDefault();
    setZipFileName('');
    if (zipFileInputRef.current) {
      zipFileInputRef.current.value = '';
    }
  };

  const toggleDrawer = (isOpen) => {
    setOpenDrawer(isOpen);
    if (!isOpen) {
      //cleanDataAndLeave();
    }
  };

  const viewAnalysisDetails = (drawerDataType) => {
    setDrawerDataType(drawerDataType);
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: manufacturerFileReport_table_config,
      })
    );
    setOpenDrawer(true);
  };

  const downloadErrorReport = async () => {
    const fileName = singleOrder['purchaseOrder'] + '_OTA_OUT_ERROR_REPORT.csv';

    const errorReportData = invalidOtaOutPer.map((item) => {
      return {
        batchNumber: item.batchNumber,
        otafileName: item.otafileName,
        otafileStatus: item.otafileStatus,
        outfileName: item.outfileName,
        outfileStatus: item.outfileStatus,
        result: item.result,
      };
    });
    // console.log(errorReportData);
    downloadCsvFormJson(errorReportData, fileName);
  };

  const submitValidFiles = async () => {
    const successResults = [];
    const failureResults = [];
    setSavingToRms(true);
    setRmsSuccessSaving([]);
    setRmsFailureSaving([]);

    for (const item of validOtaOutPer) {
      const {
        batchNumber,
        otaFileData,
        outFileData,
        otafileName,
        outfileName,
      } = item;

      try {
        await submitToRmsApp(batchNumber, otaFileData, outFileData);
        successResults.push({ ...item });
      } catch (error) {
        // console.log('error throw', error);
        failureResults.push({
          batchNumber,
          otafileName,
          outfileName,
          error: error.message,
        });
      }
    }
    setSavingToRms('DONE');
    setRmsSuccessSaving(successResults);
    setRmsFailureSaving(failureResults);

    console.log('submitValidFiles results', failureResults);
    //return results;
  };

  const submitToRmsApp = async (batchNumber, otaFileData, outFileData) => {
    const transportKey = singleOrder['initialRequest'].transportKey;
    const combinedOutFileData = joinOutputVariablesData(
      otaFileData,
      outFileData,
      businessTypeKey,
      transportKey
    );
    // console.log(combinedOutFileData);
    const csvArrayOfObject = prepareDataForRMS(combinedOutFileData);

    const currentBatchData = getCurrentBatchData(batchNumber);

    const { categoryId, schemaId } = await getCategoryAndSchemaId(
      currentBatchData
    );

    if (!categoryId || !schemaId) {
      console.log('Throw error', { categoryId, schemaId });

      throw new Error(
        `An error occurred while getting categoryId and schemaId from RMS resource: ${orderResourceType}`
      );
    }

    const { rmsCsvFile, columnMapping, rmsCsvFileName } =
      await generateCsvFileData(csvArrayOfObject, batchNumber);

    if (!rmsCsvFile || !columnMapping) {
      throw new Error(
        'An error occurred while generating the CSV file for RMS'
      );
    }

    const formData = new FormData();
    formData.append('file', rmsCsvFile);
    formData.append('columnMapping', columnMapping);
    formData.append('categoryId', categoryId);
    formData.append('schemaId', schemaId);
    Object.keys(CSV_FILE_TRANSFER_BODY).forEach((bodyKey) => {
      formData.append(bodyKey, CSV_FILE_TRANSFER_BODY[bodyKey]);
    });

    // console.log('Ready to be sent to RMS', formData);
    const rmsResponse = await transferCsvToRms(formData, rmsCsvFileName);

    if (rmsResponse.data) {
      await updateTheBatchAndSave(batchNumber, SUBMITTED);
    }
  };

  const transferCsvToRms = async (formData, rmsCsvFileName) => {
    try {
      const rmsResponse = await uploadOutfileCsvToRMS(formData);
      // console.log('rmsResponse', rmsResponse);

      setErrorMessage(null);
      setSuccessMessage(
        'A CSV file was successfully sent to RMS: ' + rmsCsvFileName
      );
      setIsOpen(true);
      return rmsResponse;
    } catch (error) {
      setErrorMessage(
        'An error occurred when transferring the csv file to RMS'
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
            return {
              ...batchObj,
              manufacturerFilesStatus: status,
              manufacturerFilesInfo:
                '.OTA and .OUT files successfully submitted.',
            };
          }
          return batchObj;
        }
      );

      const simOrderDataToEdit = {
        ...searchResult[0],
        allBatchMapping,
      };

      delete simOrderDataToEdit._id;

      const simOrderUpdateResponse = await editSimOrder(simOrderDataToEdit);
      console.log('simOrderUpdateResponse', simOrderUpdateResponse);
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

  const getCategoryAndSchemaId = async () => {
    try {
      const allResourceDetails = await getResourceDetails();

      // console.log('allResourceDetails', allResourceDetails.data);

      if (!allResourceDetails.data.length) {
        throw new Error(
          `Resource endpoint respond with error. content: ${JSON.stringify(
            allResourceDetails
          )}`
        );
      }

      const currentResourceDetails = allResourceDetails.data.find((obj) => {
        let resourceTypeConcerned = orderResourceType;
        if (orderResourceType == PHYSICAL_SIM) {
          resourceTypeConcerned = 'SIM';
        }
        return obj.name == resourceTypeConcerned;
      });
      // console.log('currentResourceDetails', currentResourceDetails);

      const categoryId = currentResourceDetails?.id;
      const schemaId = currentResourceDetails?.categorySchema;
      if (!categoryId || !schemaId) {
        setErrorMessage(
          "We couldn't find a resource category called : " +
            orderResourceType +
            ' in RMS resource inventory. Kindly check if ' +
            orderResourceType +
            ' is currently in the available resource category of RMS'
        );
        setSuccessMessage(null);
        setInfoMessage(null);
        setIsOpen(true);
        return { categoryId: null, schemaId: null };
      }
      return { categoryId, schemaId };
    } catch (error) {
      console.log(error);
      setErrorMessage("Couldn't fetch resource data for: " + orderResourceType);
      setSuccessMessage(null);
      setInfoMessage(null);
      setIsOpen(true);
      return { categoryId: null, schemaId: null };
    }
  };

  const generateCsvFileData = async (csvArrayOfObject, batchNumber) => {
    // console.log('csvArrayOfObject', csvArrayOfObject);
    try {
      const csvResponse = await buildTheCsvFileFromJson(
        JSON.stringify(csvArrayOfObject)
      );
      // console.log('csvResponse', csvResponse);

      if (csvResponse.data) {
        // DOWNLOAD CSV =============================================
        const url = window.URL.createObjectURL(new Blob([csvResponse.data]));
        const link = document.createElement('a');
        link.href = url;
        const rmsCsvFileName = batchNumber + '_OTA_OUT_FOR_RMS.csv';
        link.setAttribute('download', rmsCsvFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // SEND CSV TO RMS =========================================
        const rmsCsvFile = new File([csvResponse.data], rmsCsvFileName, {
          type: 'text/csv',
        });

        let columnMapping = '';

        const csvFileKeyList = Object.keys(csvArrayOfObject[0]);

        csvFileKeyList.forEach((key, index) => {
          const lastIndex = csvFileKeyList.length - 1;
          let keyToAppend = `${key},`;
          if (index == lastIndex) {
            keyToAppend = `${key}`;
          }
          columnMapping = columnMapping + keyToAppend;
        });
        return { rmsCsvFile, columnMapping, rmsCsvFileName };
      } else {
        setErrorMessage("Couldn't generate CSV file for Batch: " + batchNumber);
        setSuccessMessage(null);
        setInfoMessage(null);
        setIsOpen(true);
        return { rmsCsvFile: null, columnMapping: null, rmsCsvFileName: null };
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Couldn't generate CSV file for Batch: " + batchNumber);
      setSuccessMessage(null);
      setInfoMessage(null);
      setIsOpen(true);
      return { rmsCsvFile: null, columnMapping: null, rmsCsvFileName: null };
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    dispatch(setConfigTitle(MANUFACTURER_FILE_STATUS));
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: manufacturerFileStatus_table_config,
      })
    );
    if (!allSimOrderData.length || !singleOrder) {
      return backToAllSimOrder();
    }
    getSimOrderData();
    return () => {
      if (socket) {
        console.log('UseEffect and socket closed');
        socket.close();
      }
    };
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
                SIM MANUFACTURER FILES UPLOAD ( Purchase Order:{' '}
                {singleOrder['purchaseOrder']})
              </Typography>
            </Box>
            <Box>
              <IconButton
                aria-label="Back to sim order details"
                onClick={backToSimOrderDetails}
              >
                <ClearIcon />
              </IconButton>
            </Box>
          </FlexBoxSpaceBetween>

          {!isAnalyzing && (
            <>
              <Card
                variant="outlined"
                sx={{
                  mt: 4,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    paddingBottom: '20px',
                  }}
                >
                  <Box sx={{ marginBottom: '30px', width: '600px' }}>
                    <Box sx={{ marginBottom: '10px', width: '300px' }}>
                      Resource Type : {orderResourceType}
                    </Box>
                  </Box>
                  <FlexBoxSpaceBetween>
                    <Box sx={{ marginBottom: '10px', width: '150px' }}>
                      <TextField
                        size="small"
                        name="simType"
                        label="Sim Type"
                        value={orderSimType}
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

                    <Box>
                      {!zipFileName && (
                        <>
                          <input
                            ref={zipFileInputRef}
                            accept={'.zip'}
                            style={{ display: 'none' }}
                            id="file-input"
                            type="file"
                            onChange={(e) => provideZipFile(e)}
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
                              Manufacturer .ZIP file
                            </Typography>
                          </label>
                        </>
                      )}

                      {zipFileName && (
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
                            {zipFileName && !zipFileNameError ? (
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
                              color:
                                zipFileName && !zipFileNameError
                                  ? ''
                                  : theme.palette.error.main,
                            }}
                          >
                            {zipFileName}
                          </Typography>
                          <Tooltip title="Clear file">
                            <IconButton
                              aria-label="clear file"
                              onClick={handleZipFileClear}
                            >
                              <ClearIcon />
                            </IconButton>
                          </Tooltip>
                        </span>
                      )}
                      {zipFileNameError && (
                        <Typography sx={{ color: 'red' }}>
                          Wrong file please try again !
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        position: 'relative',
                        top: '4px',
                        marginLeft: '15px',
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={!zipFileName}
                        color="primary"
                        onClick={() => handleFileUpload(manufacturerZipFile)}
                        style={{
                          position: 'relative',
                          top: '-3px',
                        }}
                      >
                        Analyze Manufacturer file
                      </Button>
                    </Box>
                  </FlexBoxSpaceBetween>
                </Box>
              </Card>
              <Card sx={{ marginTop: '30px' }}>
                <Box>
                  {outfileSummary.map(
                    (outfileReport, index) =>
                      outfileReport?.data?.length > 0 && (
                        <Accordion
                          key={outfileReport?.label + index}
                          expanded={expanded == outfileReport.panel}
                          onChange={handleChange(outfileReport.panel)}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${outfileReport.panel}bh-content`}
                            id={`${outfileReport.panel}bh-header`}
                          >
                            <Row
                              icon={outfileReport.icon}
                              label={outfileReport.label}
                              value={outfileReport.value}
                            ></Row>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box>
                              {outfileReport?.data?.length > 0 && (
                                <DynamicTable
                                  tableConfig={{
                                    ...tableViewConfig,
                                    tableBodyData: outfileReport?.data,
                                  }}
                                />
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      )
                  )}
                </Box>
              </Card>
            </>
          )}

          {isAnalyzing && (
            <Card
              variant="outlined"
              sx={{
                mt: 4,
                p: 2,
              }}
            >
              {savingToRms == false && (
                <Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      paddingBottom: '20px',
                    }}
                  >
                    <OutFileManagerBox>
                      <Box>
                        <Typography variant="h6">
                          <b>Bulk File Analysis realtime report:</b>
                        </Typography>
                      </Box>
                    </OutFileManagerBox>

                    <Box
                      sx={{
                        width: '500px',
                        marginX: 'auto',
                        p: 4,
                        textAlign: 'center',
                      }}
                    >
                      <Box>
                        {socketConnected && (
                          <>
                            {currentQty}/{totalQty} files analyzed
                          </>
                        )}
                      </Box>
                      <Box sx={{ textAlign: 'center', marginBottom: '15px' }}>
                        {socketConnected ? (
                          <LinearProgress
                            sx={{ marginTop: '15px' }}
                            variant="determinate"
                            value={fileProcessingProgress}
                          />
                        ) : (
                          <LinearProgress />
                        )}
                      </Box>
                      {fileProcessingProgress < 100 && (
                        <>
                          <Typography variant="subtitle2">
                            The manufacturer .OTA and .OUT files are currently
                            under analysis.
                          </Typography>
                          <Typography variant="subtitle2">
                            This operation may take some times depending on
                            files size...
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                  <FlexBoxSpaceBetween>
                    <Paper sx={{ width: '45%', p: 2 }}>
                      <FlexBoxSpaceBetween>
                        <FlexBox sx={{ position: 'relative', top: '10px' }}>
                          {fileProcessingProgress < 100 && (
                            <Box>
                              <CircularProgress size="20px" />
                            </Box>
                          )}
                          <Box sx={{ marginLeft: '10px' }}>
                            <ValidInfoBox
                              component="span"
                              sx={{
                                backgroundColor: theme.palette.primary.main,
                              }}
                            >
                              {validOtaOutPer.length} Valid
                            </ValidInfoBox>
                            .OTA/.OUT files found
                          </Box>
                        </FlexBox>
                        {validOtaOutPer.length > 0 && (
                          <Box
                            sx={{
                              position: 'relative',
                              top: '4px',
                              marginLeft: '15px',
                            }}
                          >
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => viewAnalysisDetails(VALID_FILES)}
                              style={{
                                position: 'relative',
                                top: '-3px',
                              }}
                            >
                              View details
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => submitValidFiles()}
                              style={{
                                position: 'relative',
                                top: '-3px',
                              }}
                            >
                              <b>Submit</b>
                            </Button>
                          </Box>
                        )}
                      </FlexBoxSpaceBetween>
                    </Paper>
                    <Paper sx={{ width: '45%', p: 2 }}>
                      <FlexBoxSpaceBetween>
                        <FlexBox sx={{ position: 'relative', top: '10px' }}>
                          {fileProcessingProgress < 100 && (
                            <Box>
                              <CircularProgress size="20px" />
                            </Box>
                          )}
                          <Box sx={{ marginLeft: '10px' }}>
                            <ValidInfoBox
                              component="span"
                              sx={{
                                backgroundColor: theme.palette.error.main,
                                color: '#FFF',
                              }}
                            >
                              {invalidOtaOutPer.length} Invalid
                            </ValidInfoBox>
                            .OTA/.OUT files found
                          </Box>
                        </FlexBox>
                        {invalidOtaOutPer.length > 0 && (
                          <Box
                            sx={{
                              position: 'relative',
                              top: '4px',
                              marginLeft: '15px',
                            }}
                          >
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => viewAnalysisDetails(INVALID_FILES)}
                              style={{
                                position: 'relative',
                                top: '-3px',
                              }}
                            >
                              View details
                            </Button>
                          </Box>
                        )}
                      </FlexBoxSpaceBetween>
                    </Paper>
                  </FlexBoxSpaceBetween>
                </Box>
              )}
              {savingToRms == true && (
                <Box sx={{ marginTop: '60px', width: '50%', marginX: 'auto' }}>
                  <Box sx={{ textAlign: 'center', marginBottom: '15px' }}>
                    <CircularProgress size="50px" />
                  </Box>
                </Box>
              )}
              {savingToRms === 'DONE' && (
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
                    {rmsSuccessSaving.length > 0 && (
                      <Box sx={{ marginLeft: '30px' }}>
                        <Typography variant="body2">
                          <CheckCircleIcon
                            sx={{
                              marginRight: '10px',
                              position: 'relative',
                              top: '6px',
                            }}
                          />
                          {rmsSuccessSaving.length} .OTA/.OUT files CSV was
                          successfully sent to RMS
                        </Typography>
                      </Box>
                    )}
                    {rmsFailureSaving.length > 0 && (
                      <Box sx={{ marginLeft: '30px' }}>
                        <Typography variant="body2">
                          <InfoIcon
                            sx={{
                              marginRight: '10px',
                              position: 'relative',
                              top: '6px',
                            }}
                          />
                          {rmsFailureSaving.length} CSV files sending failed...
                          (
                          <Typography
                            component="span"
                            sx={{ cursor: 'pointer' }}
                            onClick={() =>
                              viewAnalysisDetails(FAILED_SUBMISSION)
                            }
                          >
                            View error detail
                          </Typography>
                          ).
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
                        onClick={() => backToSimOrderDetails()}
                      >
                        Back to Sim Order details
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Card>
          )}
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
          severity={alertSeverity()}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage || successMessage || infoMessage}
        </Alert>
      </Snackbar>

      <Drawer
        anchor={'bottom'}
        open={openDrawer}
        onClose={() => {
          toggleDrawer(false);
        }}
      >
        <ManufacturerDrawerInnerBox>
          <DrawerCloseBtnBox>
            <FlexBoxSpaceBetween>
              {drawerDataType == INVALID_FILES && (
                <Box sx={{ marginRight: '20px' }}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => downloadErrorReport()}
                    style={{
                      position: 'relative',
                      top: '3px',
                    }}
                  >
                    <DownloadForOfflineIcon
                      color={theme.palette.primary.main}
                    />{' '}
                    Download Error Report
                  </Button>
                </Box>
              )}
              <Box>
                <IconButton
                  sx={{ zIndex: '2' }}
                  onClick={() => toggleDrawer(false)}
                >
                  <ClearIcon fontSize="3rem" />
                </IconButton>
              </Box>
            </FlexBoxSpaceBetween>
          </DrawerCloseBtnBox>
          <DrawerFilesDetailsWrapper>
            <Box sx={{ marginY: '25px' }}>
              <Typography>
                {drawerDataType != FAILED_SUBMISSION && (
                  <b> Files analysis details: </b>
                )}
                <ValidInfoBox
                  component="span"
                  sx={{
                    backgroundColor:
                      drawerDataType == VALID_FILES
                        ? theme.palette.primary.main
                        : theme.palette.error.main,
                    color: '#FFF',
                  }}
                >
                  {drawerDataType == VALID_FILES && (
                    <>{validOtaOutPer.length} valid files records found</>
                  )}
                  {drawerDataType == INVALID_FILES && (
                    <>{validOtaOutPer.length} valid files records found</>
                  )}
                  {drawerDataType == FAILED_SUBMISSION && (
                    <>{rmsFailureSaving.length} CSV files sending failed</>
                  )}
                </ValidInfoBox>
              </Typography>
            </Box>
            <Box>
              <DynamicTable
                tableStyle={{ whiteSpace: 'pre-wrap' }}
                tableWidth="94vw"
                tableConfig={{
                  ...tableViewConfig,
                  tableBodyData: getDrawerTableData(),
                }}
              />
            </Box>
          </DrawerFilesDetailsWrapper>
        </ManufacturerDrawerInnerBox>
      </Drawer>
    </>
  );
};

export default SimManufacturerFilesPage;
