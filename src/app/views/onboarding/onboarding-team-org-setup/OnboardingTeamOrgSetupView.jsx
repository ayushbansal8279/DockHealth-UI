import React from 'react';
import {
  useMobile,
  useSmallScreen,
  useIOS,
} from '../../../helpers/utility-functions';
import {
  OnboardingH1Bold,
  OnboardingH3,
  OnboardingSmallScreenLogo,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingAnchor,
} from '../OnboardingTemplate.Components';
import OnboardingTeamOrgSetupViewDesktop from './OnboardingTeamOrgSetupView.Desktop';

const OnboardingTeamOrgSetupView = () => {
  const isMobile = useMobile();
  const isIOS = useIOS();
  const isSmallScreen = useSmallScreen();

  return isMobile ? (
    <>
      {isSmallScreen && <OnboardingSmallScreenLogo />}
      <OnboardingSpacing3 />
      <OnboardingH1Bold>YOU&apos;RE SIGNED UP</OnboardingH1Bold>
      <OnboardingSpacing4 />
      {isIOS ? (
        <OnboardingH3>
          <span>Please </span>
          <OnboardingAnchor
            href="https://apps.apple.com/us/app/dock-health/id1277060287"
            target="_blank"
          >
            download
          </OnboardingAnchor>
          <span> the iPhone app.</span>
        </OnboardingH3>
      ) : (
        <OnboardingH3>
          We noticed you’re not on an iPhone. Because most of our Providers use
          iPhones, we have an iPhone app or a desktop app.
        </OnboardingH3>
      )}
      <OnboardingSpacing4 />
      <OnboardingH3>
        To use Dock Health on a desktop, go to app.dock.health.
      </OnboardingH3>
    </>
  ) : (
    <OnboardingTeamOrgSetupViewDesktop />
  );
};

export default OnboardingTeamOrgSetupView;
