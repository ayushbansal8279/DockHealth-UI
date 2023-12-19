import { Grid } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import SignImg from 'img/signup.png';
import { OutfitTypography } from 'styles/theme-outfit';

const TranscriptImage = styled.img.attrs({
  src: SignImg,
  alt: 'dock-health',
})`
  object-fit: contain;
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;
`;

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const TemplateAuthBaseSignUpContent = () => {
  return (
    <StyledGrid
      container
      justifyContent="center"
      alignItems="flex-start"
      direction="column"
    >
      <Grid item>
        <TranscriptImage />
      </Grid>
      <Grid>
        <Spacing vertical={5} />
        <OutfitTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          Bye bye Post-It Notes. <br />
        </OutfitTypography>
        <OutfitTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          Hello efficiency.
        </OutfitTypography>
        <Spacing vertical={3} />
        <div style={{ paddingLeft: '60px', paddingRight: '60px' }}>
          <OutfitTypography
            weight="light"
            variant="h5"
            color="rgba(0, 0, 0, 0.6)"
            align="center"
          >
            Save time, work better with HIPAA-compliant task management and
            workflow automation from Dock Health.
          </OutfitTypography>
        </div>
      </Grid>
    </StyledGrid>
  );
};

export default TemplateAuthBaseSignUpContent;
