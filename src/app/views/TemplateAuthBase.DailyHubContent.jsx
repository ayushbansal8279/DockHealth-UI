import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import AuthDailyHubContent from '../img/auth-daily-hub-content';
import Spacing from '../components/common/Spacing';
import { MontserratTypography } from '../theme-montserrat';

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const DailyHubImage = styled(AuthDailyHubContent)`
  object-fit: contain;
  object-position: center;
  height: 60%;
  max-height: 60%;
  width: 100%;
`;

const TemplateAuthBaseDailyHubContent = () => {
  return (
    <StyledGrid
      container
      direction="column"
      justify="center"
      alignItems="flex-start"
    >
      <DailyHubImage />
      <Spacing vertical={4} />
      <MontserratTypography variant="h4" weight="bold">
        Dock is
      </MontserratTypography>
      <MontserratTypography variant="h2" weight="bold">
        Your Daily Hub.
      </MontserratTypography>
      <Spacing vertical={3} />
      <MontserratTypography variant="h5" weight="bold">
        No more reply all emails. No more Post-It notes or spreadsheets to
        manage patient care. Just an open route to better healthcare
        collaboration.
      </MontserratTypography>
    </StyledGrid>
  );
};

export default TemplateAuthBaseDailyHubContent;
