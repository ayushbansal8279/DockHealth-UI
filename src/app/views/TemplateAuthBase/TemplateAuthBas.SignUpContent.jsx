import { Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Spacing from 'components/common/Spacing';
import LoginImg from 'img/login.png';
import SignImg from 'img/signup.png';
import { OutfitTypography } from 'styles/theme-outfit';

const TranscriptImage = styled.img.attrs({
  src: LoginImg,
  alt: 'dock-health',
})`
  object-fit: contain;
`;

const TranscriptImageSignUp = styled.img.attrs({
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
  const [isUserInvited, setIsUserInvited] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('isUserInvited')) setIsUserInvited(true);
  }, [setIsUserInvited]);

  return (
    <StyledGrid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        {isUserInvited ? <TranscriptImage /> : <TranscriptImageSignUp />}
      </Grid>
      <Grid>
        <Spacing vertical={5} />
        <OutfitTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          {isUserInvited
            ? 'Collaboration built by healthcare professionals'
            : 'Bye bye Post-It Notes.'}
          <br />
        </OutfitTypography>
        <OutfitTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          {isUserInvited ? 'for healthcare professionals.' : 'Hello Efficiency'}
        </OutfitTypography>
        <Spacing vertical={3} />
        <div style={{ paddingLeft: '60px', paddingRight: '60px' }}>
          <OutfitTypography
            weight="light"
            variant="h5"
            color="rgba(0, 0, 0, 0.6)"
            align="center"
          >
            {isUserInvited
              ? 'Make your communication contextual with the one'
              : 'Save time, work better with HIPAA-compliant task managment'}
          </OutfitTypography>
          <OutfitTypography
            weight="light"
            variant="h4"
            color="rgba(0, 0, 0, 0.6)"
            align="center"
          >
            {isUserInvited
              ? 'administrative tool you need to get healthcare done.'
              : 'and workflow automation from Dock Health'}
          </OutfitTypography>
        </div>
      </Grid>
    </StyledGrid>
  );
};

export default TemplateAuthBaseSignUpContent;
