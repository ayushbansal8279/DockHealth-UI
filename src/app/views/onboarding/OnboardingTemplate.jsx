import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { useSmallScreen } from 'helpers/utility-functions';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import checkUserAuthentication from 'routing/helpers/check-user-authentication';
import { RouteWrapper } from 'routing/components';
import {
  OnboardingBackground,
  OnboardingLogo,
  OnboardingMainContainer,
  OnboardingNavbar,
} from './OnboardingTemplate.Components';

const OnboardingTemplate = ({ childRoutes, setRedirection }) => {
  const isSmallScreen = useSmallScreen();
  const { path } = useRouteMatch();

  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line func-names
    (async function() {
      setIsLoading(true);
      const { redirectPath } = await checkUserAuthentication({
        history,
        dispatch,
        isRequiredLogin: true,
      });

      if (redirectPath) {
        setRedirection(redirectPath);
      }

      setIsLoading(false);
      setIsLoaded(true);
    })();
  }, [dispatch, history, setRedirection]);

  return (
    <>
      {!isLoading && (
        <OnboardingBackground>
          <OnboardingNavbar>
            <a href="/#/core/home/my-tasks">
              <OnboardingLogo alt="Dock Health logo" src={DockHeaderLogo} />
            </a>
          </OnboardingNavbar>
          <OnboardingMainContainer isSmallScreen={isSmallScreen}>
            <Switch>
              {isLoaded &&
                childRoutes?.map(route => (
                  <RouteWrapper
                    key={route.path}
                    path={`${path}${route.path}`}
                    RouteComponent={route.RouteComponent}
                    onEnter={route.onEnter}
                    onLeave={route.onLeave}
                    exact={route.exact}
                  />
                ))}
            </Switch>
          </OnboardingMainContainer>
        </OnboardingBackground>
      )}
    </>
  );
};

export default OnboardingTemplate;
