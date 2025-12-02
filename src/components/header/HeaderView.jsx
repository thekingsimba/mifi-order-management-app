import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import LOGO from '../../assets/icons/mtn-logo.svg';
import { useAuthContext } from '../../auth/AuthContext';
import SVGIcon from '../../common/svgIcon/SVGIcon';
import Settings from './Settings';

const Header = () => {
  const navigate = useNavigate();

  const { logout } = useAuthContext();

  const backToHome = () => {
    navigate('/dashboard', { replace: true });
  };
  const handleLogout = async () => {
    logout();
  };
  return (
    <AppBar position="fixed" color="inherit" sx={{ top: 0 }}>
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Grid item xs={2} md={2}>
            <Grid container alignItems="center" justifyContent="start">
              <Grid item onClick={backToHome} sx={{ cursor: 'pointer' }}>
                <SVGIcon iconName={LOGO} iconWidth={50} iconHeight={50} />
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={3} md={3}>
            <SearchBar />
          </Grid> */}
          <Grid item xs={7} md={7}>
            <Settings logout={handleLogout} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
