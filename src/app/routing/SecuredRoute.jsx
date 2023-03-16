import React from 'react';
import { useSelector } from 'react-redux';
import {
  isFetchingProfileSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { Route, Redirect } from 'react-router-dom';
import { HOME_PATH } from 'routing/helpers/paths';

const SecureRoute = ({ required = [], ...props }) => {
  const { orgUserPermissions } = useSelector(userProfileSelector);
  const isFetchingRole = useSelector(isFetchingProfileSelector);

  if (!isFetchingRole && required && !orgUserPermissions) {
    return null;
  }

  if (required.every((permission) => orgUserPermissions?.[permission])) {
    return <Route {...props} />;
  }

  return <Redirect to={HOME_PATH} />;
};

export default SecureRoute;
