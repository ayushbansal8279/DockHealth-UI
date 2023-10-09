import { Grid } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import LoginImg from 'img/login.png';
import { MontserratTypography } from 'styles/theme-montserrat';

const TranscriptImage = styled.img.attrs({
  src: LoginImg,
  alt: 'dock-health',
})`
  object-fit: contain;
`;

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const TemplateAuthBaseLoginContent = () => {
  return (
    <StyledGrid
      container
      justifyContent="center"
      alignItems="flex-start"
      direction="column"
    >
      <Grid item>
        <TranscriptImage />
        <Spacing vertical={5} />
        <MontserratTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          Collaboration built by healthcare professionals
        </MontserratTypography>
        <MontserratTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          for healthcare professionals.
        </MontserratTypography>
        <Spacing vertical={3} />
        <MontserratTypography
          weight="light"
          variant="h4"
          color="rgba(0, 0, 0, 0.6)"
          align="center"
        >
          Make your communication contextual with the one <br /> administrative
          tool you need to get healthcare done.
        </MontserratTypography>
      </Grid>
    </StyledGrid>
  );
};

export default TemplateAuthBaseLoginContent;
