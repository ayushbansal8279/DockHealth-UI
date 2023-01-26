import React from 'react';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import DailyHubImage from 'img/auth-daily-hub-content-new.svg';

const hubStyles = {
  display: 'block',
  height: '60%',
  width: '80%',
  alignSelf: 'center',
};

const TemplateAuthBaseApproveDisapproveContent = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
    >
      <img src={DailyHubImage} style={hubStyles} alt="Dock Health daily hub" />
      <Spacing vertical={5} />
      <RobotoTypography variant="h3" weight="bold">
        Your team’s
      </RobotoTypography>
      <MontserratTypography variant="h2" weight="bold">
        to-do list done.
      </MontserratTypography>
      <Spacing vertical={3} />
      <RobotoTypography variant="h4">
        Dock gives your team a simple, HIPAA-compliant way to manage all your
        daily administrative and clinical tasks
      </RobotoTypography>
    </Grid>
  );
};

export default TemplateAuthBaseApproveDisapproveContent;
