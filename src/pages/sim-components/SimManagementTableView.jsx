import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import {
  AllSimOrderContainer,
  ManageSimPageHeaderBox,
  ManageSimTableSettingIconBox,
} from '../../components/sim-styles/simStyles';
import {
  setConfigTitle,
  setMainTableVisibleHeader,
  setparentTableHeaderElement,
  setSimManagementTableConfigUI,
} from '../../redux/features/manage-sim/simManagementDataSlice';
import { getHeaderColumnList } from '../sim-management-utils/sim-management-utils';
import DisplayFormHandler from './DisplayFormHandler';
import { TableHeadForm } from './forms/TableHeadForm';
import HeaderColumHandler from './HeaderColumHandler';
import { useEffect } from 'react';
import { DISPLAY_ALL_SIM_ORDER } from './addNewSimOrderUI/stepperUIs/stepperTitles';
import { allSimOrder_table_config } from '../tableTemplate/allSimOrderTableTemplate';
import DynamicTable from '../../components/dynamicTable/DynamicTable';

const SimManagementTableView = () => {
  const { simOrderGlobalData } = useSelector(
    (state) => state.simManagementDataSlice
  );

  const { tableViewConfig } = useSelector(
    (state) => state.simManagementDataSlice.simManagementTableFormConfig
  );

  const dispatch = useDispatch();

  const mainTableHeaderColumns =
    simOrderGlobalData.simOrderTable.mainTableHeader;

  const mainTableVisibleHeader =
    simOrderGlobalData.simOrderTable.mainTableVisibleHeader;

  const setTableVisibleHeader = (mainTableVisibleHeaderEdited) => {
    const newVisibleValue = mainTableVisibleHeaderEdited(
      mainTableVisibleHeader
    );
    // console.log(newVisibleValue);
    dispatch(setMainTableVisibleHeader(newVisibleValue));

    const associateHeader = getHeaderColumnList(newVisibleValue);
    dispatch(setparentTableHeaderElement(associateHeader));
  };

  useEffect(() => {
    dispatch(setConfigTitle(DISPLAY_ALL_SIM_ORDER));
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: {
          ...allSimOrder_table_config,
          tableBodyData: simOrderGlobalData.allSimOrderData,
        },
      })
    );
  }, [simOrderGlobalData]);

  return (
    <>
      <ManageSimPageHeaderBox>
        <Typography>SIM CARD ORDERS</Typography>
        <ManageSimTableSettingIconBox>
          <HeaderColumHandler
            tableHeaderColums={mainTableHeaderColumns}
            VisibleHeaderColumn={mainTableVisibleHeader}
            setVisibleHeaderColumn={setTableVisibleHeader}
          />
          <DisplayFormHandler displayForm={'addSim'} />
        </ManageSimTableSettingIconBox>
      </ManageSimPageHeaderBox>

      <TableHeadForm
        formOneLabel="Sim Type Description"
        formTwoLabel="Field value"
      />

      {!simOrderGlobalData.allSimOrderData.length ? (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            border: '1px solid #eee5e1',
            padding: '10px 5px',
            width: '500px',
            margin: 'auto',
            marginTop: '150px',
            marginBottom: '150px',
          }}
        >
          Sorry, we could not find any results that match your request
        </Typography>
      ) : (
        <AllSimOrderContainer
          sx={{
            mt: 4,
            minHeight: '450px',
            width: 'calc(100vw - 160px)',
            overflowX: 'scroll',
          }}
        >
          {tableViewConfig?.tableBodyData?.length > 0 && (
            <Box>
              <DynamicTable tableConfig={tableViewConfig} />
            </Box>
          )}
        </AllSimOrderContainer>
      )}
    </>
  );
};

export default SimManagementTableView;
