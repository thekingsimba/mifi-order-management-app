import merge from 'lodash/merge';

const nodeEnv = import.meta.env.VITE_NODE_ENV;

const oauthClientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
const oauthServiceProvider = import.meta.env.VITE_OAUTH_SERVICE_PROVIDER;
const oauthUri = import.meta.env.VITE_OAUTH_URI;
const oauthPathUri = import.meta.env.VITE_OAUTH_PATH_URI;
const oauthResponseType = import.meta.env.VITE_OAUTH_RESPONSE_TYPE;
const oauthRedirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;
const oauthScope = import.meta.env.VITE_OAUTH_SCOPE;
const oauthState = import.meta.env.VITE_OAUTH_STATE;
const redirectState = import.meta.env.VITE_REDIRECT_STATE;
const refreshMethod = import.meta.env.VITE_REFRESH_METHOD;
const oauthPathSuffix = import.meta.env.VITE_OAUTH_PATH_SUFFIX;

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = import.meta.env.VITE_BASE_URL;
const appTheme = import.meta.env.VITE_APP_THEME;
const prodFileGeneratorApiUrl = import.meta.env.VITE_PROD_FILE_GENERATOR_API_URL;
const devFileGeneratorApiUrl = import.meta.env.VITE_DEV_FILE_GENERATOR_API_URL;
const prodFileGeneratorWebSocketUrl = import.meta.env.VITE_PROD_FILE_GENERATOR_WEB_SOCKET_URL;
const devFileGeneratorWebSocketUrl = import.meta.env.VITE_DEV_FILE_GENERATOR_WEB_SOCKET_URL;
const client = import.meta.env.VITE_CLIENT;


export const config = {
  "basePath": "/mifi-order-ui/",
  "afterLoginSuccessPath": "/mifi-order-manager",
  "sso": {
      "oauthUri": oauthUri,
      "oauthClientId": oauthClientId,
      "oauthServiceProviderName": oauthServiceProvider,
      "oauthPathUri": oauthPathUri,
      "oauthResponseType": oauthResponseType,
      "oauthRedirectUri": oauthRedirectUri,
      "oauthScope": oauthScope,
      "oauthState": oauthState,
      "redirectState":redirectState,
      "refreshMethod": refreshMethod,
      "oauthPathSuffix": oauthPathSuffix
  },
  "apiUrl": apiUrl,
  "baseUrl": baseUrl,
  "appTheme": appTheme,
  "prodFileGeneratorApiUrl": prodFileGeneratorApiUrl,
  "devFileGeneratorApiUrl": devFileGeneratorApiUrl,
  "prodFileGeneratorWebSocketUrl": prodFileGeneratorWebSocketUrl,
  "devFileGeneratorWebSocketUrl": devFileGeneratorWebSocketUrl,
  "nodeEnv": nodeEnv,
  "client": client
};

export default config;
