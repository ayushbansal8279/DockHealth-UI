import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme-outfit';
import palette from 'styles/palette';

const redirectToLogout = (history) => {
  history.replace('/auth/logout');
};

const PendingUser = () => {
  const history = useHistory();
  return (
    <div>
      <OutfitTypography variant="h4">
        Your account has not yet been approved. Please contact your organization
        Admin to approve it.
      </OutfitTypography>
      <Spacing vertical={4} />
      <OutfitTypography variant="h4">
        Once your account is approved by an administrator, you will be able to
        access Dock Health.
      </OutfitTypography>
      <Spacing vertical={4} />
      <OutfitTypography variant="h4">
        <span>For questions please contact us at </span>
        <a href="mailto:support@dock.health">support@dock.health</a>
      </OutfitTypography>
      <Spacing vertical={5} />
      <Button
        size="large"
        onClick={() => redirectToLogout(history)}
        color={palette.brightOrange}
        secondaryColor={palette.oPlusRed}
      >
        Logout
      </Button>
    </div>
  );
};

export default PendingUser;
