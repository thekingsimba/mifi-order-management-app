import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  StepperNavigation,
  AddHlrCardContainer,
  AddHlrCard,
  FlexBox,
  FlexBoxSpaceBetween,
} from '../../../../components/sim-styles/simStyles.js';
import DynamicTable from '../../../../components/dynamicTable/DynamicTable.jsx';
import { useDispatch, useSelector } from 'react-redux';
import HlrRequestCard from './setterUIcomponents/HlrRequestCard.jsx';
import SimCardIcon from '@mui/icons-material/SimCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import {
  setRequestMappingData,
  setSimManagementTableConfigUI,
} from '../../../../redux/features/manage-sim/simManagementDataSlice.js';
import { batch_mapping_simulation_table_config } from '../../../tableTemplate/batchMappingTableTemplate.js';
import { addPrefix } from '../../../sim-management-utils/sim-management-utils.js';
import { UDCHLR } from 'src/pages/appConfigPage/SimManagementTableFormUI/configTitleConstant.js';
import {
  FILE_EXTENSION_FOR_OTA,
  FILE_EXTENSION_FOR_OUT,
  FILE_PREFIX,
  INFILE_EXTENSION,
  PENDING,
  PENDING_INFO,
} from 'src/pages/SimOrdersPage/simOrderConstant.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RangeNumberSummaryCard from './setterUIcomponents/RangeNumberSummaryCard.jsx';

