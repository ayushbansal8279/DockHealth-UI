import React, { useState } from 'react';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import Spacing from 'components/common/Spacing';
import OnboardingIndicator from 'components/common/OnboardingIndicator/OnboardingIndicator';
import { OutfitTypography } from 'styles/theme-outfit';
import OnboardingQuestionsOwner from './OnboardingQuestionsOwner/OnboardingQuestionsOwner';
import OnboardingQuestionsMember from './OnboardingQuestionsMember/OnboardingQuestionsMember';
import OnboardingQuestionsGuest from './OnboardingQuestionsGuest/OnboardingQuestionsGuest';

const ONBOARDING_TITLE =
  'Select a few quick customizations for a better experience.';

const OnboardingQuestions = () => {
  const { orgUserRole, organizationName } = useSelector(userProfileSelector);
  const [step, setStep] = useState(1);

  const clickNextStep = () => setStep(step + 1);
  const clickPreviousStep = () => setStep(step - 1);

  return (
    <div>
      <OnboardingIndicator
        steps={orgUserRole === 'OWNER' ? 5 : 1}
        completedSteps={step}
      />
      <Spacing vertical={5} />
      <OutfitTypography variant="h3" weight="700">
        {ONBOARDING_TITLE}
      </OutfitTypography>
      <Spacing vertical={5} />
      {orgUserRole === 'OWNER' && (
        <OnboardingQuestionsOwner
          clickNextStep={clickNextStep}
          clickPreviousStep={clickPreviousStep}
          step={step}
        />
      )}
      {orgUserRole === 'MEMBER' && (
        <OnboardingQuestionsMember
          organizationName={organizationName}
          clickNextStep={clickNextStep}
          clickPreviousStep={clickPreviousStep}
          step={step}
        />
      )}
      {(orgUserRole === 'GUEST' || !orgUserRole) && (
        <OnboardingQuestionsGuest
          organizationName={organizationName}
          clickNextStep={clickNextStep}
          clickPreviousStep={clickPreviousStep}
          step={step}
        />
      )}
    </div>
  );
};

export default OnboardingQuestions;
