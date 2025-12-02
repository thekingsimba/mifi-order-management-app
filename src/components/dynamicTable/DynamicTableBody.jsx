import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Alert, IconButton, MenuItem, Slide, Snackbar, TableBody, TableCell } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TableBodyRowChecked } from '../../components/tsat-style/TsatStyle';
import {
  CONNECTION_TYPE,
  SIM_CATEGORY,
  SIM_MANUFACTURER,
  SIM_TYPE,
  CONSTANT,
  HLR_FUR,
} from '../../pages/appConfigPage/SimManagementTableFormUI/configTitleConstant.js';
import { formatObjectDates } from '../../pages/sim-management-utils/sim-management-utils.js';
import { connection_type_tableActionsMethod } from '../../pages/tableTemplate/connectionTypeTableTemplate.js';
import { sim_category_tableActionsMethod } from '../../pages/tableTemplate/simCategoryTableTemplate.js';
import { sim_manufacturer_tableActionsMethod } from '../../pages/tableTemplate/simManufacturerTableTemplate.js';
import { sim_type_tableActionsMethod } from '../../pages/tableTemplate/simTypeTableTemplate.js';
import {
  fetchAllBatchNumberRange,
  fetchAllImsiNumberRange,
  fetchAllSerialNumberRange,
  fetchAllSimCategory,
  fetchAllSimConnectionTypes,
  fetchAllSimHLR,
  fetchAllSimManufacturers,
  fetchAllSimTypes,
  fetchOtherConstantConfigData,
  setFormViewConfig,
  setIsAddForm,
  setShowTableView,
} from '../../redux/features/manage-sim/simManagementDataSlice';
import MenuPopover from '../menu-popover';
import { other_constant_Config_tableActionsMethod } from '../../pages/tableTemplate/otherConstantConfigurationTableTemplate.js';
import { hlr_Config_tableActionsMethod } from '../../pages/tableTemplate/hlrConfigTableTemplate.js';
import { hlr_batchRange_tableActionsMethod } from '../../pages/tableTemplate/hlrBatchRangeTableTemplate.js';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import {
  CHECK_BATCH_MAPPING,
  DISPLAY_ALL_SIM_ORDER,
} from '../../pages/sim-components/addNewSimOrderUI/stepperUIs/stepperTitles.js';
import { batch_mapping_simulation_tableActionsMethod } from '../../pages/tableTemplate/batchMappingTableTemplate.js';
import { allSimOrder_tableActionsMethod } from '../../pages/tableTemplate/allSimOrderTableTemplate.js';
import { hlr_ImsiRange_tableActionsMethod } from '../../pages/tableTemplate/hlrImsiNbRangeTableTemplate.js';
import { hlr_serialNb_tableActionsMethod } from '../../pages/tableTemplate/hlrSerialNbTableTemplate.js';
import {
  HLR_BATCH_NUMBER_RANGE,
  HLR_IMSI_NUMBER_RANGE,
  HLR_SERIAL_NUMBER_RANGE,
} from 'src/pages/rangeSettingPage/RangeSettingTableFormUI/rangeTabConstant';

