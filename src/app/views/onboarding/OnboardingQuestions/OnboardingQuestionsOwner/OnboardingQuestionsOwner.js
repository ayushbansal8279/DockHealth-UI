import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sendUserOnboardingAnswers } from 'api/user-api';
import OnboardingQuestionsOwnerStepOne from './OnboardingQuestionsOwnerStepOne';
import OnboardingQuestionsOwnerStepTwo from './OnboardingQuestionsOwnerStepTwo';

const OnboardingQuestionsOwner = ({
  clickNextStep,
  clickPreviousStep,
  step,
}) => {
  const history = useHistory();

  const [roleOptions, setRoleOptions] = useState([]);
  const [domainOption, setDomainOption] = useState([]);
  const [healthRecordOptions, setHealthRecordOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);

  const isDisabledFirstButton =
    roleOptions.length === 0 || domainOption.length === 0;

  const isDisabledSecondButton =
    healthRecordOptions.length === 0 || softwareOptions.length === 0;

  const onSendAnswers = () =>
    sendUserOnboardingAnswers({
      answers: {
        businessDomain: domainOption[0],
        jobFunction: roleOptions.join(','),
        ehrUsed: healthRecordOptions.join(','),
        softwareUsed: softwareOptions.join(','),
      },
    }).then(() => {
      history.push('/onboarding/organization-setup');
    });

  if (step === 2)
    return (
      <OnboardingQuestionsOwnerStepTwo
        clickPreviousStep={clickPreviousStep}
        healthRecordOptions={healthRecordOptions}
        setHealthRecordOptions={setHealthRecordOptions}
        softwareOptions={softwareOptions}
        setSoftwareOptions={setSoftwareOptions}
        onSendAnswers={onSendAnswers}
        isDisabledButton={isDisabledSecondButton}
      />
    );

  return (
    <OnboardingQuestionsOwnerStepOne
      clickNextStep={clickNextStep}
      roleOptions={roleOptions}
      setRoleOptions={setRoleOptions}
      domainOption={domainOption}
      setDomainOption={setDomainOption}
      isDisabledButton={isDisabledFirstButton}
    />
  );
};

export default OnboardingQuestionsOwner;
