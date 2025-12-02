import { Route } from 'react-router-dom';
import { componentMatching } from './MasterDataRoutesMapping';

// permission example: 'dclm.bo.simManager'

const hasPermission = (userPermission = [], configPermission = '') => {
  //console.log(userPermission);
  return userPermission.includes(configPermission);
};

export const joinComponentAndPermission = (
  userPermissionList = [],
  routes = []
) => {
  const routesWithPermissionControl = routes.map((routeObject) => {
    const associatedComponent = componentMatching(routeObject);
    return {
      ...routeObject,
      component: associatedComponent,
      hasPermission: routeObject?.permission
        ? hasPermission(userPermissionList, routeObject?.permission)
        : true,
      children: routeObject?.children?.length
        ? joinComponentAndPermission(userPermissionList, routeObject?.children)
        : [],
      componentName: routeObject?.component,
    };
  });

  return routesWithPermissionControl.filter((route) => route.hasPermission);
};

const displayRouting = (paths) => {
  return paths.map((route, index) => {
    const { children } = route;
    if (children?.length > 0) {
      return (
        <Route key={index} path={route?.path} exact element={route?.component}>
          {displayRouting(route?.children)}
        </Route>
      );
    } else {
      return (
        <Route
          key={index}
          path={route?.path}
          exact
          element={route?.component}
        />
      );
    }
  });
};

export const handleRoutingFromConfig = (userPermissionList, routes) => {
  let routeList = joinComponentAndPermission(userPermissionList, routes);
  // console.log(routeList);
  return displayRouting(routeList);
};

export const getHomePageRoute = (masterDataRoute, userPermission) => {
  const masterRouteDataMapping = joinComponentAndPermission(
    userPermission,
    masterDataRoute
  );

  const mainRoute = masterRouteDataMapping.filter(
    (routeObj) => routeObj.hasPermission
  );
  return mainRoute[1];
};
