import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendUserOnboardingAnswers } from 'actions/user-actions';
import OnboardingQuestionsMemberStepOne from './OnboardingQuestionsMemberStepOne';
import OnboardingQuestionsMemberStepTwo from './OnboardingQuestionsMemberStepTwo';

const OnboardingQuestionsMember = ({
  clickNextStep,
  clickPreviousStep,
  step,
  organizationName,
}) => {
  const history = useHistory();

  const [roleOptions, setRoleOptions] = useState([]);
  const [tutorialOption, setTutorialOption] = useState(null);

  const isDisabledFirstButton = roleOptions.length === 0;

  const isDisabledSecondButton = !tutorialOption;

  const onSendAnswers = () =>
    sendUserOnboardingAnswers({
      answers: {
        jobFunction: roleOptions.join(','),
        demoNeeded: tutorialOption,
      },
    }).then(() => {
      history.push('/core/home/my-tasks');
    });

  if (step === 2)
    return (
      <OnboardingQuestionsMemberStepTwo
        clickPreviousStep={clickPreviousStep}
        tutorialOption={tutorialOption}
        setTutorialOption={setTutorialOption}
        onSendAnswers={onSendAnswers}
        isDisabledButton={isDisabledSecondButton}
      />
    );

  return (
    <OnboardingQuestionsMemberStepOne
      clickNextStep={clickNextStep}
      roleOptions={roleOptions}
      setRoleOptions={setRoleOptions}
      organizationName={organizationName}
      isDisabledButton={isDisabledFirstButton}
    />
  );
};

export default OnboardingQuestionsMember;
