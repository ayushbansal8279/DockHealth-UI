/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/no-nested-ternary */
import React, { useState, useRef, useMemo, useCallback } from 'react';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { OutfitTypography } from 'styles/theme-outfit';
import palette from 'styles/palette';
import { ROLE_OPTIONS, DOMAIN_OPTIONS } from '../options';
import { Option, QuestionContainer } from '../styled';
import OnboardingQuestionsPicker from '../OnboardingQuestionsPicker';

const OnboardingQuestionsGuest = ({
  roleOptions,
  setRoleOptions,
  domainOption,
  setDomainOption,
  clickNextStep,
  isDisabledButton,
}) => {
  const [activeOption, setActiveOption] = useState(null);

  const roleReference = useRef(null);
  const domainReference = useRef(null);

  const openPicker = (field) => setActiveOption(field);

  const questionReference = useMemo(() => {
    switch (activeOption) {
      case 'ROLE': {
        return roleReference;
      }

      case 'DOMAIN': {
        return domainReference;
      }

      default: {
        return null;
      }
    }
  }, [activeOption]);

  const getOptions = useCallback(() => {
    switch (activeOption) {
      case 'ROLE': {
        return ROLE_OPTIONS;
      }

      case 'DOMAIN': {
        return DOMAIN_OPTIONS;
      }

      default: {
        return [];
      }
    }
  }, [activeOption]);

  const getSelectedOptions = useCallback(() => {
    switch (activeOption) {
      case 'ROLE': {
        return roleOptions;
      }

      case 'DOMAIN': {
        return domainOption;
      }

      default: {
        return [];
      }
    }
  }, [activeOption, domainOption, roleOptions]);

  const onSelectOption = useMemo(() => {
    switch (activeOption) {
      case 'ROLE': {
        return (option) =>
          roleOptions.includes(option)
            ? setRoleOptions(roleOptions.filter((opt) => opt !== option))
            : setRoleOptions([...roleOptions, option]);
      }

      case 'DOMAIN': {
        return (option) => setDomainOption([option]);
      }

      default: {
        return null;
      }
    }
  }, [activeOption, roleOptions, setDomainOption, setRoleOptions]);

  const selectedOptions = getSelectedOptions();

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
      : ROLE_OPTIONS[0];

  const domainText = domainOption[0] || DOMAIN_OPTIONS[0];

  const closeOnSelect = activeOption === 'DOMAIN';

  return (
    <div>
      <OutfitTypography variant="h1" weight="700">
        <QuestionContainer>
          My domain of care is:{' '}
          <Option
            ref={domainReference}
            onClick={openDomainPicker}
            hasSelectedOption={domainOption.length > 0}
          >
            {domainText}
          </Option>
        </QuestionContainer>
        <Spacing vertical={5} />
        <QuestionContainer>
          My role is:{' '}
          <Option
            ref={roleReference}
            onClick={openRolePicker}
            hasSelectedOption={roleOptions.length > 0}
          >
            {roleText}
          </Option>
        </QuestionContainer>
      </OutfitTypography>
      <OnboardingQuestionsPicker
        isOpen={!!activeOption}
        questionReference={questionReference}
        onClose={onClosePicker}
        options={options}
        onSelect={onSelectOption}
        closeOnSelect={closeOnSelect}
        selectedOptions={selectedOptions}
        positionGlobal
        topOffset={65}
      />
      <Spacing vertical={5} />
      <Button
        uppercase={false}
        onClick={clickNextStep}
        type="button"
        disabled={isDisabledButton}
        width="265px"
        color={palette.brightOrange}
        secondaryColor={palette.oPlusRed}
        style={{ marginTop: '25px' }}
      >
        Continue
      </Button>
    </div>
  );
};

export default OnboardingQuestionsGuest;
