
import LanguageIcon from '@mui/icons-material/Language';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import i18n from '../../utils/i18n';
import { useAppInitConfig } from '../../contexts/AppInitConfigContext';
import ToolTipView from '../toolTip/ToolTipView';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
const StyledRootMenu = styled(Menu)(({ theme }) => ({
    paper: {
        background: `${theme.palette.common.white} 0% 0% no-repeat padding-box`,
        boxShadow: theme.spacing(0, 0, 4),
        opacity: 1,
        padding: theme.spacing(4),
        marginTop: '2.5% !important',
        overflow: 'inherit',
        '&::after': {
            content: 'close-quote',
            position: 'absolute',
            bottom: '100%',
            left: '78%',
            marginLeft: -8,
            borderWidth: 8,
            borderStyle: 'solid',
            borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
        },
    },
}));

const Settings = ({ logout }) => {
    // const { userInfo } = useAppInitConfig();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const selectedLanguage = i18n.language?.split('-')[0];
    const [language, setLanguage] = useState(selectedLanguage);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    };
    return (
      <Grid
        container
        justifyContent={'flex-end'}
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <ToolTipView message="Account settings">
            <IconButton
              size="small"
              aria-label="user profile"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <Avatar sx={{ width: 24, height: 24 }} />
            </IconButton>
          </ToolTipView>
          <StyledRootMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 24,
                  height: 24,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {' '}
            <Grid
              container
              justifyContent={'flex-end'}
              alignItems="center"
              direction="column"
              spacing={4}
            >
              {/* <Grid item>
                            <MenuItem >
                                <Typography variant="body1">userInfo.sub</Typography>
                            </MenuItem>
                        </Grid> */}
              <Grid item>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    value={language}
                    onChange={handleLanguageChange}
                    displayEmpty
                    startAdornment={
                      <LanguageIcon color="primary" sx={{ mr: 1 }} />
                    }
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <MenuItem onClick={logout}>
                  <Typography variant="body1">Logout</Typography>
                </MenuItem>
              </Grid>
            </Grid>
          </StyledRootMenu>
        </Grid>
      </Grid>
    );

}
export default Settings;
