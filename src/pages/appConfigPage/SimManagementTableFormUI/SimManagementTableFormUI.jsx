import { Alert, Box, Slide, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicTable from '../../../components/dynamicTable/DynamicTable.jsx';
import {
  fetchAllSimCategory,
  fetchAllSimConnectionTypes,
  fetchAllSimHLR,
  fetchAllSimManufacturers,
  fetchAllSimTypes,
  fetchOtherConstantConfigData,
  setShowTableView,
} from '../../../redux/features/manage-sim/simManagementDataSlice.js';
import DynamicForm from '../../../components/DynamicForm/DynamicForm.jsx';
import { connection_type_submitMethod } from '../../formTemplate/appConfigForm/connectionTypeFormTemplate.js';
import { hlr_config_submitMethod } from '../../formTemplate/appConfigForm/hlrConfigFormTemplate.js';
import { sim_category_submitMethod } from '../../formTemplate/appConfigForm/simCategoryFormTemplate.js';
import { sim_manufacturer_submitMethod } from '../../formTemplate/appConfigForm/simManufacturerFormTemplate.js';
import { sim_type_submitMethod } from '../../formTemplate/appConfigForm/simTypeFormTemplate.js';
import { other_config_submitMethod } from '../../formTemplate/appConfigForm/otherConfigsFormTemplate.js';
import {
  CONNECTION_TYPE,
  HLR_FUR,
  SIM_CATEGORY,
  SIM_MANUFACTURER,
  SIM_TYPE,
  CONSTANT,
} from './configTitleConstant.js';

function SimManagementTableFormUI({
  formConfig,
  tableConfig,
  tableToggle = true,
}) {
  //console.log(tableConfig);
  const [showTable, setShowTable] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();

  const { configTitle, formViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  //const tableStyle = { fontSize: '3px' };

  const submitDynamicForm = async (data) => {
    switch (configTitle) {
      case SIM_TYPE:
        setSubmitMethod(data, sim_type_submitMethod);
        break;
      case CONNECTION_TYPE:
        setSubmitMethod(data, connection_type_submitMethod);
        break;
      case SIM_CATEGORY:
        setSubmitMethod(data, sim_category_submitMethod);
        break;
      case SIM_MANUFACTURER:
        setSubmitMethod(data, sim_manufacturer_submitMethod);
        break;
      case HLR_FUR:
        setSubmitMethod(data, hlr_config_submitMethod);
        break;
      case CONSTANT:
        setSubmitMethod(data, other_config_submitMethod);
        break;
    }
  };

  const handleCloseAlert = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const refreshData = (currentConfigTitle) => {
    switch (currentConfigTitle) {
      case SIM_TYPE:
        dispatch(fetchAllSimTypes());
        break;
      case CONNECTION_TYPE:
        dispatch(fetchAllSimConnectionTypes());
        break;
      case SIM_CATEGORY:
        dispatch(fetchAllSimCategory());
        break;
      case SIM_MANUFACTURER:
        dispatch(fetchAllSimManufacturers());
        break;
      case HLR_FUR:
        dispatch(fetchAllSimHLR());
        break;
      case CONSTANT:
        dispatch(fetchOtherConstantConfigData());
        break;
    }
    dispatch(setShowTableView(true));
  };

  const setSubmitMethod = async (data, fnObject = () => {}) => {
    let response = {};
    if (formViewConfig.isAddForm) {
      response = await fnObject.isAddForm(data);
    } else {
      const editedData = {
        ...formConfig?.dataToEdit,
        ...data,
      };
      response = await fnObject.isEditForm(editedData);
    }
    // toast message
    if (response.code == 200) {
      setSuccessMessage(response.desc);
      setErrorMessage(null);
      setIsOpen(true);
    } else {
      setErrorMessage(response.desc);
      setSuccessMessage(null);
      setIsOpen(true);
    }
    refreshData(configTitle);
  };

  useEffect(() => {
    setShowTable(tableToggle);
  }, [tableToggle]);

  return (
    <>
      <Box>
        {showTable && tableConfig?.tableBodyData?.length > 0 && (
          <DynamicTable tableConfig={tableConfig} />
        )}

        {!showTable && formConfig?.inputConfig?.length > 0 && (
          <DynamicForm
            form_config={formConfig}
            submitMethod={submitDynamicForm}
          />
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
    </>
  );
}

export default SimManagementTableFormUI;
