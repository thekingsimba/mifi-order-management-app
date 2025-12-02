import { Grid, styled, Typography } from '@mui/material';
import {
  Route,
  Routes as Switch,
  //useLocation,
} from 'react-router-dom';

import { Box } from '@mui/system';
import AuthRedirect from '../auth/AuthRedirect';
import Visible from '../common/visible/Visible';
import Header from '../components/header/HeaderView';
import { MainSpaceContainer } from '../components/sim-styles/simStyles';
import { useMasterDataContext } from '../contexts/MasterDataContext';
import {
  handleRoutingFromConfig,
  joinComponentAndPermission,
} from './HandleRouting';
import ProtectedRoute from './ProtectedRoute';
import SidebarWithChildrenBox from './SidebarWithChildrenBox';
import { useEffect, useState } from 'react';
import CustomLoaderView from 'src/common/customLoader/CustomLoaderView';
import { useTheme } from '@mui/material/styles';
import WifiPasswordIcon from '@mui/icons-material/WifiPassword';
import { useAuthContext } from 'src/auth/AuthContext';

const HeaderSpacing = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Routes = () => {
  const [appRoutes, setAppRoutes] = useState([]);
  const [userPermission, setUserPermission] = useState([]);
  const { routes, headerStatus, errorMessage } = useMasterDataContext();
  const theme = useTheme();
  const { isAuthenticated, getPermission } = useAuthContext();

  //const location = useLocation();
  //const queryParams = new URLSearchParams(location.search);
  //const hideHeaderFormUrl = queryParams.get('hideHeader') === 'true';

  const permissionsList = async () => {
    const activeUserPermission = await getPermission();
    setUserPermission(activeUserPermission);
  };

  useEffect(() => {
    permissionsList();
    if (routes) {
      setAppRoutes(routes);
    }
  }, [routes, isAuthenticated]);

  return appRoutes?.length > 0 ? (
    <Box
      container
      direction="column"
      sx={{
        height: '100%',
        minHeight: 'calc(100vh - 16px)',
        background: 'whitesmoke',
      }}
    >
      {headerStatus === 'show' && (
        <>
          <Grid item xs={12}>
            <Header />
          </Grid>
          <HeaderSpacing />
        </>
      )}
      <Grid container>
        <Grid sx={{ width: '86px' }} item>
          <SidebarWithChildrenBox
            menuItems={joinComponentAndPermission(userPermission, appRoutes)}
          />
        </Grid>

        <Grid item sx={{ width: 'calc(100% - 86px)' }}>
          <MainSpaceContainer>
            <Switch>
              <Route element={<ProtectedRoute />}>
                {handleRoutingFromConfig(userPermission, appRoutes)}
              </Route>

              <Route path="/auth" exact element={<AuthRedirect />} />
            </Switch>
          </MainSpaceContainer>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <>
      {errorMessage && isAuthenticated ? (
        <Box
          sx={{
            width: '300px',
            textAlign: 'center',
            color: theme.palette.error.main,
            position: 'absolute',
            bottom: '200px',
            left: 'calc(50vw - 170px)',
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              marginBottom: '15px',
              marginTop: '20px',
            }}
          >
            <WifiPasswordIcon sx={{ fontSize: 100 }} />
          </Box>
          <Typography sx={{ textAlign: 'center' }}>
            {errorMessage} ! Kindly check SDP AppGate (or network) and reload
            ...
          </Typography>
        </Box>
      ) : (
        <CustomLoaderView loaderProperty={{ isLoader: true }} />
      )}
    </>
  );
};

export default Routes;
