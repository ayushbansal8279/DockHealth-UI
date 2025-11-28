import React from 'react';
import { ListItemText, Grid, Divider } from '@mui/material';
import Spacing from 'components/common/Spacing';
import {
  GoogleLogoImage,
  DrChronoLogoImage,
  AthenaHealthImage,
  StyledPaper,
} from './styled';
import { StyledHyperLink } from './AuthComponents.styled';

const drChronoLogin = () => {
  window.sessionStorage.setItem('iss', 'drchrono.com');
  window.location.href = `${
    import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
  }oidc/authorize?iss=client1-drchrono.com`;
};
const athenaLogin = () => {
  window.sessionStorage.setItem('iss', 'athenahealth');
  window.location.href = `${
    import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
  }oidc/authorize?iss=athenahealth`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const SSOOptions = () => {
  let ssoURLGoogle;
  if (
    import.meta.env.VITE_SSO_LAUNCH_URL_GOOGLE &&
    import.meta.env.VITE_SSO_LAUNCH_URL_GOOGLE.length > 5
  ) {
    ssoURLGoogle = import.meta.env.VITE_SSO_LAUNCH_URL_GOOGLE;
  }

  return (
    <>
      <Spacing vertical={4} />
      {/* <MontserratTypography variant="h4">Or sign in with</MontserratTypography> */}
      <Divider>Or sign in with</Divider>
      <Spacing vertical={4} />
      <Grid container columnSpacing={2}>
        {ssoURLGoogle && (
          <Grid item size={4}>
            <StyledPaper>
              <ListItemText>
                <Spacing vertical={2} />
                <GoogleLogoImage />
                <Spacing horizontal={3} />
                <StyledHyperLink href={ssoURLGoogle} target="_self">
                  Google
                </StyledHyperLink>
                <Spacing vertical={2} />
              </ListItemText>
            </StyledPaper>
          </Grid>
        )}

        <Grid item size={4}>
          <StyledPaper>
            <ListItemText>
              <Spacing vertical={2} />
              <Spacing horizontal={3} />
              <DrChronoLogoImage />
              <Spacing horizontal={3} />
              <StyledHyperLink onClick={drChronoLogin}>
                DrChrono
              </StyledHyperLink>
              <Spacing vertical={2} />
            </ListItemText>
          </StyledPaper>
        </Grid>
        <Grid item size={4}>
          <StyledPaper>
            <ListItemText>
              <Spacing vertical={2} />
              <AthenaHealthImage />
              <Spacing horizontal={1} />
              <StyledHyperLink onClick={athenaLogin}>
                athenahealth
              </StyledHyperLink>
              <Spacing horizontal={2} />
              <Spacing vertical={2} />
            </ListItemText>
          </StyledPaper>
        </Grid>
      </Grid>
    </>
  );
};

export default SSOOptions;
