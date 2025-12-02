import { Alert, Box, Slide, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DynamicForm from '../../../components/DynamicForm/DynamicForm.jsx';
import DynamicTable from '../../../components/dynamicTable/DynamicTable.jsx';
import {
  fetchAllBatchNumberRange,
  fetchAllImsiNumberRange,
  fetchAllSerialNumberRange,
  setShowTableView,
} from '../../../redux/features/manage-sim/simManagementDataSlice.js';
import {
  HLR_BATCH_NUMBER_RANGE,
  HLR_IMSI_NUMBER_RANGE,
  HLR_SERIAL_NUMBER_RANGE,
} from './rangeTabConstant.js';
import { hlr_batchRange_submitMethod } from '../../formTemplate/rangeNumberForm/hlrBatchRangeFormTemplate.js';
import { hlr_serialNbRange_submitMethod } from '../../formTemplate/rangeNumberForm/hlrSerialNbRangeFormTemplate.js';
import { hlr_ImsiRange_submitMethod } from '../../formTemplate/rangeNumberForm/hlrImsiNbRangeFormTemplate.js';
import { addPrefix } from '../../sim-management-utils/sim-management-utils.js';

function RangeSettingTableFormUI({
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

  const submitDynamicForm = async (data) => {
    // console.log(data, ' data in the dynamic form');
    switch (configTitle) {
      case HLR_BATCH_NUMBER_RANGE:
        setSubmitMethod(data, hlr_batchRange_submitMethod);
        break;
      case HLR_SERIAL_NUMBER_RANGE:
        setSubmitMethod(data, hlr_serialNbRange_submitMethod);
        break;
      case HLR_IMSI_NUMBER_RANGE:
        setSubmitMethod(data, hlr_ImsiRange_submitMethod);
        break;
      default:
        setSubmitMethod(data, hlr_batchRange_submitMethod);
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
      case HLR_BATCH_NUMBER_RANGE:
        dispatch(fetchAllBatchNumberRange());
        break;
      case HLR_SERIAL_NUMBER_RANGE:
        dispatch(fetchAllSerialNumberRange());
        break;
      case HLR_IMSI_NUMBER_RANGE:
        dispatch(fetchAllImsiNumberRange());
        break;
      default:
        dispatch(fetchAllBatchNumberRange());
        break;
    }
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
      refreshData(configTitle);
      setSuccessMessage(response.desc);
      setErrorMessage(null);
      setIsOpen(true);
    } else {
      setErrorMessage(response.desc);
      setSuccessMessage(null);
      setIsOpen(true);
    }
    dispatch(setShowTableView(true));
  };

  const formatDataWithPrefix = (currentConfigTitle) => {
    let formattedData = tableConfig?.tableBodyData;

    switch (currentConfigTitle) {
      case HLR_IMSI_NUMBER_RANGE:
        // imsi number suffix is always 9 number
        formattedData = tableConfig?.tableBodyData.map((obj) => {
          return {
            ...obj,
            startNumber: addPrefix(obj.imsiPrefixNumber, 9, obj.startNumber),
            endNumber: addPrefix(obj.imsiPrefixNumber, 9, obj.endNumber),
            lastNumberUsed: addPrefix(
              obj.imsiPrefixNumber,
              9,
              obj.lastNumberUsed
            ),
            nextNumber: addPrefix(obj.imsiPrefixNumber, 9, obj.nextNumber),
          };
        });
        break;
      case HLR_SERIAL_NUMBER_RANGE:
        // serial number suffix is always 10 number
        formattedData = tableConfig?.tableBodyData.map((obj) => {
          return {
            ...obj,
            lastSrNumberUsed: addPrefix(
              obj.serialNumberPrefix,
              10,
              obj.lastSrNumberUsed
            ),
            nextSrNumber: addPrefix(
              obj.serialNumberPrefix,
              10,
              obj.nextSrNumber
            ),
          };
        });
        break;
    }

    return formattedData;
  };

  useEffect(() => {
    setShowTable(tableToggle);
  }, [tableToggle]);

  return (
    <>
      <Box>
        {showTable && tableConfig?.tableBodyData?.length > 0 && (
          <DynamicTable
            tableConfig={{
              ...tableConfig,
              tableBodyData: formatDataWithPrefix(configTitle),
            }}
          />
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

export default RangeSettingTableFormUI;
