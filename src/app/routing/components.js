/* eslint-disable import/prefer-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable func-names */
import React, { useEffect } from 'react';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLocationAndParameters } from 'location/actions';

export const RouteWrapper = ({
  path,
  RouteComponent,
  onEnter,
  onLeave,
  exact,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch(path);

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
  }, [match]);

  return <Route path={path} component={RouteComponent} exact={exact} />;
};
