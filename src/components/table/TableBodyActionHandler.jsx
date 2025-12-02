import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Drawer, Grid, IconButton, MenuItem, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  OverviewIndexRightPaper,
  SimIndexGridItem,
} from '../../components/sim-styles/simStyles.js';
import { splitArray } from '../../pages/sim-management-utils/sim-management-utils.js';
import MenuPopover from '../menu-popover';
import {
  DrawerCloseBtnBox,
  DrawerFormWrapper,
  DrawerInnerBox,
} from '../sim-styles/simStyles';

function CardWrapper({ children }) {
  return (
    <SimIndexGridItem item xs={12}>
      <OverviewIndexRightPaper>{children}</OverviewIndexRightPaper>
    </SimIndexGridItem>
  );
}

function Row({ label, value = '' }) {
  return (
    <Stack
      direction="row"
      sx={{ typography: 'caption', textTransform: 'capitalize' }}
    >
      <Box
        component="span"
        sx={{
          minWidth: 200,
          mr: 2,
        }}
      >
        <Typography
          sx={{
            lineHeight: 2,
            fontWeight: 'bold',
          }}
        >
          {label}
          {' :'}
        </Typography>
      </Box>

      <Typography
        sx={{
          lineHeight: 2,
        }}
      >
        {value}{' '}
      </Typography>
    </Stack>
  );
}

const TableBodyActionHandler = ({ tableType, dataId, itemObject, status }) => {
  // console.log(tableType, ' the table type')
  const { allSimOrderData } = useSelector(
    (state) => state.simManagementDataSlice.simOrderGlobalData
  );

  const { mainTableHeader } = useSelector((state) => state.overViewSlice);

  const [singleElement, setSingleElement] = useState({});
  const [cardData = [], setCardData] = useState({});
  const [openPopover, setOpenPopover] = useState(null);
  const [openDrawer, setOpenDrawer] = useState({
    drawer: false,
    type: '',
  });

  const navigate = useNavigate();

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const togglePopOverAndSetDrawer = (state) => {
    handleClosePopover();
    setOpenDrawer(state);
  };

  const openSingleOrderPage = () => {
    handleClosePopover();
    navigate('/sim-manager/' + dataId);
  };

  const downloadAssociatedFiles = () => {
    // REQUEST
  };

  const toggleFormDrawer = (state) => {
    setOpenDrawer({ drawer: state.drawer, type: state.type });
  };

  const retrieveOverviewCardData = () => {
    const getVisibleHeaders = mainTableHeader.filter(
      (element) => element.visible
    );

    const cardData = splitArray(getVisibleHeaders);

    setCardData(cardData);
  };

  useEffect(() => {
    if (tableType != 'sim') {
      retrieveOverviewCardData();
      setSingleElement(itemObject);
    }
  }, [allSimOrderData, dataId, tableType]);

  return (
    <>
      {tableType != 'overviewTable' && (
        <IconButton
          color={openPopover ? 'inherit' : 'default'}
          onClick={handleOpenPopover}
        >
          <MoreVertIcon id="action" />
        </IconButton>
      )}

      {tableType == 'overviewTable' && (
        <IconButton
          color={openPopover ? 'inherit' : 'default'}
          onClick={() =>
            togglePopOverAndSetDrawer({
              drawer: true,
              type: 'OverviewTableDetails',
            })
          }
        >
          <InfoOutlinedIcon id="action" />
        </IconButton>
      )}

      {tableType != 'sim-hlr' && (
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            disabled={status === 'generated'}
            sx={{
              cursor: status === 'generated' ? 'not-allowed' : 'pointer',
            }}
            onClick={() =>
              togglePopOverAndSetDrawer({ drawer: true, type: 'Edit' })
            }
          >
            <EditIcon />
            Edit
          </MenuItem>

          <MenuItem onClick={openSingleOrderPage}>
            <ManageAccountsIcon />
            Single view
          </MenuItem>
        </MenuPopover>
      )}
      {tableType == 'sim-hlr' && (
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 140 }}
        >
          <MenuItem
            disabled={status === 'generated'}
            sx={{
              cursor: status === 'generated' ? 'not-allowed' : 'pointer',
            }}
            onClick={() =>
              togglePopOverAndSetDrawer({ drawer: true, type: 'Edit' })
            }
          >
            <EditIcon />
            Edit
          </MenuItem>

          <MenuItem onClick={downloadAssociatedFiles}>
            <DownloadIcon />
            Download files
          </MenuItem>
        </MenuPopover>
      )}

      <Drawer
        anchor={'bottom'}
        open={openDrawer.drawer}
        onClose={() => toggleFormDrawer({ drawer: false, type: '' })}
      >
        <DrawerInnerBox>
          <DrawerCloseBtnBox>
            <IconButton
              onClick={() => toggleFormDrawer({ drawer: false, type: '' })}
            >
              <ClearIcon fontSize="3rem" />
            </IconButton>
          </DrawerCloseBtnBox>
          <DrawerFormWrapper>
            {tableType === 'overviewTable' && (
              <>
                <CardWrapper>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    Overview table details
                  </Typography>

                  <Card
                    variant="outlined"
                    sx={{
                      mt: 4,
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                      }}
                    >
                      <Grid
                        sx={{ marginBottom: 2 }}
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Grid item xs={12} sm={6} md={6}>
                          <Box component="section" sx={{ p: 2 }}>
                            {cardData.firstGridData &&
                              cardData.firstGridData.map((element, index) => (
                                <Row
                                  label={element.label}
                                  value={singleElement[element.id]}
                                  key={element.label + index}
                                />
                              ))}
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                          <Box component="section" sx={{ p: 2 }}>
                            {cardData.secondGridData &&
                              cardData.secondGridData.map((element, index) => (
                                <Row
                                  label={element.label}
                                  value={singleElement[element.id]}
                                  key={element.label + index}
                                />
                              ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>
                </CardWrapper>
              </>
            )}
          </DrawerFormWrapper>
        </DrawerInnerBox>
      </Drawer>
    </>
  );
};

export default TableBodyActionHandler;
