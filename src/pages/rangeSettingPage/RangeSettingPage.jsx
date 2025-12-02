import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, IconButton, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  RangeMappingTabs,
  SimConfigContainer,
  SimConfigGridItem,
  SimConfigPaper,
} from '../../components/sim-styles/simStyles.js';
import {
  fetchAllBatchNumberRange,
  fetchAllImsiNumberRange,
  fetchAllSerialNumberRange,
  setConfigTitle,
  setShowTableView,
  setSimManagementTableConfigUI,
  fetchDynamicFormConfig,
} from '../../redux/features/manage-sim/simManagementDataSlice.js';
import { hlr_batchRange_table_config } from '../tableTemplate/hlrBatchRangeTableTemplate.js';
import { hlr_ImsiRange_table_config } from '../tableTemplate/hlrImsiNbRangeTableTemplate.js';
import { hlr_serialNb_table_config } from '../tableTemplate/hlrSerialNbTableTemplate.js';
import RangeSettingTableFormUI from './RangeSettingTableFormUI/RangeSettingTableFormUI.jsx';
import {
  HLR_BATCH_NUMBER_RANGE,
  HLR_IMSI_NUMBER_RANGE,
  HLR_SERIAL_NUMBER_RANGE,
} from './RangeSettingTableFormUI/rangeTabConstant.js';

function RangeSettingPage() {
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

export default RangeSettingPage;

function ConfigSelector() {
  const { allSerialNumberRange, allBatchNumberRange, allImsiNumberRange } =
    useSelector((state) => state.simManagementDataSlice.simHlrRangeData);

  const { configTitle, showTableView, tableViewConfig, formViewConfig } =
    useSelector(
      (state) => state.simManagementDataSlice.simManagementTableFormConfig
    );

  const [value, setValue] = useState(0);

  const dispatch = useDispatch();

  const tabsTitle = [
    HLR_SERIAL_NUMBER_RANGE,
    HLR_IMSI_NUMBER_RANGE,
    HLR_BATCH_NUMBER_RANGE,
  ];

  const fetchData = async () => {
    //console.log('fectch data');
    try {
      // Use Promise.all to await multiple async actions
      await Promise.all([
        dispatch(fetchAllSerialNumberRange()),
        dispatch(fetchAllBatchNumberRange()),
        dispatch(fetchAllImsiNumberRange()),
        dispatch(
          setSimManagementTableConfigUI({
            tableViewConfig: populateTableConfig(
              hlr_serialNb_table_config,
              allSerialNumberRange
            ),
          })
        ),
        dispatch(fetchDynamicFormConfig(HLR_SERIAL_NUMBER_RANGE)),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    selectFormConfig(HLR_SERIAL_NUMBER_RANGE);
  }, []);

  const populateTableConfig = (configObject, tableDataArray) => {
    return { ...configObject, tableBodyData: tableDataArray };
  };

  const insertApiCallInConfig = (initialDevTableConfig, apiCallTableData) => {
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
    dispatch(setShowTableView(true));
    dispatch(setConfigTitle(selectedConfigTitle));
    // console.log(selectedConfigTitle);
    switch (selectedConfigTitle) {
      case HLR_SERIAL_NUMBER_RANGE:
        insertApiCallInConfig(hlr_serialNb_table_config, allSerialNumberRange);
        dispatch(fetchDynamicFormConfig(HLR_SERIAL_NUMBER_RANGE));
        break;

      case HLR_BATCH_NUMBER_RANGE:
        insertApiCallInConfig(hlr_batchRange_table_config, allBatchNumberRange);
        dispatch(fetchDynamicFormConfig(HLR_BATCH_NUMBER_RANGE));
        break;

      case HLR_IMSI_NUMBER_RANGE:
        insertApiCallInConfig(hlr_ImsiRange_table_config, allImsiNumberRange);
        dispatch(fetchDynamicFormConfig(HLR_IMSI_NUMBER_RANGE));
        break;
    }
  };

  const handleChange = (event, newIndex) => {
    dispatch(setConfigTitle(tabsTitle[newIndex]));
    selectFormConfig(tabsTitle[newIndex]);
    setValue(newIndex);
  };

  const handleDisableAddButton = () => {
    let disabled = false;
    switch (configTitle) {
      case HLR_SERIAL_NUMBER_RANGE:
        disabled = tableViewConfig?.tableBodyData?.length === 1;
        break;
      case HLR_IMSI_NUMBER_RANGE:
        disabled = tableViewConfig?.tableBodyData?.length === 4;
        break;
      case HLR_BATCH_NUMBER_RANGE:
        disabled = tableViewConfig?.tableBodyData?.length === 1;
        break;
      default:
        break;
    }
   return disabled;
  }

  return (
    <Box>
      <Box>
        <Typography>
          <b> SIM RANGE NUMBERS SETTING </b>
        </Typography>
      </Box>

      {/* TABS */}
      <Box sx={{ marginTop: '30px' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="RANGE NUMBER TABS"
            >
              {tabsTitle.map((title, index) => (
                <RangeMappingTabs
                  key={title + index}
                  label={title}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>
          {tabsTitle.map((title, index) => (
            <TabsDynamicBody value={value} index={index} key={title + index}>
              <>
                {/* ADD BUTTON BAR AND TABLE */}
                <Box
                  sx={{
                    textAlign: 'right',
                    marginBottom: '20px',
                    marginTop: '20px',
                  }}
                >
                  {showTableView ? (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Box>
                        {tableViewConfig?.tableBodyData?.length > 0 && (
                          <Typography sx={{ marginTop: '10px' }}>
                            {configTitle.toUpperCase()} LIST
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Button
                          disabled={handleDisableAddButton()}
                          type="button"
                          variant="contained"
                          onClick={() => dispatch(setShowTableView(false))}
                        >
                          {'Add new '} {configTitle}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Box>
                        <Typography sx={{ marginTop: '10px' }}>
                          {configTitle.toUpperCase()} FORM
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => dispatch(setShowTableView(true))}
                        >
                          <ClearIcon fontSize="3rem" />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>

                <RangeSettingTableFormUI
                  formConfig={formViewConfig}
                  tableConfig={tableViewConfig}
                  tableToggle={showTableView}
                />
              </>
            </TabsDynamicBody>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function TabsDynamicBody({ value, index, children }) {
  return (
    <CustomTabPanel value={value} index={index}>
      {children}
    </CustomTabPanel>
  );
}

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
