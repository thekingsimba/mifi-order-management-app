import { setSession } from '../auth/utils';
import config from '../config';
import http from '../services/http-common';

const apiErrorHandle = async (res, errorMessage) => {
  if (res && (res.status === 401 || res.status === 412)) {
    await exchangeTokenWithRefreshToken();
  }
  return { ...res, ...{ errorMessage } };
};

export const exchangeTokenWithRefreshToken = async () => {
  const oauthUri = config?.sso?.oauthUri;
  try {
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: localStorage.getItem('refresh_token'),
      scope: config.sso.oauthScope || 'openid',
      state: config.sso.redirectState || 'refreshToken',
    };

    const res = http.post(`${oauthUri}/oauth2/token`, payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (res.error && res.error === 'invalid_grant') {
      return redirectLoginPage();
    }

    const { access_token, refresh_token, token_type, expires_in, id_token } =
      res.data;
    setSession(
      access_token,
      refresh_token,
      token_type,
      expires_in,
      id_token,
      true
    );
  } catch (error) {
    revokeToken();
    return error;
  }
  return null;
};

export const redirectLoginPage = () => {
  const redirectUrl = `&redirect_uri=${config.sso.oauthRedirectUri}&scope=openid&state=openid`;
  const queryParams = `client_id=${config.sso.oauthClientId}&response_type=${config.sso.oauthResponseType}${redirectUrl}`;
  window.location.href = `${config.sso.oauthUri}/${config.sso.oauthPathUri}?${queryParams}`;
};

export const getToken = async ({ code }) => {
  const apiUrl = config?.apiUrl;

  try {
    const queryParams = `authCode=${code}&redirect_uri=${config.sso.oauthRedirectUri}`;
    const url = `${apiUrl}/api/mifi-order/v1/getTokenAuth/getToken?${queryParams}`;

    const response = await http.get(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return { ...response, status: 200 };
  } catch (error) {
    console.error('Error fetching token:', error.response);
    return await apiErrorHandle(error.response);
  }
};

export const getUserInfoData = async () => {
  const accessToken = localStorage.getItem('access_token') || '';
  const oauthUri = config?.sso?.oauthUri;
  try {
    const response = await http.get(
      `${oauthUri}/oauth2/userinfo?schema=openid`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { ...response.data, status: 200 };
  } catch (error) {
    console.error('Error fetching user info:', error.response);
    return await apiErrorHandle(error.response);
  }
};

export const fetchUserInfo = async (params) => {
  const apiUrl = config?.apiUrl;
  const accessToken = localStorage.getItem('access_token') || '';
  try {
    const suffixUrl = `${apiUrl}/tt-api/mifi-order/v1/UserGroup/${params.type}`;
    const response = await http.get(`${suffixUrl}?value=${params.value}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details Info:', error.response);
    return await apiErrorHandle(error.response);
  }
};

const revokeToken = async () => {
  const data = new URLSearchParams();
  data.set('token', `${localStorage.getItem('access_token')}`);
  localStorage.clear();
  const queryParmas = `&commonAuthCallerPath=${config.sso.oauthRedirectUri}&relyingParty=${config.sso.oauthServiceProviderName}`;
  window.location.replace(
    `${config.sso.oauthUri}/commonauth?commonAuthLogout=true&type=oidc2${queryParmas}`
  );
};
