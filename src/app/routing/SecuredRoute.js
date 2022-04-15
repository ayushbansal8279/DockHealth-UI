/* eslint-disable consistent-return */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import {
  userProfileSelector,
  isFetchingProfileSelector,
} from 'selectors/user-selectors';
import { HOME_PATH } from './helpers/paths';

const SecuredRoute = ({
  allowedToRoles,
  ComponentToRender = Route,
  ...restProps
}) => {
  const { orgUserRole } = useSelector(userProfileSelector);
  const isFetchingRole = useSelector(isFetchingProfileSelector);

  const renderRoute = () => <ComponentToRender {...restProps} />;

  if (!isFetchingRole && allowedToRoles && !orgUserRole) return null;
  if (!allowedToRoles) return renderRoute();
  if (typeof allowedToRoles === 'string') {
    return allowedToRoles === orgUserRole ? (
      renderRoute()
    ) : (
      <Redirect to={HOME_PATH} />
    );
  }
  if (Array.isArray(allowedToRoles)) {
    if (!orgUserRole) return null;
    const matched = allowedToRoles.find(r => r === orgUserRole);
    return matched ? renderRoute() : <Redirect to={HOME_PATH} />;
  }
};

export default SecuredRoute;
