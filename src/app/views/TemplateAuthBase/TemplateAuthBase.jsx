import { node } from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
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

const TemplateAuthBase = ({ children }) => {
  const currentAuthBaseState = useSelector(
    store => store.authBase.currentAuthBaseState,
  );

  const leftSideContent = getLeftSideContent({ currentAuthBaseState });

  return (
    <MainContainer>
      <LeftSideMainContainer>
        <LeftSideContentContainer>{leftSideContent}</LeftSideContentContainer>
      </LeftSideMainContainer>
      <RightSideMainContainer>
        <RightSideContentContainer>
          <RightSideMaxWidthContainer>{children}</RightSideMaxWidthContainer>
        </RightSideContentContainer>
      </RightSideMainContainer>
    </MainContainer>
  );
};
TemplateAuthBase.propTypes = {
  children: node.isRequired,
};

export default withRouter(TemplateAuthBase);