const DynamicTableBody = ({ propsFromTable, bodyStyle }) => {
  const { tableViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const { tableProps, tablePaginationProp } = propsFromTable;

  const { tableDisplayData, tableHeaderColumns } = tableProps;

  const { page, rowsPerPage } = tablePaginationProp;

  const headerList = tableHeaderColumns
    .filter((header) => header?.id != 'action')
    .map((headerItem) => headerItem?.id);

  const newArrayToDisplay = [];

  tableDisplayData.forEach((element) => {
    const singleObjectToDisplay = {};
    const elementWithFormattedDate = formatObjectDates(element);
    headerList.forEach((headerKey) => {
      singleObjectToDisplay[headerKey] = elementWithFormattedDate[headerKey];
    });
    const fullObjectAssociated = elementWithFormattedDate;
    newArrayToDisplay.push({ singleObjectToDisplay, fullObjectAssociated });
  });

  return (
    <TableBody>
      {newArrayToDisplay
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((item, index) => {
          //console.log(fullTableConfig);
          return renderTableRow(
            item,
            index,
            tableViewConfig.allowedActions,
            bodyStyle
          );
        })}
    </TableBody>
  );
};

export default DynamicTableBody;

const renderTableCell = (item, field, bodyStyle, index) => (
  <TableCell sx={bodyStyle} key={index + field}>
    {item[field]}
  </TableCell>
);

const renderTableRow = (item, index, allowedActions, bodyStyle) => {
  // console.log('bodyStyle', bodyStyle);
  return (
    <TableBodyRowChecked key={index}>
      {Object.keys(item.singleObjectToDisplay).map((field, index) => {
        if (field) {
          return renderTableCell(
            item.singleObjectToDisplay,
            field,
            bodyStyle,
            index
          );
        } else {
          return null;
        }
      })}

      {allowedActions?.length > 0 && (
        <TableCell sx={bodyStyle}>
          <DynamicTableBodyAction
            dataIndex={index}
            allowedActions={allowedActions}
            currentItem={item}
          />
        </TableCell>
      )}
    </TableBodyRowChecked>
  );
};

const DynamicTableBodyAction = ({ allowedActions = [], currentItem = {} }) => {
  const [openPopover, setOpenPopover] = useState(null);
  const [tableActions, setTableActions] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { configTitle, formViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleCloseAlert = () => {
    setIsOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const isAllowed = (actionType) => {
    return allowedActions.includes(actionType);
  };

  const editFormConfig = (valueToUpdate = {}) => {
    const newInputConfig = formViewConfig.inputConfig.map((formInputConfig) => {
      if (valueToUpdate[formInputConfig.name]) {
        return {
          ...formInputConfig,
          value: valueToUpdate[formInputConfig.name],
        };
      }

      return formInputConfig;
    });

    dispatch(
      setFormViewConfig({
        ...formViewConfig,
        inputConfig: newInputConfig,
        dataToEdit: valueToUpdate,
      })
    );
  };

  const handleEdit = () => {
    editFormConfig(currentItem.fullObjectAssociated);
    dispatch(setIsAddForm(false));
    dispatch(setShowTableView(false));
  };

  const setTableActionsMethod = (selectedConfigTitle) => {
    switch (selectedConfigTitle) {
      case SIM_TYPE:
        setTableActions(sim_type_tableActionsMethod);
        break;
      case CONNECTION_TYPE:
        setTableActions(connection_type_tableActionsMethod);
        break;
      case SIM_CATEGORY:
        setTableActions(sim_category_tableActionsMethod);
        break;
      case SIM_MANUFACTURER:
        setTableActions(sim_manufacturer_tableActionsMethod);
        break;
      case HLR_FUR:
        setTableActions(hlr_Config_tableActionsMethod);
        break;
      case HLR_BATCH_NUMBER_RANGE:
        setTableActions(hlr_batchRange_tableActionsMethod);
        break;
      case CONSTANT:
        setTableActions(other_constant_Config_tableActionsMethod);
        break;
      case CHECK_BATCH_MAPPING:
        setTableActions(batch_mapping_simulation_tableActionsMethod);
        break;
      case DISPLAY_ALL_SIM_ORDER:
        setTableActions(allSimOrder_tableActionsMethod);
        break;
      case HLR_IMSI_NUMBER_RANGE:
        setTableActions(hlr_ImsiRange_tableActionsMethod);
        break;
      case HLR_SERIAL_NUMBER_RANGE:
        setTableActions(hlr_serialNb_tableActionsMethod);
        break;
      default:
        setTableActions(sim_type_tableActionsMethod);
        break;
    }
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
      case HLR_IMSI_NUMBER_RANGE:
        dispatch(fetchAllImsiNumberRange());
        break;
      case HLR_SERIAL_NUMBER_RANGE:
        dispatch(fetchAllSerialNumberRange());
        break;
      case HLR_BATCH_NUMBER_RANGE:
        dispatch(fetchAllBatchNumberRange());
        break;
      default:
        setTableActions(sim_type_tableActionsMethod);
        break;
    }
  };

  useEffect(() => {
    setTableActionsMethod(configTitle);
  }, [configTitle]);

  const handleDeleted = async () => {
    const deleteMethod = tableActions.deleteItemMethod;
    const objectId = currentItem.fullObjectAssociated.seq_id;
    const response = await deleteMethod(objectId);
    if (response?.code == 200) {
      refreshData(configTitle);
      setSuccessMessage(response?.desc);
      setErrorMessage(null);
      setIsOpen(true);
    } else {
      setErrorMessage(response.desc);
      setSuccessMessage(null);
      setIsOpen(true);
    }
  };

  const handleSingleView = () => {
    const getUrlMethod = tableActions.getViewItemUrl;
    const singlePageUrl = getUrlMethod(currentItem.fullObjectAssociated);
    navigate(singlePageUrl);
  };

  return (
    <>
      <IconButton
        color={openPopover ? 'inherit' : 'default'}
        onClick={handleOpenPopover}
      >
        <MoreVertIcon id="action" />
      </IconButton>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {isAllowed('singleView') && (
          <MenuItem onClick={() => handleSingleView()}>
            <DocumentScannerIcon />
            Single view
          </MenuItem>
        )}

        {isAllowed('edit') && (
          <MenuItem onClick={() => handleEdit()}>
            <EditIcon />
            Edit
          </MenuItem>
        )}

        {isAllowed('delete') && (
          <MenuItem onClick={() => handleDeleted()}>
            <ManageAccountsIcon />
            delete
          </MenuItem>
        )}
      </MenuPopover>

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
