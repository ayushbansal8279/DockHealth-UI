/* eslint-disable func-names */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, useRouteMatch, useHistory, Redirect } from 'react-router-dom';
import LoaderOverlay from 'components/common/Loader/LoaderOverlay';
import Drawer from 'components/drawer/Drawer';
import checkUserAuthentication from 'routing/helpers/check-user-authentication';
import { RouteWrapper } from 'routing/components';

const TemplateCoreSubscriptionPlan = ({
  childRoutes,
  onEnter,
  onLeave,
  setRedirection,
}) => {
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async function() {
      setIsLoading(true);
      const redirect = await checkUserAuthentication({
        history,
        dispatch,
        isRequiredLogin: true,
        isRequiredSubscription: true,
      });

      if (redirect) {
        setRedirection(redirect);
      } else if (onEnter) {
        await onEnter({ dispatch });
      }
      setIsLoading(false);
      setIsLoaded(true);
    })();

    return () => {
      (async function() {
        if (onLeave) {
          await onLeave({ dispatch });
        }
      })();
    };
  }, [dispatch, history, onEnter, onLeave, setRedirection]);

  return (
    <Drawer locationPathname={history?.location?.pathname}>
      {isLoading && <LoaderOverlay withBackground />}
      {!isLoading && (
        <Switch>
          {isLoaded &&
            childRoutes?.map(route => (
              <RouteWrapper
                key={route.path}
                path={`${path}${route.path}`}
                RouteComponent={route.RouteComponent}
                onEnter={route.onEnter}
                onUpdate={route.onUpdate}
                onLeave={route.onLeave}
                exact={route.exact}
              />
            ))}
          <Redirect from={`${path}/home`} to={`${path}/home/my-tasks`} />
        </Switch>
      )}
    </Drawer>
  );
};

export default TemplateCoreSubscriptionPlan;
