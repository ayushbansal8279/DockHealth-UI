import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, useRouteMatch, useHistory, Redirect } from 'react-router-dom';
import NavigationTemplate from 'components/navigation/NavigationTemplate/NavigationTemplate';
import PageLoader from 'components/navigation/PageLoader';
import checkUserAuthentication from 'routing/helpers/check-user-authentication';
import checkUserAccountState from 'routing/helpers/check-user-account-state';
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
    (async () => {
      setIsLoading(true);
      // eslint-disable-next-line prefer-const
      let { redirectPath, user } = await checkUserAuthentication({
        history,
        dispatch,
        isRequiredLogin: true,
      });
      if (!redirectPath) {
        redirectPath = await checkUserAccountState({
          user,
          history,
          dispatch,
          isRequiredSubscription: true,
        });
      }

      if (redirectPath) {
        setRedirection(redirectPath);
      } else if (onEnter) {
        await onEnter({ dispatch });
      }
      setIsLoading(false);
      setIsLoaded(true);
    })();

    return () => {
      (async () => {
        if (onLeave) {
          await onLeave({ dispatch });
        }
      })();
    };
  }, [dispatch, history, onEnter, onLeave, setRedirection]);

  return (
    <>
      {!isLoading && (
        <NavigationTemplate>
          <Switch>
            {isLoaded &&
              childRoutes?.map(route => (
                <RouteWrapper
                  permissions={route.permissions}
                  allowedToRoles={route.allowedToRoles}
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
        </NavigationTemplate>
      )}
      {isLoading && <PageLoader />}
    </>
  );
};

export default TemplateCoreSubscriptionPlan;
