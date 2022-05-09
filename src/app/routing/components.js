/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable func-names */
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
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch(path);
  const { url } = match;

  useEffect(() => {
    (async function() {
      await dispatch(setLocationAndParameters(match));
    })();

    if (onEnter) {
      (async function() {
        await onEnter({ dispatch, history, match });
      })();
    }

    return () => {
      (async function() {
        if (onLeave) {
          await onLeave({ dispatch });
        }
      })();
    };
  }, [url]);

  return (
    <SecuredRoute
      allowedToRoles={allowedToRoles}
      path={path}
      component={RouteComponent}
      exact={exact}
    />
  );
};
