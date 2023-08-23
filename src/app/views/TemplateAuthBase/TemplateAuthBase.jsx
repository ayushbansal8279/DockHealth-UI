import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Redirect, useRouteMatch } from 'react-router-dom';

import { RouteWrapper } from 'routing/components';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import TemplateAuthBaseDailyHubContent from './TemplateAuthBase.DailyHubContent';
import TemplateAuthBaseApproveDisapproveContent from './TemplateAuthBase.ApproveDisapproveContent';
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
    case AUTH_BASE_STATES.DEFAULT: {
      return <TemplateAuthBaseDefaultContent />;
    }
    case AUTH_BASE_STATES.DAILY_HUB: {
      return <TemplateAuthBaseDailyHubContent />;
    }
    case AUTH_BASE_STATES.REGAIN_CONTROL: {
      return <TemplateAuthBaseRegainControlContent />;
    }
    case AUTH_BASE_STATES.APPROVE_DISAPPROVE: {
      return <TemplateAuthBaseApproveDisapproveContent />;
    }
    default: {
      return null;
    }
  }
};

const TemplateAuthBase = ({ childRoutes }) => {
  const currentAuthBaseState = useSelector(
    (store) => store.authBase.currentAuthBaseState,
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
              {childRoutes?.map((route) => (
                <RouteWrapper
                  permissions={route.permissions}
                  allowedToRoles={route.allowedToRoles}
                  key={route.path}
                  path={`${path}${route.path}`}
                  RouteComponent={route.RouteComponent}
                  onEnter={route.onEnter}
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
