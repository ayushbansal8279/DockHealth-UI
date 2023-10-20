import { Grid } from '@mui/material';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToggle } from 'react-use';
import { acknowledgeEula } from 'actions/user-actions';
import Spacing from 'components/common/Spacing';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Button from 'components/common/Button/Button';
import { useSmallScreen } from 'helpers/utility-functions';
import { MontserratTypography } from 'styles/theme-montserrat';
import { downloadBAADocument } from 'api/organization-api';
import { userProfileSelector } from 'selectors/user-selectors';
import palette from 'styles/palette';
import { OnboardingAnchor } from '../OnboardingTemplate.Components';

const OnboardingEulaView = () => {
  const history = useHistory();
  const [isEulaAccepted, toggleEulaAccepted] = useToggle(false);

  const userProfile = useSelector(userProfileSelector);
  const [isBaaAccepted, toggleBaaAccepted] = useToggle(userProfile?.baaSigned);

  const continueButtonDisabled = !isEulaAccepted || !isBaaAccepted;

  const onAgreeClick = useCallback(() => {
    acknowledgeEula().then(() => {
      localStorage.setItem('STORAGE_NEW_USER_FIRST_TIME', true);
      history.push('/onboarding/questions');
    });
  }, [history]);

  const isSmallScreen = useSmallScreen();

  return (
    <div>
      <Spacing vertical={3} />
      <MontserratTypography weight="700" variant="h4">
        LET&apos;S GET STARTED
      </MontserratTypography>
      <Spacing vertical={5} />
      <MontserratTypography
        weight="500"
        variant="h3"
        textDecoration={{ lineHeight: 2 }}
      >
        Review our end user agreement and privacy policy <br /> and confirm your
        Business Associate Agreement
        <br />
        (BAA) for HIPAA-compliance.
      </MontserratTypography>
      <Spacing vertical={5} />
      <Grid container>
        <Grid item sm={12} container wrap="nowrap" alignItems="center">
          <Checkbox
            isChecked={isEulaAccepted}
            onClick={toggleEulaAccepted}
            size={25}
            isCircle
            borderHeight="4px"
          />
          <Spacing horizontal={3} />
          <MontserratTypography variant="h4" weight="500">
            <span>I have read and agree to the </span>
            <OnboardingAnchor
              href="https://www.dock.health/end-user-license-agreement"
              target="_blank"
            >
              End User License Agreement
            </OnboardingAnchor>
            <span> and </span>
            <OnboardingAnchor
              href="https://www.dock.health/privacy-statement"
              target="_blank"
            >
              Privacy Statement
            </OnboardingAnchor>
          </MontserratTypography>
        </Grid>
        <Spacing vertical={4} />
        {!userProfile?.baaSigned && (
          <Grid item sm={12} container wrap="nowrap" alignItems="center">
            <Checkbox
              isChecked={isBaaAccepted}
              onClick={toggleBaaAccepted}
              size={25}
              isCircle
              borderHeight="4px"
            />
            <Spacing horizontal={3} />
            <MontserratTypography variant="h4" weight="500">
              <span>I have read and agree to the </span>
              <OnboardingAnchor
                onClick={() => {
                  downloadBAADocument();
                }}
              >
                Business Associate Agreement (BAA)
              </OnboardingAnchor>
            </MontserratTypography>
          </Grid>
        )}
        <Spacing vertical={isSmallScreen ? 4 : 6} />
        <Grid item sm={12} container justifyContent="flex-left">
          <Grid item xs={12} sm={12} md={4}>
            <Button
              disabled={continueButtonDisabled}
              variant="primary"
              onClick={onAgreeClick}
              fullWidth
              color={palette.brightOrange}
              secondaryColor={palette.oPlusRed}
            >
              <MontserratTypography weight="700" variant="h4">
                Agree & Continue
              </MontserratTypography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default OnboardingEulaView;
