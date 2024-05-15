import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendUserOnboardingAnswers } from 'api/user-api';
import OnboardingQuestionsGuestStepOne from './OnboardingQuestionsGuestStepOne';
import OnboardingQuestionsGuestStepTwo from './OnboardingQuestionsGuestStepTwo';

const OnboardingQuestionsGuest = ({
  clickNextStep,
  clickPreviousStep,
  step,
}) => {
  const history = useHistory();

  const [roleOptions, setRoleOptions] = useState([]);
  const [tutorialOption, setTutorialOption] = useState(null);
  const [domainOption, setDomainOption] = useState([]);

  const isDisabledFirstButton =
    roleOptions.length === 0 || domainOption.length === 0;

  const isDisabledSecondButton = !tutorialOption;

  const onSendAnswers = () =>
    sendUserOnboardingAnswers({
      answers: {
        businessDomain: domainOption[0],
        jobFunction: roleOptions.join(','),
        demoNeeded: tutorialOption,
      },
    }).then(() => {
      history.push('/onboarding-tutorial/create-list');
    });

  // if (step === 2)
  //   return (
  //     <OnboardingQuestionsGuestStepTwo
  //       clickPreviousStep={clickPreviousStep}
  //       tutorialOption={tutorialOption}
  //       setTutorialOption={setTutorialOption}
  //       onSendAnswers={onSendAnswers}
  //       isDisabledButton={isDisabledSecondButton}
  //     />
  //   );

  return (
    <OnboardingQuestionsGuestStepOne
      clickNextStep={clickNextStep}
      roleOptions={roleOptions}
      setRoleOptions={setRoleOptions}
      domainOption={domainOption}
      setDomainOption={setDomainOption}
      isDisabledButton={isDisabledFirstButton}
    />
  );
};

export default OnboardingQuestionsGuest;
