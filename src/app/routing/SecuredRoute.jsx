import React, { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  isFetchingProfileSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { Route, Redirect } from 'react-router-dom';
import { DEFAULT_REDIRECT_PATH, HOME_PATH } from 'routing/helpers/paths';
import { isAuthenticated } from 'api/user-auth-api';

function LazyRedirect() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    isAuthenticated().then((authenticated) =>
      setIsLoggedIn(authenticated.isLoggedIn),
    );
  }, []);

  return isLoggedIn ? (
    <Redirect to={HOME_PATH} />
  ) : (
    <Redirect to={DEFAULT_REDIRECT_PATH} />
  );
}

const SecureRoute = ({ required = [], ...props }) => {
  const { orgUserPermissions } = useSelector(userProfileSelector);
  const isFetchingRole = useSelector(isFetchingProfileSelector);

  if (!isFetchingRole && required && !orgUserPermissions) {
    return null;
  }

  if (
    required.every((permission) =>
      orgUserPermissions ? orgUserPermissions[permission] : undefined,
    )
  ) {
    return <Route {...props} />;
  }

  return (
    <Suspense fallback={null}>
      <LazyRedirect />
    </Suspense>
  );
};

export default SecureRoute;
