/* eslint-disable unicorn/no-nested-ternary */
import React, { useState, useRef, useMemo } from 'react';
import Spacing from 'components/common/Spacing';
import OnboardingQuestionsPicker from '../OnboardingQuestionsPicker';
import { ROLE_OPTIONS } from '../options';
import { Option, QuestionContainer, NextButton } from '../styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const OnboardingQuestionsOwnerGuest = ({
  organizationName,
  roleOptions,
  setRoleOptions,
  clickNextStep,
  isDisabledButton,
}) => {
  const [activeOption, setActiveOption] = useState(null);

  const roleReference = useRef(null);

  const openPicker = field => setActiveOption(field);

  const onSelectOption = option =>
    roleOptions.some(opt => opt === option)
      ? setRoleOptions(roleOptions.filter(opt => opt !== option))
      : setRoleOptions([...roleOptions, option]);

  const options = useMemo(() => {
    if (roleOptions.length === 0) return ROLE_OPTIONS;

    return [...new Set([...ROLE_OPTIONS, ...roleOptions])];
  }, [roleOptions]);

  const openRolePicker = () => openPicker('ROLE');
  const onClosePicker = () => setActiveOption(null);

  const roleText =
    roleOptions.length > 0
      ? roleOptions.length === 1
        ? roleOptions[0]
        : roleOptions.join(', ')
      : 'Clinician, Admin…';

  return (
    <div>
      <QuestionContainer>
        I’m a{' '}
        <Option
          ref={roleReference}
          onClick={openRolePicker}
          hasSelectedOption={roleOptions.length !== 0}
        >
          {roleText}
        </Option>{' '}
        working in {organizationName}.
      </QuestionContainer>
      <OnboardingQuestionsPicker
        isOpen={!!activeOption}
        questionReference={roleReference}
        onClose={onClosePicker}
        options={options}
        onSelect={onSelectOption}
        selectedOptions={roleOptions}
      />
      <Spacing vertical={5} />
      <Spacing vertical={6} />
      <NextButton
        type="button"
        onClick={clickNextStep}
        disabled={isDisabledButton}
      >
        Next Step
      </NextButton>
    </div>
  );
};

export default OnboardingQuestionsOwnerGuest;
