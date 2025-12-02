import http from '../services/http-common';

export const setSession = (access_token, refresh_token, expires_in, isAuthenticated) => {
    if (access_token) {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('expires_in', expires_in);
        localStorage.setItem('isAuthenticated', isAuthenticated);
        localStorage.removeItem('code');
        http.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    }
};
