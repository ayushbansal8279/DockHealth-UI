import React, { useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLocationAndParameters } from 'location/actions';
import SecuredRoute from './SecuredRoute';

export const RouteWrapper = ({
  path,
  RouteComponent,
  onEnter,
  onLeave,
  exact,
  allowedToRoles,
  permissions = [],
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch(path);
  const { url } = match;

  useEffect(() => {
    (async () => {
      await dispatch(setLocationAndParameters(match));
    })();

    if (onEnter) {
      (async () => {
        await onEnter({ dispatch, history, match });
      })();
    }

    return () => {
      (async () => {
        if (onLeave) {
          await onLeave({ dispatch });
        }
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <SecuredRoute
      required={permissions}
      allowedToRoles={allowedToRoles}
      path={path}
      component={RouteComponent}
      exact={exact}
    />
  );
};
