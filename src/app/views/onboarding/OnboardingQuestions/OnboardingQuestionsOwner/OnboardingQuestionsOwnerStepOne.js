/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/no-nested-ternary */
import React, { useState, useRef, useMemo, useCallback } from 'react';
import Spacing from 'components/common/Spacing.tsx';
import Button from 'components/common/Button/Button';
import OnboardingQuestionsPicker from '../OnboardingQuestionsPicker';
import { ROLE_OPTIONS, DOMAIN_OPTIONS } from '../options';
import { Option, QuestionContainer } from '../styled';

const OnboardingQuestionsOwnerStepOne = ({
  clickNextStep,
  roleOptions,
  setRoleOptions,
  domainOption,
  setDomainOption,
  isDisabledButton,
}) => {
  const [activeOption, setActiveOption] = useState(null);

  const roleReference = useRef(null);
  const domainReference = useRef(null);

  const openPicker = field => setActiveOption(field);

  const questionReference = useMemo(() => {
    switch (activeOption) {
      case 'ROLE':
        return roleReference;

      case 'DOMAIN':
        return domainReference;

      default:
        return null;
    }
  }, [activeOption]);

  const getOptions = useCallback(() => {
    switch (activeOption) {
      case 'ROLE':
        return ROLE_OPTIONS;

      case 'DOMAIN':
        return DOMAIN_OPTIONS;

      default:
        return [];
    }
  }, [activeOption]);

  const getSelectedOptions = useCallback(() => {
    switch (activeOption) {
      case 'ROLE':
        return roleOptions;

      case 'DOMAIN':
        return domainOption;

      default:
        return [];
    }
  }, [activeOption, domainOption, roleOptions]);

  const selectedOptions = getSelectedOptions();

  const onSelectOption = useMemo(() => {
    switch (activeOption) {
      case 'ROLE':
        return option =>
          roleOptions.some(opt => opt === option)
            ? setRoleOptions(roleOptions.filter(opt => opt !== option))
            : setRoleOptions([...roleOptions, option]);

      case 'DOMAIN':
        return option => setDomainOption([option]);

      default:
        return null;
    }
  }, [activeOption, roleOptions, setDomainOption, setRoleOptions]);

  const options = useMemo(() => {
    const availableOptions = getOptions();

    if (selectedOptions.length === 0) return availableOptions;

    return [...new Set([...availableOptions, ...selectedOptions])];
  }, [getOptions, selectedOptions]);

  const openRolePicker = () => openPicker('ROLE');
  const openDomainPicker = () => openPicker('DOMAIN');
  const onClosePicker = () => setActiveOption(null);

  const roleText =
    roleOptions.length > 0
      ? roleOptions.length === 1
        ? roleOptions[0]
        : roleOptions.join(', ')
      : 'Clinician, Admin…';

  const domainText = domainOption[0] || 'Mental Health, Internal Medicine…';

  const isSingleChoice = activeOption === 'DOMAIN';

  return (
    <div>
      <QuestionContainer>
        I&apos;m a{' '}
        <Option
          ref={roleReference}
          onClick={openRolePicker}
          hasSelectedOption={roleOptions.length !== 0}
        >
          {roleText}
        </Option>{' '}
        working in{' '}
        <Option
          ref={domainReference}
          onClick={openDomainPicker}
          hasSelectedOption={domainOption.length !== 0}
        >
          {domainText}
        </Option>
        .
      </QuestionContainer>
      <OnboardingQuestionsPicker
        isOpen={!!activeOption}
        questionReference={questionReference}
        onClose={onClosePicker}
        options={options}
        onSelect={onSelectOption}
        isSingleChoice={isSingleChoice}
        selectedOptions={selectedOptions}
        useGlobalPosition
        topOffset={65}
      />
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

export default OnboardingQuestionsOwnerStepOne;
