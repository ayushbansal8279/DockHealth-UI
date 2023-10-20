/* eslint-disable unicorn/no-nested-ternary */
import React, { useState, useRef, useMemo } from 'react';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { MontserratTypography } from 'styles/theme-montserrat';
import OnboardingQuestionsPicker from '../OnboardingQuestionsPicker';
import { ROLE_OPTIONS } from '../options';
import { Option, QuestionContainer } from '../styled';

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

  const openPicker = (field) => setActiveOption(field);

  const onSelectOption = (option) =>
    roleOptions.includes(option)
      ? setRoleOptions(roleOptions.filter((opt) => opt !== option))
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
      <MontserratTypography>
        <QuestionContainer>
          My domain of care is:
          <Option
            ref={roleReference}
            onClick={openRolePicker}
            hasSelectedOption={roleOptions.length > 0}
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
          positionGlobal
          topOffset={65}
        />
      </MontserratTypography>
      <Spacing vertical={5} />
      <Spacing vertical={6} />
      <Button
        onClick={clickNextStep}
        type="button"
        disabled={isDisabledButton}
        width="265px"
      >
        Next Step
      </Button>
    </div>
  );
};

export default OnboardingQuestionsOwnerGuest;
