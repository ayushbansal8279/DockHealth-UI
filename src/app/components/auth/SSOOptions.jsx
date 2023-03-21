// eslint-disable-next-line unicorn/filename-case
import React, { useState, useRef } from 'react';
import { Box, ListItemText, Popover } from '@material-ui/core';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import SSOIcon from '@material-ui/icons/Security';
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
    process.env.SSO_LAUNCH_URL_GOOGLE &&
    process.env.SSO_LAUNCH_URL_GOOGLE.length > 5
  ) {
    ssoURLGoogle = process.env.SSO_LAUNCH_URL_GOOGLE;
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
      <MontserratTypography variant="h4">Or sign in with</MontserratTypography>
      <Spacing vertical={2} />
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
                <Spacing vertical={1} />
                <MontserratTypography variant="h4">Google</MontserratTypography>
              </Box>
            </a>
            <Box mx={1} />
          </>
        )}
        <StyledHyperLink>
          <Box
            mx={1}
            style={{ textAlign: 'center', color: palette.mediumGrey }}
          >
            <SSOButton
              ref={buttonReference}
              onClick={() => setOpen(!open)}
              tooltip="Select EMR for Single Sign On"
            >
              <SSOIcon style={{ width: '60px' }} />
            </SSOButton>
            <Spacing vertical={1} />
            <MontserratTypography variant="h4">SSO</MontserratTypography>
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
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Box mx={0.5} />
              <ListItemText>
                <DrChronoLogoImage />
                <Spacing horizontal={2} />
                <StyledHyperLink onClick={drChronoLogin}>
                  DrChrono
                </StyledHyperLink>
                <Spacing vertical={2} />
              </ListItemText>
            </Box>
            <Spacer />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Box mx={0.5} />
              <ListItemText>
                <AthenaHealthImage />
                <Spacing horizontal={2} />
                <StyledHyperLink onClick={athenaLogin}>
                  Athenahealth
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
