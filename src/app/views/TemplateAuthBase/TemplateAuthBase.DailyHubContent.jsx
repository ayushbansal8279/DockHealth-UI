import React from 'react';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import DailyHubImage from 'img/auth-daily-hub-content-new';

const hubStyles = {
  display: 'block',
  height: '60%',
  width: '80%',
  alignSelf: 'center',
};

const TemplateAuthBaseDailyHubContent = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
    >
      <img src={DailyHubImage} style={hubStyles} alt="Dock Health daily hub" />
      <Spacing vertical={4} />
      <RobotoTypography variant="h3" weight="bold">
        Dock is
      </RobotoTypography>
      <MontserratTypography variant="h2" weight="bold">
        Your Daily Hub.
      </MontserratTypography>
      <Spacing vertical={3} />
      <RobotoTypography variant="h4" weight="bold">
        No more reply all emails. No more Post-It notes or spreadsheets to
        manage patient care. Just an open route to better healthcare
        collaboration.
      </RobotoTypography>
    </Grid>
  );
};

export default TemplateAuthBaseDailyHubContent;
