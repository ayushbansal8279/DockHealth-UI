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
import { OutfitTypography } from 'styles/theme-outfit';
import { downloadBAADocument } from 'api/organization-api';
import { userProfileSelector } from 'selectors/user-selectors';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import palette from 'styles/palette';
import { CircleIcon } from './styled';
import { OnboardingAnchor } from '../OnboardingTemplate.Components';

const OnboardingEulaView = () => {
  const history = useHistory();
  const [isEulaAccepted, toggleEulaAccepted] = useToggle(false);

  const userProfile = useSelector(userProfileSelector);
  const [isBaaAccepted, toggleBaaAccepted] = useToggle(userProfile?.baaSigned);

  const continueButtonDisabled = !isEulaAccepted || !isBaaAccepted;

  const organizationName = JSON.parse(sessionStorage.getItem('authUser'))
    .attributes['custom:organization_name'];

  const onAgreeClick = useCallback(() => {
    acknowledgeEula().then(() => {
      localStorage.setItem('STORAGE_NEW_USER_FIRST_TIME', true);
      if (organizationName !== undefined) {
        history.push('/onboarding-tutorial/create-list');
      } else {
        history.push('/onboarding/organization-setup');
      }
    });
  }, [history]);

  const isSmallScreen = useSmallScreen();

  return (
    <div>
      <Spacing vertical={3} />
      <OutfitTypography weight="700" variant="h3">
        Welcome to Dock! Let's make it official.
      </OutfitTypography>
      <Spacing vertical={5} />
      <OutfitTypography
        weight="500"
        variant="h2"
        textDecoration={{ lineHeight: 1.5 }}
      >
        Review our end user agreement and privacy policy <br />
        {userProfile?.baaSigned
          ? null
          : 'and confirm your Business Associate Agreement'}
        <br />
        {userProfile?.baaSigned ? null : '(BAA) for HIPAA-compliance'}
      </OutfitTypography>
      {userProfile?.baaSigned ? (
        <Spacing vertical={1} />
      ) : (
        <Spacing vertical={5} />
      )}
      <Grid container>
        <Grid item sm={12} container wrap="nowrap" alignItems="center">
          <CircleIcon
            src={isEulaAccepted ? CircleCompleted : Circle}
            onClick={toggleEulaAccepted}
          />
          <Spacing horizontal={3} />
          <OutfitTypography variant="h4" weight="500">
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
          </OutfitTypography>
        </Grid>
        <Spacing vertical={4} />
        {!userProfile?.baaSigned && (
          <Grid item sm={12} container wrap="nowrap" alignItems="center">
            <CircleIcon
              src={isBaaAccepted ? CircleCompleted : Circle}
              onClick={toggleBaaAccepted}
            />
            <Spacing horizontal={3} />
            <OutfitTypography variant="h4" weight="500">
              <span>I have read and agree to the </span>
              <OnboardingAnchor
                onClick={() => {
                  downloadBAADocument();
                }}
              >
                Business Associate Agreement (BAA)
              </OnboardingAnchor>
            </OutfitTypography>
          </Grid>
        )}
        <Spacing vertical={isSmallScreen ? 4 : 6} />
        <Grid item sm={12} container justifyContent="flex-left">
          <Grid item xs={12} sm={12} md={4}>
            <Button
              uppercase={false}
              disabled={continueButtonDisabled}
              variant="primary"
              onClick={onAgreeClick}
              fullWidth
              color={palette.brightOrange}
              secondaryColor={palette.oPlusRed}
            >
              <OutfitTypography weight="700" variant="h4">
                Agree & Continue
              </OutfitTypography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default OnboardingEulaView;
