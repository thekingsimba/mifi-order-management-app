import { Box, Button, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuthContext } from 'src/auth/AuthContext';
import { getHomePageRoute } from '../HandleRouting';
import { useMasterDataContext } from 'src/contexts/MasterDataContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckingPermission() {
  const theme = useTheme();
  const { logout } = useAuthContext();
  const { routes } = useMasterDataContext();
  const { getPermission } = useAuthContext();
  const [homePage, setHomePage] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
  };

  const getHomePagePath = (allUserPermission) => {
    if (routes) {
      const homePageRoute = getHomePageRoute(routes, allUserPermission);
      if (homePageRoute?.path != '*') {
        // console.log('Home page found ', homePageRoute?.path);
        setHomePage(homePageRoute?.path);
        navigate(homePageRoute?.path);
      } else {
        setHomePage('');
      }
    }
  };

  const permissionsList = async () => {
    const activeUserPermission = await getPermission();
    getHomePagePath(activeUserPermission);
  };

  useEffect(() => {
    permissionsList();
  }, [routes, getPermission]);

  if (homePage) {
    return null;
  }

  return (
    <Paper
      sx={{
        width: '320px',
        padding: '19px',
        position: 'absolute',
        bottom: '200px',
        left: 'calc(50vw - 170px)',
      }}
    >
      <Box
        sx={{
          width: '300px',
          textAlign: 'center',
          color: theme.palette.error.main,
        }}
      >
        <Typography sx={{ textAlign: 'center' }}>
          Master Data was fetched, but user has no valid permission !
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}
          style={{
            marginLeft: '30px',
            position: 'relative',
            top: '-3px',
            backgroundColor: `${theme.palette.primary.main}`,
            color: `${theme.palette.primary.contrastText}`,
            marginTop: '20px',
          }}
        >
          LOGOUT
        </Button>
      </Box>
    </Paper>
  );
}

export default CheckingPermission;
