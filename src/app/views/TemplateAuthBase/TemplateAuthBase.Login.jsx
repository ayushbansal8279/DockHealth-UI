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

const TemplateAuthBaseLoginContent = () => {
  const [isUserInvited, setIsUserInvited] = useState(false);

  useEffect(() => {
    console.log('Hello');
    if (sessionStorage.getItem('isUserInvited')) setIsUserInvited(true);
  }, [setIsUserInvited]);

  return (
    <StyledGrid
      container
      justifyContent="center"
      alignItems="flex-start"
      direction="column"
    >
      <Grid item>
        {!isUserInvited ? <TranscriptImageSignUp /> : <TranscriptImage />}
        {/* <TranscriptImageSignUp /> */}
        <Spacing vertical={5} />
        <OutfitTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          {!isUserInvited
            ? 'Bye bye Post-It Notes.'
            : 'Collaboration built by healthcare professionals'}
          {/* Collaboration built by healthcare professionals */}
        </OutfitTypography>
        <OutfitTypography
          weight="bold"
          variant="h3"
          color="black"
          align="center"
        >
          {!isUserInvited
            ? 'Hello Efficiency'
            : 'for healthcare professionals.'}
        </OutfitTypography>
        <Spacing vertical={3} />
        <OutfitTypography
          weight="light"
          variant="h4"
          color="rgba(0, 0, 0, 0.6)"
          align="center"
        >
          {!isUserInvited
            ? 'Save time, work better with HIPAA-compliant task managment'
            : 'Make your communication contextual with the one'}
        </OutfitTypography>
        <OutfitTypography
          weight="light"
          variant="h4"
          color="rgba(0, 0, 0, 0.6)"
          align="center"
        >
          {!isUserInvited
            ? 'and workflow automation from Dock Health'
            : 'administrative tool you need to get healthcare done.'}
        </OutfitTypography>
      </Grid>
    </StyledGrid>
  );
};

export default TemplateAuthBaseLoginContent;
