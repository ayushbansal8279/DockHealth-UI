// eslint-disable-next-line unicorn/filename-case
import React from 'react';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';
import { Box } from '@material-ui/core';
import palette from 'styles/palette';
import { SSOOptionsBar, SSOButton, GoogleLogoImage } from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const SSOOptions = () => {
  let ssoURLGoogle;
  if (
    process.env.SSO_LAUNCH_URL_GOOGLE &&
    process.env.SSO_LAUNCH_URL_GOOGLE.length > 5
  ) {
    ssoURLGoogle = process.env.SSO_LAUNCH_URL_GOOGLE;
  }

  return (
    <>
      {ssoURLGoogle && (
        <>
          <Spacing vertical={4} />
          <MontserratTypography variant="h4">
            Or sign in with
          </MontserratTypography>
          <Spacing vertical={2} />
          <SSOOptionsBar>
            <a href={ssoURLGoogle} target="_self">
              <Box
                mx={1}
                style={{ textAlign: 'center', color: palette.mediumGrey }}
              >
                <SSOButton>
                  <GoogleLogoImage />
                </SSOButton>
                <Spacing vertical={1} />
                <MontserratTypography variant="h5">Google</MontserratTypography>
              </Box>
            </a>
            <Box mx={1} />
          </SSOOptionsBar>
        </>
      )}
    </>
  );
};

export default SSOOptions;