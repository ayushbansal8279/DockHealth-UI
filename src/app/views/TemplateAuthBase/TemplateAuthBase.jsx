import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';

import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import TemplateAuthBaseDailyHubContent from './TemplateAuthBase.DailyHubContent';
import TemplateAuthBaseDefaultContent from './TemplateAuthBase.DefaultContent';
import TemplateAuthBaseRegainControlContent from './TemplateAuthBase.RegainControlContent';
import {
  LeftSideContentContainer,
  LeftSideMainContainer,
  MainContainer,
  RightSideContentContainer,
  RightSideMainContainer,
  RightSideMaxWidthContainer,
} from './TemplateAuthBase.styled';

const getLeftSideContent = ({ currentAuthBaseState }) => {
  switch (currentAuthBaseState) {
    case AUTH_BASE_STATES.DEFAULT:
      return <TemplateAuthBaseDefaultContent />;
    case AUTH_BASE_STATES.DAILY_HUB:
      return <TemplateAuthBaseDailyHubContent />;
    case AUTH_BASE_STATES.REGAIN_CONTROL:
      return <TemplateAuthBaseRegainControlContent />;
    default:
      return null;
  }
};

const TemplateAuthBase = ({ childRoutes }) => {
  const currentAuthBaseState = useSelector(
    store => store.authBase.currentAuthBaseState,
  );

  const leftSideContent = getLeftSideContent({ currentAuthBaseState });
  const { path } = useRouteMatch();

  return (
    <MainContainer>
      <LeftSideMainContainer>
        <LeftSideContentContainer>{leftSideContent}</LeftSideContentContainer>
      </LeftSideMainContainer>
      <RightSideMainContainer>
        <RightSideContentContainer>
          <RightSideMaxWidthContainer>
            <Switch>
              {childRoutes?.map(route => (
                <Route
                  key={route.path}
                  path={`${path}${route.path}`}
                  component={route.RouteComponent}
                />
              ))}
              <Redirect
                from={`${path}/changePassword`}
                to={`${path}/forgotPassword`}
              />
            </Switch>
          </RightSideMaxWidthContainer>
        </RightSideContentContainer>
      </RightSideMainContainer>
    </MainContainer>
  );
};

export default TemplateAuthBase;
