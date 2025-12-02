import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  ConfigMenuBox,
  SimConfigContainer,
  SimConfigGridItem,
  SimConfigPaper,
} from '../../components/sim-styles/simStyles.js';
import {
  fetchAllSimCategory,
  fetchAllSimConnectionTypes,
  fetchAllSimHLR,
  fetchDynamicFormConfig,
  fetchAllSimManufacturers,
  fetchAllSimTypes,
  setConfigTitle,
  setShowTableView,
  setSimManagementTableConfigUI,
  fetchOtherConstantConfigData,
} from '../../redux/features/manage-sim/simManagementDataSlice.js';
import { connection_type_table_config } from '../tableTemplate/connectionTypeTableTemplate.js';
import { hlr_config_table_config } from '../tableTemplate/hlrConfigTableTemplate.js';
import { sim_category_table_config } from '../tableTemplate/simCategoryTableTemplate.js';
import { sim_manufacturer_table_config } from '../tableTemplate/simManufacturerTableTemplate.js';
import { sim_type_table_config } from '../tableTemplate/simTypeTableTemplate.js';
import { other_constant_config_table_config } from '../tableTemplate/otherConstantConfigurationTableTemplate.js';
import {
  CONNECTION_TYPE,
  HLR_FUR,
  CONSTANT,
  SIM_CATEGORY,
  SIM_MANUFACTURER,
  SIM_TYPE,
} from './SimManagementTableFormUI/configTitleConstant.js';
import SimManagementTableFormUI from './SimManagementTableFormUI/SimManagementTableFormUI.jsx';

function AppConfigPage() {
  return (
    <SimConfigContainer container spacing={{ xs: 2 }}>
      <SimConfigGridItem item xs={12} ml={2}>
        <SimConfigPaper elevation={1}>
          <ConfigSelector />
        </SimConfigPaper>
      </SimConfigGridItem>
    </SimConfigContainer>
  );
}

export default AppConfigPage;

function ConfigSelector() {
  const {
    allSimCategories,
    allSimManufacturers,
    allSimPrefixes,
    allSimConnectionTypes,
    allSimTypes,
    allSimHLR,
    otherConfigData,
  } = useSelector((state) => state.simManagementDataSlice.simConfigData);

  const { configTitle, showTableView, tableViewConfig, formViewConfig } =
    useSelector(
      (state) => state.simManagementDataSlice.simManagementTableFormConfig
    );

  const dispatch = useDispatch();

  const configTitleList = [
    SIM_TYPE,
    SIM_CATEGORY,
    SIM_MANUFACTURER,
    HLR_FUR,
    CONSTANT,
  ];

  const fetchData = async () => {
    try {
      // Use Promise.all to await multiple async actions
      await Promise.all([
        dispatch(fetchAllSimCategory()),
        dispatch(fetchAllSimTypes()),
        dispatch(fetchAllSimManufacturers()),
        dispatch(fetchAllSimConnectionTypes()),
        dispatch(fetchAllSimHLR()),
        dispatch(fetchOtherConstantConfigData()),
        dispatch(
          setSimManagementTableConfigUI({
            tableViewConfig: populateTableConfig(
              sim_type_table_config,
              allSimTypes
            ),
          })
        ),
        dispatch(fetchDynamicFormConfig(SIM_TYPE)),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    selectFormConfig(SIM_TYPE);
  }, [
    allSimCategories,
    allSimManufacturers,
    allSimPrefixes,
    allSimConnectionTypes,
    allSimTypes,
    allSimHLR,
    otherConfigData,
  ]);

  const populateTableConfig = (configObject, tableDataArray) => {
    return { ...configObject, tableBodyData: tableDataArray };
  };

  const insertApiCallInTableConfig = (
    initialDevTableConfig,
    apiCallTableData
  ) => {
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: populateTableConfig(
          initialDevTableConfig,
          apiCallTableData
        ),
      })
    );
  };

  const selectFormConfig = (selectedConfigTitle) => {
    dispatch(setConfigTitle(selectedConfigTitle));

    switch (selectedConfigTitle) {
      case SIM_TYPE:
        insertApiCallInTableConfig(sim_type_table_config, allSimTypes);
        dispatch(fetchDynamicFormConfig(SIM_TYPE));
        break;

      case SIM_CATEGORY:
        insertApiCallInTableConfig(sim_category_table_config, allSimCategories);
        dispatch(fetchDynamicFormConfig(SIM_CATEGORY));
        break;

      case SIM_MANUFACTURER:
        insertApiCallInTableConfig(
          sim_manufacturer_table_config,
          allSimManufacturers
        );
        dispatch(fetchDynamicFormConfig(SIM_MANUFACTURER));
        break;

      case CONNECTION_TYPE:
        insertApiCallInTableConfig(
          connection_type_table_config,
          allSimConnectionTypes
        );
        dispatch(fetchDynamicFormConfig(CONNECTION_TYPE));
        break;

      case HLR_FUR:
        insertApiCallInTableConfig(hlr_config_table_config, allSimHLR);
        dispatch(fetchDynamicFormConfig(HLR_FUR));
        break;

      case CONSTANT:
        insertApiCallInTableConfig(
          other_constant_config_table_config,
          otherConfigData
        );
        dispatch(fetchDynamicFormConfig(CONSTANT));
        break;

      default:
        insertApiCallInTableConfig(sim_type_table_config, allSimTypes);
        dispatch(fetchDynamicFormConfig(SIM_TYPE));
        break;
    }

    dispatch(setShowTableView(true));
  };

  return (
    <Box>
      <Typography>
        <b>SIM MANAGEMENT CONFIG </b>
      </Typography>

      <ConfigMenuBox sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {configTitleList.map((title, index) => (
            <Box key={index + title}>
              <Button
                type="button"
                variant={title === configTitle ? 'outlined' : 'text'}
                sx={{ mr: 2 }}
                onClick={() => selectFormConfig(title)}
              >
                {title}
              </Button>
            </Box>
          ))}
        </Box>
      </ConfigMenuBox>

      <Box sx={{ textAlign: 'right', marginBottom: '20px', marginTop: '20px' }}>
        {showTableView ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              {tableViewConfig?.tableBodyData?.length > 0 && (
                <Typography sx={{ marginTop: '10px' }}>
                  {configTitle.toUpperCase()} LIST
                </Typography>
              )}
            </Box>
            <Box>
              <Button
                type="button"
                variant="contained"
                onClick={() => dispatch(setShowTableView(false))}
              >
                {'Add new '} {configTitle}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ marginTop: '10px' }}>
                {configTitle.toUpperCase()} FORM
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={() => dispatch(setShowTableView(true))}>
                <ClearIcon fontSize="3rem" />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>

      <SimManagementTableFormUI
        formConfig={formViewConfig}
        tableConfig={tableViewConfig}
        tableToggle={showTableView}
      />
    </Box>
  );
}
