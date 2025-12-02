import PropTypes from 'prop-types';
import { createContext, useContext, useMemo } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';

export const AppInitConfigContext = createContext({
  config: {},
  masterData: {},
  userInfo: {},
  permissions: {},
  updateConfig: () => {},
  loadMasterData: () => {},
});

export const AppInitConfigProvider = ({ children, initialConfig = {} }) => {
  const [config, setConfig] = usePersistedState('conf', initialConfig);

  const updateConfig = (newConfig) => {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const providerValue = useMemo(
    () => ({
      config,
      updateConfig,
    }),
    [
      config,
    ]
  );

  return (
    <AppInitConfigContext.Provider value={providerValue}>
      {children}
    </AppInitConfigContext.Provider>
  );
};

export const useAppInitConfig = () => useContext(AppInitConfigContext);

AppInitConfigProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialConfig: PropTypes.object,
};
