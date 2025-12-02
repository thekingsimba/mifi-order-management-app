import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuthContext } from '../auth/AuthContext';
import { useMasterDataContext } from 'src/contexts/MasterDataContext';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const {
    exchangeCodeForToken,
    getNewAuthCode,
    handleTokenCode,
    isAuthenticated,
    getPermission,
  } = useAuthContext();

  const [searchParams] = useSearchParams();
  const { routes } = useMasterDataContext();
  const code = searchParams.get('code');

  async function handleAuthentication() {
    const existingCode = localStorage.getItem('code');

    if (!isAuthenticated) {
      if (code && existingCode) {
        handleTokenCode(code);
      } else if (code) {
        localStorage.setItem('code', code);
        await exchangeCodeForToken(code);
        navigate('/');
      } else {
        getNewAuthCode();
      }
    } else {
      navigate('/');
    }
  }

  useEffect(() => {
    handleAuthentication();
  }, [isAuthenticated, routes, getPermission]);

  // Return null since this component is only used for side effects
  return null;
};

export default AuthRedirect;