function RangeMappingSimulator({
  previousStepFn = () => {},
  nextStepFn = () => {},
}) {
  const { configTitle, tableViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const { basicSimOrderData, hlrRequestSampleData } = useSelector(
    (state) => state.simManagementDataSlice.createNewSimOrderFormData
  );

  const { allSerialNumberRange, allBatchNumberRange, allImsiNumberRange } =
    useSelector((state) => state.simManagementDataSlice.simHlrRangeData);

  const [totalNbOfBatch, setTotalNbOfBatch] = useState(0);
  const [expanded, setExpanded] = useState('accordionNb0');

  const populateTableConfig = (configObject, tableDataArray) => {
    return { ...configObject, tableBodyData: tableDataArray };
  };

  const dispatch = useDispatch();
  const theme = useTheme();

  const divideOrderInBatches = (totalSimQuantity) => {
    // set serial number ===============================
    const activeSerial = allSerialNumberRange.find(
      (srObj) => srObj.status === 'active'
    );

    let nextSerialNumber = activeSerial.nextSrNumber;

    // set imsi number ==================================
    let nextImsiNumber;
    const activeImsi = allImsiNumberRange.find(
      (imsIObj) =>
        imsIObj.status === 'active' &&
        imsIObj.hlrFur === basicSimOrderData.hlrFur
    );

    if (basicSimOrderData.hlrFur != UDCHLR) {
      nextImsiNumber = activeImsi.nextNumber;
      //console.log(nextImsiNumber);
    } else {
      nextImsiNumber = hlrRequestSampleData.imsiStartNumber;
    }

    let imsiPrefixNumber;
    if (basicSimOrderData.hlrFur != UDCHLR) {
      imsiPrefixNumber = activeImsi.imsiPrefixNumber.toString();
    } else {
      imsiPrefixNumber = hlrRequestSampleData.imsiStartNumber
        .toString()
        .slice(0, 6);
    }

    // set Batch number =====================================
    const activeBatchNb = allBatchNumberRange.find(
      (batchObj) => batchObj.status === 'active'
    );
    let nextBatchNumber = activeBatchNb.nextNumber;

    // Set formatter to display data when finish calculation =====================
    const formatter = {
      batchNumber: {
        prefix: '',
        suffixLength: 6,
      },
      serialStartNumber: {
        prefix: activeSerial.serialNumberPrefix.toString(),
        suffixLength: 10,
      },
      serialEndNumber: {
        prefix: activeSerial.serialNumberPrefix.toString(),
        suffixLength: 10,
      },
      imsiStartNumber: {
        prefix: basicSimOrderData.hlrFur != UDCHLR ? imsiPrefixNumber : '',
        suffixLength: 9,
      },
      imsiEndNumber: {
        prefix: basicSimOrderData.hlrFur != UDCHLR ? imsiPrefixNumber : '',
        suffixLength: 9,
      },
    };

    //console.log(formatter);

    // turn all to Number =============================
    nextSerialNumber = Number(nextSerialNumber);
    nextImsiNumber = Number(nextImsiNumber);
    nextBatchNumber = Number(nextBatchNumber);

    // assign range numbers to each batch and generate batch details ====
    const allBatchDetails = [];

    const numberOfBatches =
      Number(totalSimQuantity) > 5000
        ? Math.floor(Number(totalSimQuantity) / 5000)
        : 1;

    const extraBatch =
      numberOfBatches == 1 ? 0 : Number(totalSimQuantity) % 5000;

    for (let i = 0; i < numberOfBatches; i++) {
      const quantityInBatch = numberOfBatches > 1 ? 5000 : totalSimQuantity;
      const batchObject = {
        batchNumber: nextBatchNumber,
        quantityInBatch: quantityInBatch,
        serialStartNumber: nextSerialNumber,
        serialEndNumber: nextSerialNumber + (quantityInBatch - 1),
        imsiStartNumber: nextImsiNumber,
        imsiEndNumber: Number(nextImsiNumber) + (quantityInBatch - 1),
        poNumber: basicSimOrderData.purchaseOrder,
        hlrFur: basicSimOrderData.hlrFur,
        infileName: FILE_PREFIX + nextBatchNumber + INFILE_EXTENSION,
        otafileName: FILE_PREFIX + nextBatchNumber + FILE_EXTENSION_FOR_OTA,
        outfileName: FILE_PREFIX + nextBatchNumber + FILE_EXTENSION_FOR_OUT,
        manufacturerFilesStatus: PENDING,
        manufacturerFilesInfo: PENDING_INFO,
      };
      allBatchDetails.push(batchObject);
      nextSerialNumber = nextSerialNumber + 5000;
      nextImsiNumber = nextImsiNumber + 5000;
      nextBatchNumber = nextBatchNumber + 1;
    }

    // add extra batch
    if (extraBatch > 0) {
      allBatchDetails.push({
        batchNumber: nextBatchNumber,
        quantityInBatch: extraBatch,
        serialStartNumber: nextSerialNumber,
        serialEndNumber: Number(nextSerialNumber) + Number(extraBatch) - 1,
        imsiStartNumber: nextImsiNumber,
        imsiEndNumber: Number(nextImsiNumber) + Number(extraBatch) - 1,
        poNumber: basicSimOrderData.purchaseOrder,
        hlrFur: basicSimOrderData.hlrFur,
        infileName: FILE_PREFIX + nextBatchNumber + INFILE_EXTENSION,
        otafileName: FILE_PREFIX + nextBatchNumber + FILE_EXTENSION_FOR_OTA,
        outfileName: FILE_PREFIX + nextBatchNumber + FILE_EXTENSION_FOR_OUT,
        manufacturerFilesStatus: PENDING,
        manufacturerFilesInfo: PENDING_INFO,
      });
      setTotalNbOfBatch(numberOfBatches + 1);
    } else {
      setTotalNbOfBatch(numberOfBatches);
    }

    const allBatchDetailsReformated = allBatchDetails.map((batchObject) => {
      const batchObjectFormatted = {};
      // console.log(batchObject);
      Object.keys(batchObject).forEach((key) => {
        if (formatter[key]?.prefix) {
          batchObjectFormatted[key] = addPrefix(
            formatter[key].prefix,
            formatter[key].suffixLength,
            batchObject[key]
          );
        } else {
          batchObjectFormatted[key] = batchObject[key].toString();
        }
      });

      return {
        ...batchObjectFormatted,
        simType: basicSimOrderData.simType,
        simCategory: basicSimOrderData.simCategory,
      };
    });

    // display batch mapping table
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: populateTableConfig(
          batch_mapping_simulation_table_config,
          allBatchDetailsReformated
        ),
      })
    );
    // save batch mapping details for final persistence
    dispatch(setRequestMappingData(allBatchDetailsReformated));
  };

  const handleAccordionChange = (accordionNb) => (event, isExpanded) => {
    setExpanded(isExpanded ? accordionNb : false);
  };

  useEffect(() => {
    divideOrderInBatches(basicSimOrderData.simTotalQuantity);
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '1200px',
          marginInline: 'auto',
          minHeight: '58vh',
          marginTop: '5px',
          padding: '10px 0 0 0',
        }}
      >
        <Box sx={{ marginBottom: '30px' }}>
          <Accordion
            sx={{ marginY: '20px', cursor: 'pointer' }}
            expanded={expanded == 'accordionNb'}
            onChange={handleAccordionChange('accordionNb')}
          >
            <AccordionSummary
              sx={{
                backgroundColor: expanded
                  ? '#fff'
                  : `${theme.palette.primary.main}`,
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`accordionNb`}
              id={`accordionNb`}
            >
              Sim order details
            </AccordionSummary>
            <AccordionDetails>
              <FlexBox>
                <Box sx={{ padding: '5px', width: '100%' }}>
                  <AddHlrCard>
                    <FlexBoxSpaceBetween>
                      <RangeNumberSummaryCard
                        hlrFur={basicSimOrderData.hlrFur}
                        serialNbRange={allSerialNumberRange}
                        imsiNbRange={allImsiNumberRange}
                        batchNumberRange={allBatchNumberRange}
                      />
                      <HlrRequestCard
                        title="  Purchase Order overview"
                        cardWidth="30%"
                        keyWidth="130px"
                        titleIcon={
                          <ShoppingCartIcon
                            sx={{ position: 'relative', top: '3px' }}
                          />
                        }
                        allowAction={false}
                        hlrRequested={basicSimOrderData}
                      />
                      <HlrRequestCard
                        title={`${basicSimOrderData.hlrFur} details`}
                        cardWidth="30%"
                        keyWidth="130px"
                        titleIcon={
                          <SimCardIcon
                            sx={{ position: 'relative', top: '3px' }}
                          />
                        }
                        allowAction={false}
                        hlrRequested={hlrRequestSampleData}
                        editHlrRequestFn={() => {}}
                      />
                    </FlexBoxSpaceBetween>
                  </AddHlrCard>
                </Box>
              </FlexBox>
            </AccordionDetails>
          </Accordion>
        </Box>
        <FlexBox>
          <Box sx={{ padding: '5px', width: '100%' }}>
            <AddHlrCard>
              <AddHlrCardContainer>
                <CardContent>
                  <Box sx={{ marginBottom: '10px' }}>
                    <Typography>
                      <b>{configTitle}</b>
                    </Typography>
                    <Typography variant="body2">
                      The {basicSimOrderData.simTotalQuantity} units of{' '}
                      {basicSimOrderData.hlrFur} will be divided in{' '}
                      {totalNbOfBatch} Batches ( of 5000 HLR maximum inside of
                      each ) mapped this way:{' '}
                    </Typography>
                  </Box>
                  {tableViewConfig?.tableBodyData?.length > 0 && (
                    <Box>
                      <DynamicTable tableConfig={tableViewConfig} />
                    </Box>
                  )}
                </CardContent>
              </AddHlrCardContainer>
            </AddHlrCard>
          </Box>
        </FlexBox>
      </Box>

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
          {/* {hlrRequestData.length > 0 && !showForm && (
            <>bring back next button here</>
          )} */}
          <Button
            sx={{ position: 'absolute', right: '10px' }}
            type="button"
            variant="contained"
            onClick={() => nextStepFn()}
          >
            Next
          </Button>
        </Box>
      </StepperNavigation>
    </>
  );
}

export default RangeMappingSimulator;
