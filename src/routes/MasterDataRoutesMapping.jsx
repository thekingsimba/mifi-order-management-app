import { lazy } from 'react';
import { CreditScore } from '../pages/credit-score/CreditScore';
import SimPreActivation from '../pages/sim-management-pages/preActivation/SimPreActivation';
import SingleBatchPage from 'src/pages/SimOrdersPage/SingleBatchPage';
import SingleSimOrderPage from 'src/pages/SimOrdersPage/SingleSimOrderPage';
import AppConfigPage from 'src/pages/appConfigPage/AppConfigPage';
import RangeSettingPage from 'src/pages/rangeSettingPage/RangeSettingPage';
import CheckingPermission from './routes-setting-component/CheckingPermission';
import SimOrderMainPage from 'src/pages/SimOrdersPage/SimOrderMainPage';
import SimManufacturerFilesPage from 'src/pages/SimOrdersPage/SimManufacturerFilesPage';

const TsatOverView = lazy(() =>
  import('../pages/tsat/components/tsatRightArea/TsatOverView')
);

const TsatCancelOffer = lazy(() =>
  import('../pages/tsat/components/tsatRightArea/TsatCancelOffer')
);

const TsatExtendAttachment = lazy(() =>
  import('../pages/tsat/components/tsatRightArea/TsatExtendAttachment')
);

const TsatOffer = lazy(() =>
  import('../pages/tsat/components/tsatRightArea/TsatOffer')
);

const TsatMsisdn = lazy(() =>
  import('../pages/tsat/components/tsatRightArea/TsatMsisdn')
);

const Tsat = lazy(() => import('../pages/tsat/main'));

const SimOrdersPage = lazy(() =>
  import('../pages/SimOrdersPage/SimOrdersPage')
);

// const NoData = lazy(() => import('../pages/tsat/components/NoData'))

export const componentMatching = (routeObject) => {
  let componentToRender;

  switch (routeObject?.component) {
    case 'CheckingPermission':
      componentToRender = <CheckingPermission />;
      break;

    case 'CreditScore':
      componentToRender = <CreditScore />;
      break;

    case 'SimPreActivation':
      componentToRender = <SimPreActivation />;
      break;

    case 'Tsat':
      componentToRender = <Tsat {...routeObject} />;
      break;

    case 'TsatMsisdn':
      componentToRender = <TsatMsisdn {...routeObject?.children} />;
      break;

    case 'TsatOverView':
      componentToRender = <TsatOverView {...routeObject?.children} />;
      break;

    case 'TsatOffer':
      componentToRender = (
        <TsatOffer formPath="attachment" {...routeObject?.children} />
      );
      break;

    case 'TsatExtendAttachment':
      componentToRender = (
        <TsatExtendAttachment
          formPath="extendOffer"
          {...routeObject?.children}
        />
      );
      break;

    case 'TsatCancelOffer':
      componentToRender = (
        <TsatCancelOffer formPath="cancelOffer" {...routeObject?.children} />
      );
      break;

    case 'SimOrderPage':
      componentToRender = <SimOrdersPage />;
      break;

    case 'SimOrderMainPage':
      componentToRender = <SimOrderMainPage />;
      break;

    case 'SingleBatchPage':
      componentToRender = <SingleBatchPage />;
      break;

    case 'SingleSimOrderPage':
      componentToRender = <SingleSimOrderPage />;
      break;

    case 'SimManufacturerFilesPage':
      componentToRender = <SimManufacturerFilesPage />;
      break;

    case 'RangeSettingPage':
      componentToRender = <RangeSettingPage />;
      break;

    case 'AppConfigPage':
      componentToRender = <AppConfigPage />;
      break;
  }

  return componentToRender;
};
