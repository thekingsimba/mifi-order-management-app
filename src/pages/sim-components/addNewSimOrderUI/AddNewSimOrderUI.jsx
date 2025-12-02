import { Typography, Box } from '@mui/material';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SimConfigContainer,
  SimConfigGridItem,
  StepperContent,
} from '../../../components/sim-styles/simStyles.js';
import {
  setConfigTitle,
  fetchDynamicFormConfig,
  setFormViewConfig,
} from '../../../redux/features/manage-sim/simManagementDataSlice.js';
import AddBasicOrderStep from './stepperUIs/AddBasicOrderStep.jsx';
import PlaceSimHlrRequest from './stepperUIs/PlaceSimHlrRequest.jsx';
import RangeMappingSimulator from './stepperUIs/RangeMappingSimulator.jsx';
import {
  CREATE_BASIC_SIM_ORDER,
  ADD_HLR_DETAILS,
  CHECK_BATCH_MAPPING,
  HLR_PER_BATCH,
  ADD_UDCHLR_DETAILS,
  SAVE_ALL_DATA,
} from './stepperUIs/stepperTitles.js';
import HlrPerBatchSimulator from './stepperUIs/HlrPerBatchSimulator.jsx';
import SavingOfUserEntries from './stepperUIs/SavingOfUserEntries.jsx';
import { UDCHLR } from '../../appConfigPage/SimManagementTableFormUI/configTitleConstant.js';

function AddNewSimOrderUI({ toggleDrawer = () => {} }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hlrPerBatchData, setHlrPerBatchData] = useState(0);

  const { basicSimOrderData, hlrRequestSampleData } = useSelector(
    (state) => state.simManagementDataSlice.createNewSimOrderFormData
  );

  const dispatch = useDispatch();

  const steps = [
    CREATE_BASIC_SIM_ORDER,
    ADD_HLR_DETAILS,
    CHECK_BATCH_MAPPING,
    HLR_PER_BATCH,
    SAVE_ALL_DATA,
  ];

  const previousStepFn = async () => {
    if (currentStep == 0) {
      return;
    }
    selectFormConfig(steps[currentStep - 1]);
    setCurrentStep((currentStep) => {
      return currentStep - 1;
    });
  };

  const nextStepFn = async () => {
    if (currentStep == steps.length - 1) {
      return;
    }
    //delete form config first before moving
    dispatch(setFormViewConfig({}));

    selectFormConfig(steps[currentStep + 1]);

    setCurrentStep((currentStep) => {
      return currentStep + 1;
    });
  };

  const selectFormConfig = (selectedConfigTitle) => {
    dispatch(setConfigTitle(selectedConfigTitle));

    switch (selectedConfigTitle) {
      case CREATE_BASIC_SIM_ORDER:
        dispatch(fetchDynamicFormConfig(CREATE_BASIC_SIM_ORDER));
        break;

      case ADD_HLR_DETAILS:
        if (basicSimOrderData.hlrFur === UDCHLR) {
          dispatch(fetchDynamicFormConfig(ADD_UDCHLR_DETAILS));
        } else {
          dispatch(fetchDynamicFormConfig(ADD_HLR_DETAILS));
        }
        break;
    }
  };

  useEffect(() => {
    selectFormConfig(steps[currentStep]);
  }, []);

  return (
    <SimConfigContainer container spacing={{ xs: 2 }}>
      <SimConfigGridItem item xs={12} ml={2} mr={2}>
        <Box>
          <Box sx={{ marginTop: '25px' }}>
            <Typography>
              <b> ADD NEW SIM ORDER WITH HLR </b>
            </Typography>
          </Box>
          <StepperContent sx={{ marginTop: '25px', width: '100%' }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label + index}>
                  <StepLabel>{steps[index]}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box>
              {currentStep == 0 && (
                <AddBasicOrderStep
                  basicSimOrderData={basicSimOrderData}
                  nextStepFn={nextStepFn}
                />
              )}
              {currentStep == 1 && (
                <PlaceSimHlrRequest
                  hlrRequestSampleData={hlrRequestSampleData}
                  previousStepFn={previousStepFn}
                  nextStepFn={nextStepFn}
                  // resetFormConfigFn={() => selectFormConfig(steps[currentStep])}
                />
              )}
              {currentStep == 2 && (
                <RangeMappingSimulator
                  hlrRequestSampleData={hlrRequestSampleData}
                  previousStepFn={previousStepFn}
                  nextStepFn={nextStepFn}
                />
              )}
              {currentStep == 3 && (
                <HlrPerBatchSimulator
                  previousStepFn={previousStepFn}
                  nextStepFn={nextStepFn}
                  getHlrListInLocalState={setHlrPerBatchData}
                />
              )}
              {currentStep == 4 && (
                <SavingOfUserEntries
                  previousStepFn={previousStepFn}
                  toggleDrawer={toggleDrawer}
                  hlrListPerBatch={hlrPerBatchData}
                />
              )}
            </Box>
          </StepperContent>
        </Box>
      </SimConfigGridItem>
    </SimConfigContainer>
  );
}

export default AddNewSimOrderUI;
