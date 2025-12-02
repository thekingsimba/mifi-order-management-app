import DynamicForm from '../../../../components/DynamicForm/DynamicForm.jsx';
import {
  setBasicOrderData,
  setFormViewConfig,
  setHlrRequestSampleData,
  setRequestMappingData,
} from '../../../../redux/features/manage-sim/simManagementDataSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import ObjectDataCard from '../../../../components/objectDataCard/ObjectDataCard.jsx';
import { Typography, Box, Button, Snackbar, Alert, Slide } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  CancelText,
  StepperNavigation,
} from '../../../../components/sim-styles/simStyles.js';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getSimHRL,
  simOrderSearch,
} from '../../../../services/ApiService.js';

function AddBasicOrderStep({ basicSimOrderData, nextStepFn = () => {} }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [existsMessage, setExistsMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { configTitle, formViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (existsMessage.length > 0) {
      setIsOpen(true);
    }
  }, [existsMessage]);

  const handleCloseAlert = () => {
    setIsOpen(false);
    setExistsMessage('');
  };

  const getSimCategoryAndSimType = async (hlrCode) => {
    try {
      const response = await getSimHRL();
      const concernedSimCategory = response.find((item) => {
        return item.hlrCode == hlrCode;
      });
      return {
        simCategory: concernedSimCategory.hlrSimCategory,
        simType: concernedSimCategory.hlrSimType,
      };
    } catch (error) {
      return [];
    }
  };

  const submitDynamicForm = async (data) => {
    const fieldName = 'purchaseOrder';
    const value = data[fieldName];
    const response = await simOrderSearch(fieldName, value);
    if (response && response.length > 0) {
      setExistsMessage(
        'Purchase Order number already exist. Please provide a different value'
      );
      return;
    }
    const simCategoryAndSimTypeObj = await getSimCategoryAndSimType(
      data['hlrFur']
    );
    console.log(data['hlrFur']);
    console.log(simCategoryAndSimTypeObj);
    const basicSimOrderData = { ...data, ...simCategoryAndSimTypeObj };
    delete basicSimOrderData?.imsiPrefixNumber;
    delete basicSimOrderData?.imsiStartNumber;
    delete basicSimOrderData?.serialNumberPrefix;
    delete basicSimOrderData?.startNumber;
    delete basicSimOrderData?.endNumber;
    delete basicSimOrderData?.nextNumber;
    delete basicSimOrderData?.lastNumberUsed;

    dispatch(setBasicOrderData(basicSimOrderData));
    dispatch(setHlrRequestSampleData({}));
    dispatch(setRequestMappingData([]));

    setShowEditForm(false);
  };

  const basicSimOrderDataKeys = Object.keys(basicSimOrderData);

  const editFormConfig = () => {
    const newInputConfig = formViewConfig.inputConfig.map((formInputConfig) => {
      if (basicSimOrderData[formInputConfig.name]) {
        return {
          ...formInputConfig,
          value: basicSimOrderData[formInputConfig.name],
        };
      }

      return formInputConfig;
    });

    dispatch(
      setFormViewConfig({
        ...formViewConfig,
        inputConfig: newInputConfig,
      })
    );
    setShowEditForm(true);
  };

  const deleteBasicFormDetails = () => {
    dispatch(setBasicOrderData({}));
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          minHeight: '58vh',
        }}
      >
        {basicSimOrderDataKeys.length > 0 && !showEditForm ? (
          <ObjectDataCard cardDataObject={basicSimOrderData}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography
                  sx={{ marginLeft: '17px', textDecoration: 'underline' }}
                >
                  <b>SIM ORDER DETAILS PROVIDED:</b>
                </Typography>
              </Box>
              <Box sx={{ marginRight: '20px', cursor: 'pointer' }}>
                <DeleteIcon
                  sx={{
                    marginRight: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => deleteBasicFormDetails()}
                />
                <EditIcon onClick={() => editFormConfig()} />
              </Box>
            </Box>
          </ObjectDataCard>
        ) : (
          <Box sx={{ marginTop: '50px', width: '90%', marginInline: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ marginBottom: '20px' }}>
                  {configTitle}
                </Typography>
              </Box>
              {basicSimOrderDataKeys.length > 0 && (
                <Box sx={{ marginRight: '20px', cursor: 'pointer' }}>
                  <CancelText onClick={() => setShowEditForm(false)}>
                    cancel
                  </CancelText>
                </Box>
              )}
            </Box>
            {formViewConfig?.inputConfig?.length && (
              <DynamicForm
                form_config={formViewConfig}
                submitMethod={submitDynamicForm}
              />
            )}
          </Box>
        )}
      </Box>
      <StepperNavigation>
        <Box sx={{ position: 'relative' }}>
          {/* <Button
            sx={{ position: 'absolute', left: '10px' }}
            type="button"
            variant="outlined"
            onClick={() => nextStepFn}
          >
            Previous
          </Button> */}
          {basicSimOrderDataKeys.length > 0 && !showEditForm && (
            <Button
              sx={{ position: 'absolute', right: '10px' }}
              type="button"
              variant="contained"
              onClick={() => nextStepFn()}
            >
              Next
            </Button>
          )}
        </Box>
      </StepperNavigation>
      <Snackbar
        open={isOpen}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
        key={'slide'}
        autoHideDuration={5000}
      >
        <Alert severity={'error'} variant="filled" sx={{ width: '100%' }}>
          {existsMessage && existsMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddBasicOrderStep;
