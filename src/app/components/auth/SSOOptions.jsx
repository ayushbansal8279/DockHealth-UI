// eslint-disable-next-line unicorn/filename-case
import React, { useState, useRef } from 'react';
import { Box, ListItemText, Popover, Divider } from '@mui/material';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import SSOIcon from '@mui/icons-material/Security';
import {
  SSOOptionsBar,
  SSOButton,
  GoogleLogoImage,
  PopoverContainer,
  Spacer,
  DrChronoLogoImage,
  AthenaHealthImage,
} from './styled';
import { StyledHyperLink } from './AuthComponents.styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const SSOOptions = () => {
  let ssoURLGoogle;
  if (
    import.meta.env.VITE_SSO_LAUNCH_URL_GOOGLE &&
    import.meta.env.VITE_SSO_LAUNCH_URL_GOOGLE.length > 5
  ) {
    ssoURLGoogle = import.meta.env.VITE_SSO_LAUNCH_URL_GOOGLE;
  }

  const drChronoLogin = () => {
    window.sessionStorage.setItem('iss', 'drchrono.com');
    window.location.href = `${process.env.HEYDOC_SERVICES_BASE_URL}oidc/authorize?iss=client1-drchrono.com`;
  };
  const athenaLogin = () => {
    window.sessionStorage.setItem('iss', 'athenahealth');
    window.location.href = `${process.env.HEYDOC_SERVICES_BASE_URL}oidc/authorize?iss=athenahealth`;
  };
  const buttonReference = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Spacing vertical={4} />
      {/* <MontserratTypography variant="h4">Or sign in with</MontserratTypography> */}
      <Divider>Or</Divider>
      <Spacing vertical={3} />
      <SSOOptionsBar>
        {ssoURLGoogle && (
          <>
            <a href={ssoURLGoogle} target="_self">
              <Box
                mx={1}
                style={{ textAlign: 'center', color: palette.mediumGrey }}
              >
                <SSOButton>
                  <GoogleLogoImage />
                </SSOButton>
                <Spacing vertical={2} />
                <MontserratTypography variant="h4" weight="400">
                  Google
                </MontserratTypography>
              </Box>
            </a>
            <Box mx={1} />
          </>
        )}
        <StyledHyperLink>
          <Box
            mx={1}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: palette.mediumGrey,
            }}
          >
            <SSOButton
              ref={buttonReference}
              onClick={() => setOpen(!open)}
              tooltip="Select EMR for Single Sign On"
            >
              <SSOIcon style={{ width: '60px' }} />
            </SSOButton>
            <Spacing vertical={2} />
            <MontserratTypography variant="h4" weight="400">
              SSO
            </MontserratTypography>
          </Box>
        </StyledHyperLink>
        <Box mx={1} />
        <Box mx={1} />
        <Popover
          anchorEl={buttonReference?.current}
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <PopoverContainer>
            <Box display="flex" justifyContent="space-between">
              <Box mx={0.5} />
              <ListItemText>
                <Spacing vertical={2} />
                <DrChronoLogoImage />
                <Spacing horizontal={3} />
                <StyledHyperLink onClick={drChronoLogin}>
                  DrChrono
                </StyledHyperLink>
                <Spacing vertical={2} />
              </ListItemText>
            </Box>
            <Spacer />
            <Box display="flex" justifyContent="space-between">
              <Box mx={0.5} />
              <ListItemText>
                <Spacing vertical={2} />
                <AthenaHealthImage />
                <Spacing horizontal={3} />
                <StyledHyperLink onClick={athenaLogin}>
                  athenahealth
                </StyledHyperLink>
                <Spacing vertical={2} />
              </ListItemText>
            </Box>
          </PopoverContainer>
        </Popover>
      </SSOOptionsBar>
    </>
  );
};

export default SSOOptions;
