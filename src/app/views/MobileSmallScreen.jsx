import React from 'react';
import { useMobile, useSmallScreen, useIOS } from 'helpers/utility-functions';
import {
  OnboardingH3,
  OnboardingSmallScreenLogo,
  OnboardingSpacing4,
  OnboardingAnchor,
} from 'views/onboarding/OnboardingTemplate.Components';

const MobileSmallScreen = () => {
  const isMobile = useMobile();
  const isIOS = useIOS();
  const isSmallScreen = useSmallScreen();

  return (
    isMobile && (
      <>
        {isSmallScreen && <OnboardingSmallScreenLogo />}
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
            We noticed you’re not on an iPhone. Because most of our Providers
            use iPhones, we have an iPhone app or a desktop app.
          </OnboardingH3>
        )}
        <OnboardingSpacing4 />
        <OnboardingH3>
          To use Dock Health on a desktop, go to app.dock.health.
        </OnboardingH3>
      </>
    )
  );
};

export default MobileSmallScreen;
