import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';
import palette from 'styles/palette';

const redirectToLogout = (history) => {
  history.replace('/auth/logout');
};

const UnEnrolledUser = () => {
  const history = useHistory();
  return (
    <div>
      <MontserratTypography variant="h4">
        Security and protected health information is important to us. We noticed
        your email address is not associated with an organization that has been
        given access to Dock Health
      </MontserratTypography>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4">
        We will send an email to you with a few quick steps to gain access.
        Please check for an email from Dock Health shortly
      </MontserratTypography>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4">
        <span>For questions please contact us at </span>
        <a href="mailto:support@dock.health">support@dock.health</a>
      </MontserratTypography>
      <Spacing vertical={5} />
      <Button
        onClick={() => redirectToLogout(history)}
        color={palette.brightOrange}
        secondaryColor={palette.oPlusRed}
      >
        Logout here
      </Button>
    </div>
  );
};

export default UnEnrolledUser;
