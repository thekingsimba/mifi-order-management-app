import DynamicForm from '../../../../components/DynamicForm/DynamicForm.jsx';
import {
  setHlrRequestSampleData,
  setRequestMappingData,
} from '../../../../redux/features/manage-sim/simManagementDataSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import SimCardIcon from '@mui/icons-material/SimCard';
import CardContent from '@mui/material/CardContent';
import { Typography, Box, Button, Snackbar, Alert, Slide } from '@mui/material';
import { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  CancelText,
  StepperNavigation,
  FlexBoxSpaceBetween,
  FlexBox,
  AddHlrCard,
  AddHlrCardContainer,
} from '../../../../components/sim-styles/simStyles.js';
import HlrRequestCard from './setterUIcomponents/HlrRequestCard.jsx';
import RangeNumberSummaryCard from './setterUIcomponents/RangeNumberSummaryCard.jsx';
import { UDCHLR } from 'src/pages/appConfigPage/SimManagementTableFormUI/configTitleConstant.js';

function PlaceSimHlrRequest({
  previousStepFn = () => {},
  nextStepFn = () => {},
}) {
  const [showForm, setShowForm] = useState(false);
  const [currentFormConfig, setCurrentFormConfig] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { configTitle, formViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const { allSimHLR } = useSelector(
    (state) => state.simManagementDataSlice.simConfigData
  );

  const { basicSimOrderData, hlrRequestSampleData } = useSelector(
    (state) => state.simManagementDataSlice.createNewSimOrderFormData
  );

  const { allSerialNumberRange, allBatchNumberRange, allImsiNumberRange } =
    useSelector((state) => state.simManagementDataSlice.simHlrRangeData);

  const dispatch = useDispatch();

  const cancelForm = () => {
    setShowForm(false);
  };

  const submitDynamicForm = async (data) => {
    // console.log(data);
    dispatch(setHlrRequestSampleData(data));
    dispatch(setRequestMappingData([]));

    setShowForm(false);
  };

  const editFormConfig = (formKeyValueData) => {
    const newInputConfig = formViewConfig.inputConfig.map((formInputConfig) => {
      if (formKeyValueData[formInputConfig.name]) {
        return {
          ...formInputConfig,
          value: formKeyValueData[formInputConfig.name],
        };
      }

      return formInputConfig;
    });

    const editedFormConfig = {
      ...formViewConfig,
      inputConfig: newInputConfig,
      isAddForm: false,
    };
    setCurrentFormConfig(editedFormConfig);

    setShowForm(true);
  };

  const buildFormConfig = () => {
    const hlrConfigDetails = allSimHLR?.find((hlrConfig) => {
      return hlrConfig.hlrCode == basicSimOrderData.hlrFur;
    });
    //console.log(hlrConfigDetails);
    const hlrFurValue = {
      ...hlrConfigDetails,
      hlrQuantity: basicSimOrderData.simTotalQuantity,
    };

    editFormConfig(hlrFurValue);

    return Object.keys(hlrRequestSampleData).length > 0
      ? setShowForm(false)
      : setShowForm(true);
  };

  const checkImsiCapacity = () => {
    // set imsi number ==================================
    let lastImsiUsed = 0;
    let imsiEndNumber = 0;

    if (basicSimOrderData.hlrFur != UDCHLR) {
      const activeImsi = allImsiNumberRange.find(
        (imsIObj) =>
          imsIObj.status === 'active' &&
          imsIObj.hlrFur === basicSimOrderData.hlrFur
      );
      // console.log(activeImsi);

      lastImsiUsed = activeImsi.lastNumberUsed;
      imsiEndNumber = activeImsi.endNumber;
    } else {
      // console.log(hlrRequestSampleData);
      lastImsiUsed = hlrRequestSampleData.imsiStartNumber;
      imsiEndNumber = hlrRequestSampleData.imsiEndNumber;
    }

    let currentCapacity = imsiEndNumber - lastImsiUsed + 1;

    if (currentCapacity >= Number(basicSimOrderData.simTotalQuantity)) {
      nextStepFn();
    } else {
      setErrorMessage(
        `The current IMSI range can only produce ${currentCapacity} HLR. You requested ${basicSimOrderData.simTotalQuantity}. Kindly contact admin to update IMSI Range`
      );
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
    if (formViewConfig.inputConfig?.length) {
      buildFormConfig();
    }
  }, [formViewConfig]);

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
        <FlexBox>
          <Box sx={{ padding: '5px', width: '100%' }}>
            <AddHlrCard>
              <AddHlrCardContainer>
                <CardContent>
                  {showForm && (
                    <>
                      <Box>
                        <Typography>
                          <b>{configTitle}</b>
                        </Typography>
                      </Box>
                      <FlexBoxSpaceBetween>
                        <Box sx={{ marginBottom: '10px' }}>
                          <Typography variant="body2">
                            You requested for{' '}
                            {basicSimOrderData.simTotalQuantity} units of{' '}
                            {basicSimOrderData.hlrFur}
                          </Typography>
                        </Box>
                        {Object.keys(hlrRequestSampleData).length > 0 && (
                          <Box sx={{ marginRight: '20px', cursor: 'pointer' }}>
                            <CancelText onClick={() => cancelForm()}>
                              cancel
                            </CancelText>
                          </Box>
                        )}
                      </FlexBoxSpaceBetween>
                    </>
                  )}
                  {Object.keys(hlrRequestSampleData).length > 0 && !showForm ? (
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
                        allowAction={true}
                        hlrRequested={hlrRequestSampleData}
                        editHlrRequestFn={() =>
                          editFormConfig(hlrRequestSampleData, false)
                        }
                      />
                    </FlexBoxSpaceBetween>
                  ) : (
                    <Box
                      sx={{
                        marginTop: '10px',
                      }}
                    >
                      {currentFormConfig?.inputConfig?.length && showForm && (
                        <DynamicForm
                          form_config={currentFormConfig}
                          submitMethod={submitDynamicForm}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
              </AddHlrCardContainer>
            </AddHlrCard>
          </Box>
        </FlexBox>
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
          {Object.keys(hlrRequestSampleData).length > 0 && !showForm && (
            <Button
              sx={{ position: 'absolute', right: '10px' }}
              type="button"
              variant="contained"
              onClick={() => checkImsiCapacity()}
            >
              Next
            </Button>
          )}
        </Box>
      </StepperNavigation>
    </>
  );
}

export default PlaceSimHlrRequest;
