import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../config';
import { fetchUserInfo, getToken, getUserInfoData } from './authService.js';
import { setSession } from './utils';

const initialState = {
  isAuthenticated: false,
  inExchangeTokenProcess: false,
  loginUserInfo: null,
  refreshedCode: null,
};
export const AuthContext = createContext(initialState);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(initialState);
  
  const navigate = useNavigate();

  const hasValidToken = (accessToken) => {
    setAuthState((prevState) => ({
      ...prevState,
      isAuthenticated: !!accessToken,
    }));

    if (!accessToken) {
      setAuthState({
        loginUserInfo: null,
        isAuthenticated: !!accessToken,
      });
    }
  };

  const initialize = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token') || '';
    hasValidToken(accessToken);
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getUserGroup = () => {
    return parseJsonData('loginUserGroup');
  };

  const parseJsonData = (key) => {
    const storedData = localStorage.getItem(key);

    if (storedData !== 'undefined') {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return {};
      }
    } else {
      return {};
    }
  };

  const getUser = useCallback(() => {
    const jsonData = parseJsonData('loggedInUser');
    if (jsonData !== null) {
      const {
        sub,
        mobile,
        location,
        preferred_username,
        fullname,
        given_name,
        family_name,
        email,
      } = jsonData;
      return {
        sub,
        mobile,
        location,
        preferred_username,
        fullname,
        given_name,
        family_name,
        email,
      };
    } else {
      console.error('The parsed JSON data is null.');
      return {};
    }
  }, []);

  const getPermission = useCallback(async () => {
    const loginUserData = parseJsonData('loggedInUser');

    if (!loginUserData?.permissions.length) {
      try {
        const res = await getUserInfoData();
        const permissionList = res.permissions.split(',');
        if (res?.status === 200) {
          const finalData = {
            ...res,
            permissions: permissionList,
            roles: res.roles.split(','),
          };
          localStorage.setItem('loggedInUser', JSON.stringify(finalData));
          return permissionList;
        } else {
          return [];
        }
      } catch (error) {
        console.error('Error while handling token exchange success:', error);
        return [];
      }
    } else {
      return loginUserData?.permissions;
    }
  }, []);

  const getUserRoles = () => {
    const loginUserData = parseJsonData('loggedInUser');
    const role = loginUserData?.roles[0] || '';
    return role.split('/')[0];
  };

  const getNewAuthCode = useCallback(async () => {
    const suffixUrl = `${config.sso.oauthUri}/${config.sso.oauthPathUri}`;
    const paramsUrl = `?client_id=${config.sso.oauthClientId}&response_type=${config.sso.oauthResponseType}&redirect_uri=${config.sso.oauthRedirectUri}&scope=openid&state=openid`;

    window.location.href = suffixUrl + paramsUrl;
  }, []);

  const handleTokenCode = useCallback((code) => {
    // if a getToken request is ongoing
    // them avoid a new request till we get a response
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (!authState.inExchangeTokenProcess) {
          clearInterval(intervalId);
          resolve(code);
        }
      }, 100);
    });
  }, []);

  const exchangeCodeForToken = useCallback(async (code) => {
    setAuthState((prevState) => ({
      ...prevState,
      inExchangeTokenProcess: true,
    }));

    try {
      const response = await getToken({ code });

      // this mention to the context that the request is done
      setAuthState((prevState) => {
        return {
          ...prevState,
          inExchangeTokenProcess: false,
        };
      });

      // handle the result
      if (response?.status === 200) {
        if (response.error && response.error === 'invalid_grant') {
          getNewAuthCode();
        } else {
          await handleTokenExchangeSuccess(
            response,
            setSession,
            getUserInfoData,
            localStorage,
            getUser,
            getUserRoles,
            fetchUserInfo
          );

          setAuthState((prevState) => {
            return {
              ...prevState,
              isAuthenticated: true,
              inExchangeTokenProcess: false,
            };
          });
          
          navigate('/');
        }
      } else {
        getNewAuthCode();
      }
    } catch (error) {
      // console.log('GetToken request failed ', error);
      getNewAuthCode();
      return error;
    }
  }, []);

  const handleTokenExchangeSuccess = async (
    response,
    setSession,
    getUserInfoData,
    localStorage,
    getUser,
    getUserRoles,
    fetchUserInfo
  ) => {
    const { access_token, refresh_token, token_type, expires_in, id_token } =
      response.data;
    setSession(
      access_token,
      refresh_token,
      token_type,
      expires_in,
      id_token,
      true
    );

    try {
      const res = await getUserInfoData();
      if (res?.status === 200) {
        const finalData = {
          ...res,
          permissions: res.permissions.split(','),
          roles: res.roles.split(','),
        };
        localStorage.setItem('loggedInUser', JSON.stringify(finalData));
        const loginUser = getUser();

        const username = `${getUserRoles()}/${loginUser?.preferred_username}`;
        const userInfoRes = await fetchUserInfo({
          type: 'userDetails',
          value: username,
        });
        localStorage.setItem(
          'loginUserGroup',
          JSON.stringify(userInfoRes?.userInfo)
        );
        setAuthState((prevState) => {
          return {
            ...prevState,
            loginUserInfo: res,
          };
        });
      }
    } catch (error) {
      console.error('Error while handling token exchange success:', error);
    }
  };

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    setAuthState({
      loginUserInfo: null,
      isAuthenticated: false,
    });
    const revokeURI = `${config.sso.oauthUri}/sso/oauth2/revoke`;
    const data = new URLSearchParams();
    data.set('token', `${localStorage.getItem('access_token')}`);
    try {
      await fetch(revokeURI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: data,
      });
    } catch (error) {
      console.error('Error while revoking token on logout', error);
    }
    localStorage.clear();
    const longPath =
      '/commonauth?commonAuthLogout=true&type=oidc2&commonAuthCallerPath=';
    window.location.replace(
      `${config.sso.oauthUri}${longPath}${config.sso.oauthRedirectUri}&relyingParty=${config.sso.oauthServiceProviderName}`
    );
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      loginUserInfo: authState.loginUserInfo,
      getNewAuthCode,
      logout,
      exchangeCodeForToken,
      getUser,
      getPermission,
      getUserGroup,
      handleTokenCode,
    }),
    [
      authState.isAuthenticated,
      authState.loginUserInfo,
      getNewAuthCode,
      logout,
      exchangeCodeForToken,
      getUser,
      getPermission,
      getUserGroup,
      handleTokenCode,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
