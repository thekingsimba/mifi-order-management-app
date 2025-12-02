import { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuPopover from '../../components/menu-popover/MenuPopover';
import { useDispatch } from 'react-redux';
import { fetchAllOrderData } from '../../redux/features/manage-sim/simManagementDataSlice';

const HeaderColumHandler = ({
  tableHeaderColums = [],
  VisibleHeaderColumn = {},
  setVisibleHeaderColumn,
}) => {
  const [openPopover, setopenPopover] = useState(null);
  const dispatch = useDispatch();

  const handleHeadersDisplay = (e) => {
    // console.log('switched', e);
    setVisibleHeaderColumn((prevHeaders) => {
      return {
        ...prevHeaders,
        [e.target.name]: e.target.checked,
      };
    });
  };

  const handleClick = (event) => {
    setopenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setopenPopover(null);
  };

  const reloadData = () => {
    dispatch(fetchAllOrderData());
  }
  
  return (
    <>
      <Tooltip title="Reload Table Data">
        <IconButton onClick={reloadData}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      {/* <Tooltip title="Show/Hide Columns">
        <IconButton onClick={handleClick}>
          <ViewColumnIcon />
        </IconButton>
      </Tooltip> */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 'auto' }}
      >
        <FormControl component="fieldset" variant="standard">
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ marginLeft: 1 }}
          >
            Show Columns
          </Typography>

          <FormGroup>
            {VisibleHeaderColumn &&
              Object.keys(VisibleHeaderColumn).map((header) => {
                const label = tableHeaderColums.filter(
                  (item) => item.id === header
                )[0].label;
                return (
                  <MenuItem key={header}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={VisibleHeaderColumn[header]}
                          onChange={handleHeadersDisplay}
                          name={header}
                          size="small"
                          disabled={header === 'select'}
                        />
                      }
                      label={label}
                    />
                  </MenuItem>
                );
              })}
          </FormGroup>
        </FormControl>
      </MenuPopover>
    </>
  );
};

export default HeaderColumHandler;
