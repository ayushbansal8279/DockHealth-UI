import { Grid } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToggle } from 'react-use';
import { acknowledgeEula } from 'actions/user-actions';
import Spacing from 'components/common/Spacing';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Button from 'components/common/Button/Button';
import { useSmallScreen } from 'helpers/utility-functions';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import { downloadBAADocument } from 'api/organization-api';
import { OnboardingAnchor } from '../OnboardingTemplate.Components';

const OnboardingEulaView = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isEulaAccepted, toggleEulaAccepted] = useToggle(false);

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });
  const [isBaaAccepted, toggleBaaAccepted] = useToggle(userProfile?.baaSigned);

  const continueButtonDisabled = !isEulaAccepted || !isBaaAccepted;

  const onAgreeClick = useCallback(() => {
    acknowledgeEula()(dispatch).then(() => {
      localStorage.setItem('STORAGE_NEW_USER_FIRST_TIME', true);
      history.push('/onboarding/questions');
    });
  }, [dispatch, history]);

  const isSmallScreen = useSmallScreen();

  return (
    <div>
      <Spacing vertical={3} />
      <MontserratTypography weight="600" variant="h2">
        LET&apos;S GET STARTED
      </MontserratTypography>
      <Spacing vertical={5} />
      <MontserratTypography variant="h3">
        Securing patient data, being HIPAA compliant, and getting your team
        ready to work better. Sounds like the start of a great relationship.
      </MontserratTypography>
      <Spacing vertical={5} />
      <MontserratTypography variant="h4">
        To get you and your team set up to be HIPAA complaint, please agree to
        the terms below..
      </MontserratTypography>
      <Spacing vertical={5} />
      <Grid container>
        <Grid item sm={12} container wrap="nowrap" alignItems="center">
          <Checkbox
            isChecked={isEulaAccepted}
            onClick={toggleEulaAccepted}
            size={20}
          />
          <Spacing horizontal={3} />
          <RobotoTypography variant="h4">
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
          </RobotoTypography>
        </Grid>
        <Spacing vertical={4} />
        {!userProfile?.baaSigned && (
          <Grid item sm={12} container wrap="nowrap" alignItems="center">
            <Checkbox
              isChecked={isBaaAccepted}
              onClick={toggleBaaAccepted}
              size={20}
            />
            <Spacing horizontal={3} />
            <RobotoTypography variant="h4">
              <span>I have read and agree to the </span>
              <OnboardingAnchor
                onClick={() => {
                  downloadBAADocument();
                }}
              >
                Business Associate Agreement (BAA)
              </OnboardingAnchor>
            </RobotoTypography>
          </Grid>
        )}
        <Spacing vertical={isSmallScreen ? 4 : 6} />
        <Grid item sm={12} container justify="flex-end">
          <Grid item xs={12} sm={12} md={4}>
            <Button
              disabled={continueButtonDisabled}
              variant="primary"
              onClick={onAgreeClick}
              fullWidth
            >
              Agree & Continue
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default OnboardingEulaView;
