import AddCircleIcon from '@mui/icons-material/AddCircle';
import ClearIcon from '@mui/icons-material/Clear';
import { Drawer, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  DrawerCloseBtnBox,
  DrawerFormWrapper,
  DrawerInnerBox,
} from '../../components/sim-styles/simStyles';
import AddNewSimOrderUI from './addNewSimOrderUI/AddNewSimOrderUI';
import { useDispatch, useSelector } from 'react-redux';
import { setConfigTitle, setResetCreateSimOrderData, setSimManagementTableConfigUI } from '../../redux/features/manage-sim/simManagementDataSlice';
import { DISPLAY_ALL_SIM_ORDER } from './addNewSimOrderUI/stepperUIs/stepperTitles';
import { allSimOrder_table_config } from '../tableTemplate/allSimOrderTableTemplate';

const DisplayFormHandler = ({ displayForm }) => {
  const { simOrderGlobalData } = useSelector(
    (state) => state.simManagementDataSlice
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();

  const toggleDrawer = (isOpen) => {
    setOpenDrawer(isOpen);
    if (!isOpen) {
      cleanDataAndLeave();
    }
  };

  const cleanDataAndLeave = () => {
    dispatch(setResetCreateSimOrderData());
    dispatch(setConfigTitle(DISPLAY_ALL_SIM_ORDER));
    dispatch(
      setSimManagementTableConfigUI({
        tableViewConfig: {
          ...allSimOrder_table_config,
          tableBodyData: simOrderGlobalData.allSimOrderData,
        },
      })
    );
  };

  return (
    <>
      <Tooltip title="Add">
        <IconButton onClick={() => toggleDrawer(true)}>
          <AddCircleIcon
            sx={{ color: theme.palette.primary.main }}
            fontSize="large"
          />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor={'bottom'}
        open={openDrawer}
        onClose={() => {
          toggleDrawer(false);
        }}
      >
        <DrawerInnerBox>
          <DrawerCloseBtnBox>
            <IconButton
              sx={{ zIndex: '2' }}
              onClick={() => toggleDrawer(false)}
            >
              <ClearIcon fontSize="3rem" />
            </IconButton>
          </DrawerCloseBtnBox>
          <DrawerFormWrapper>
            {displayForm === 'addSim' && (
              <>
                {/* <NewSimForm actionType="add" toggleFormDrawer={toggleDrawer} /> */}
                <AddNewSimOrderUI
                  toggleDrawer={toggleDrawer}
                ></AddNewSimOrderUI>
              </>
            )}
          </DrawerFormWrapper>
        </DrawerInnerBox>
      </Drawer>
    </>
  );
};

export default DisplayFormHandler;
