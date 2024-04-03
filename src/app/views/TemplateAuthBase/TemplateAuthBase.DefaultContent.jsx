import { Grid } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import TranscriptPng from 'img/auth-transcript.png';
import { MontserratTypography } from 'styles/theme-montserrat';

const TranscriptImage = styled.img.attrs({
  src: TranscriptPng,
  alt: 'transcript',
})`
  object-fit: contain;
`;

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const TemplateAuthBaseDefaultContent = () => {
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
          Bye bye Post-It Notes.
        </MontserratTypography>
        <MontserratTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          Hello efficiency.
        </MontserratTypography>
        <Spacing vertical={3} />
        <MontserratTypography
          weight="light"
          variant="h4"
          color="rgba(0, 0, 0, 0.6)"
          align="center"
        >
          Save time, work better with HIPAA-compliant task management and
          workflow automation from <br /> Dock Health.
        </MontserratTypography>
      </Grid>
    </StyledGrid>
  );
};

export default TemplateAuthBaseDefaultContent;
