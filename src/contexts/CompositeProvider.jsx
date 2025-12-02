import {
  ToastProvider,
} from './ToastContext';
import propTypes from 'prop-types';
import ToastMessage from '../common/toastMessage/ToastMessage';
import ReduxProvider from '../redux/provider';
import { MasterDataProvider } from './MasterDataContext';
import { AuthProvider } from '../auth/AuthContext';
import { AppInitConfigProvider } from './AppInitConfigContext';

const CompositeProvider = ({ children, initialConfig }) => (
  <ToastProvider>
    <AppInitConfigProvider initialConfig={initialConfig}>
      <AuthProvider>
        <MasterDataProvider>
          <ReduxProvider>
            <ToastMessage />
            {children}
          </ReduxProvider>
        </MasterDataProvider>
      </AuthProvider>
    </AppInitConfigProvider>
  </ToastProvider>
);

CompositeProvider.propTypes = {
  children: propTypes.object.isRequired,
  initialConfig: propTypes.object.isRequired,
};

export default CompositeProvider;
