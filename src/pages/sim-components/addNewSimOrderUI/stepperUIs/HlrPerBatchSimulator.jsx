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
  AddHlrCard,
  AddHlrCardContainer,
  FlexBox,
  StepperNavigation,
} from '../../../../components/sim-styles/simStyles';
import DynamicTable from '../../../../components/dynamicTable/DynamicTable';
import HlrRequestCard from './setterUIcomponents/HlrRequestCard';
import FolderIcon from '@mui/icons-material/Folder';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setSimManagementTableConfigUI } from '../../../../redux/features/manage-sim/simManagementDataSlice';
import { hlr_in_batch_table_config } from '../../../tableTemplate/hlrInBatchTableTemplate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  addPrefix,
  removePrefix,
} from 'src/pages/sim-management-utils/sim-management-utils';
function HlrPerBatchSimulator({
  previousStepFn = () => {},
  nextStepFn = () => {},
  getHlrListInLocalState = () => {},
}) {
  const [expanded, setExpanded] = useState('accordionNb0');
  const [allHlrPerBatch, setAllHlrPerBatch] = useState([]);

  const handleChange = (accordionNb) => (event, isExpanded) => {
    setExpanded(isExpanded ? accordionNb : false);
  };

  const { basicSimOrderData, hlrRequestSampleData, requestMappingData } =
    useSelector(
      (state) => state.simManagementDataSlice.createNewSimOrderFormData
    );

  const { tableViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const theme = useTheme();
  const dispatch = useDispatch();

  const populateTableConfig = (configObject, tableDataArray) => {
    return { ...configObject, tableBodyData: tableDataArray };
  };

  const buildAllHlrPerBatch = (hlrRequestSample) => {
    const listOfAllHlrPerBatch = [];

    requestMappingData.forEach((batchObject) => {
      // IMSI prefix is always 6 digits
      const imsiPrefix = batchObject.imsiStartNumber.toString().slice(0, 6);
      let imsiStartNumber = removePrefix(6, batchObject.imsiStartNumber) - 1;
      // Serial number prefix is always 9 digits
      const serialNumberPrefix = batchObject.serialStartNumber
        .toString()
        .slice(0, 9);

      let serialStartNumber =
        removePrefix(9, batchObject.serialStartNumber) - 1;

      const hlrRequestSampleCopy = {
        ...hlrRequestSample,
        hlrFur: batchObject.hlrFur,
      };

      delete hlrRequestSampleCopy?.imsiStartNumber;
      delete hlrRequestSampleCopy?.imsiEndNumber;
      delete hlrRequestSampleCopy?.hlrQuantity;

      const hlrCreated = [];

      for (let i = 1; i <= batchObject.quantityInBatch; i++) {
        hlrCreated.push({
          ...hlrRequestSampleCopy,
          imsiNumber: addPrefix(imsiPrefix, 9, imsiStartNumber + i),
          serialNumber: addPrefix(serialNumberPrefix, 9, serialStartNumber + i),
        });
      }

      listOfAllHlrPerBatch.push(hlrCreated);
    });

    makeReadyForPersistence(listOfAllHlrPerBatch);
    setAllHlrPerBatch(listOfAllHlrPerBatch);
  };

  const makeReadyForPersistence = (allHlrPerBatch) => {
    const hlrPerBatch = allHlrPerBatch.map((hlrList, index) => {
      return {
        batchNumber: requestMappingData[index].batchNumber,
        poNumber: requestMappingData[index].poNumber,
        allHlrInBatch: hlrList,
      };
    });
    getHlrListInLocalState(hlrPerBatch);
  };

  useEffect(() => {
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: populateTableConfig(hlr_in_batch_table_config, []),
      })
    );
    buildAllHlrPerBatch(hlrRequestSampleData);
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
        {allHlrPerBatch.length > 0 &&
          requestMappingData.map((batchObjectFromStore, index) => {
            //console.log(allHlrPerBatch[index]);
            const batchObject = {
              poNumber: batchObjectFromStore.poNumber,
              infileName: batchObjectFromStore.infileName,
              ...batchObjectFromStore,
            };
            return (
              <Box key={index + batchObject.batchNumber}>
                <Accordion
                  sx={{ marginY: '20px', cursor: 'pointer' }}
                  expanded={expanded === `accordionNb${index}`}
                  onChange={handleChange(`accordionNb${index}`)}
                >
                  <AccordionSummary
                    sx={{
                      backgroundColor:
                        expanded === `accordionNb${index}`
                          ? `${theme.palette.primary.main}`
                          : '#fff',
                    }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`accordionNb${index}bh-content`}
                    id={`accordionNb${index}bh-header`}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      <b>Batch Number: </b> {batchObject.batchNumber}
                    </Typography>
                    <Typography
                      sx={{
                        width: '33%',
                        flexShrink: 0,
                        color: 'text.secondary',
                      }}
                    >
                      <b> Quantity: </b>{' '}
                      {batchObject.quantityInBatch + ' ' + batchObject.hlrFur}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      <b> Manufacturer: </b> {basicSimOrderData.simManufacturer}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FlexBox>
                      <Box sx={{ width: '400px', padding: '5px 15px 0 0' }}>
                        <HlrRequestCard
                          cardWidth="100%"
                          keyWidth="90px"
                          title={
                            'Batch of ' +
                            batchObject.quantityInBatch +
                            ' ' +
                            batchObject.hlrFur
                          }
                          titleIcon={
                            <FolderIcon
                              sx={{ position: 'relative', top: '3px' }}
                            />
                          }
                          allowAction={false}
                          hlrRequested={batchObject}
                          excludedKeys={[
                            'otafileName',
                            'outfileName',
                            'manufacturerFilesStatus',
                            'manufacturerFilesInfo',
                          ]}
                        />
                      </Box>
                      <Box sx={{ padding: '5px', width: '100%' }}>
                        <AddHlrCard>
                          <AddHlrCardContainer>
                            <CardContent>
                              <Box sx={{ marginBottom: '10px' }}>
                                <Typography>
                                  <b>List of Sim Serials in the BATCH</b>
                                </Typography>
                              </Box>
                              {expanded === `accordionNb${index}` && (
                                <Box>
                                  {allHlrPerBatch[index]?.length && (
                                    <DynamicTable
                                      tableConfig={{
                                        ...tableViewConfig,
                                        tableBodyData: allHlrPerBatch[index],
                                      }}
                                    />
                                  )}
                                </Box>
                              )}
                            </CardContent>
                          </AddHlrCardContainer>
                        </AddHlrCard>
                      </Box>
                    </FlexBox>
                  </AccordionDetails>
                </Accordion>
              </Box>
            );
          })}
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

export default HlrPerBatchSimulator;
