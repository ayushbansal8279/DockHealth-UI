import React from 'react';
import { hashHistory } from 'react-router';
import { NextButton } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'app/theme-montserrat';

const redirectToLogout = () => {
  hashHistory.replace('/logout');
};

const UnEnrolledUser = () => (
  <div>
    <MontserratTypography variant="h4">
      Security and protected health information is important to us. We noticed
      your email address is not associated with an organization that has been
      given access to Dock Health
    </MontserratTypography>
    <Spacing vertical={4} />
    <MontserratTypography variant="h4">
      We will send an email to you with a few quick steps to gain access. Please
      check for an email from Dock Health shortly
    </MontserratTypography>
    <Spacing vertical={4} />
    <MontserratTypography variant="h4">
      <span>For questions please contact us at </span>
      <a href="mailto:support@dock.health">support@dock.health</a>
    </MontserratTypography>
    <Spacing vertical={5} />
    <NextButton onClick={redirectToLogout} variant="contained">
      Logout here
    </NextButton>
  </div>
);

export default UnEnrolledUser;
