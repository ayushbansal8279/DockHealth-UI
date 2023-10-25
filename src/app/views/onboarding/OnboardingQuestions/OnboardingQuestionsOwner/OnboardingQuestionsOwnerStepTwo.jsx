/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/no-nested-ternary */
import React, { useState, useRef, useMemo, useCallback } from 'react';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { MontserratTypography } from 'styles/theme-montserrat';
import palette from 'styles/palette';
import OnboardingQuestionsPicker from '../OnboardingQuestionsPicker';
import { HEALTH_RECORD_OPTIONS, SOFTWARE_OPTIONS } from '../options';
import { Option, QuestionContainer, ButtonContainer } from '../styled';

const OnboardingQuestionsOwnerStepTwo = ({
  clickPreviousStep,
  healthRecordOptions,
  setHealthRecordOptions,
  softwareOptions,
  setSoftwareOptions,
  onSendAnswers,
  isDisabledButton,
}) => {
  const [activeOption, setActiveOption] = useState(null);

  const healthRecordReference = useRef(null);
  const softwareReference = useRef(null);

  const openPicker = (field) => setActiveOption(field);

  const questionReference = useMemo(() => {
    switch (activeOption) {
      case 'HEALTH_RECORD': {
        return healthRecordReference;
      }

      case 'SOFTWARE': {
        return softwareReference;
      }

      default: {
        return null;
      }
    }
  }, [activeOption]);

  const getOptions = useCallback(() => {
    switch (activeOption) {
      case 'HEALTH_RECORD': {
        return HEALTH_RECORD_OPTIONS;
      }

      case 'SOFTWARE': {
        return SOFTWARE_OPTIONS;
      }

      default: {
        return [];
      }
    }
  }, [activeOption]);

  const getSelectedOptions = useCallback(() => {
    switch (activeOption) {
      case 'HEALTH_RECORD': {
        return healthRecordOptions;
      }

      case 'SOFTWARE': {
        return softwareOptions;
      }

      default: {
        return [];
      }
    }
  }, [activeOption, healthRecordOptions, softwareOptions]);

  const selectedOptions = getSelectedOptions();

  const onSelectOption = useMemo(() => {
    switch (activeOption) {
      case 'HEALTH_RECORD': {
        return (option) =>
          healthRecordOptions.includes((opt) => opt === option)
            ? setHealthRecordOptions(
                healthRecordOptions.filter((opt) => opt !== option),
              )
            : setHealthRecordOptions([...healthRecordOptions, option]);
      }
      case 'SOFTWARE': {
        return (option) =>
          softwareOptions.includes(option)
            ? setSoftwareOptions(
                softwareOptions.filter((opt) => opt !== option),
              )
            : setSoftwareOptions([...softwareOptions, option]);
      }
      default: {
        return null;
      }
    }
  }, [
    activeOption,
    healthRecordOptions,
    setHealthRecordOptions,
    setSoftwareOptions,
    softwareOptions,
  ]);

  const options = useMemo(() => {
    const availableOptions = getOptions();

    if (selectedOptions.length === 0) return availableOptions;

    return [...new Set([...availableOptions, ...selectedOptions])];
  }, [getOptions, selectedOptions]);

  const openHealthRecordPicker = () => openPicker('HEALTH_RECORD');
  const openSoftwarePicker = () => openPicker('SOFTWARE');
  const onClosePicker = () => setActiveOption(null);

  const healthRecordText =
    healthRecordOptions.length > 0
      ? healthRecordOptions.length === 1
        ? healthRecordOptions[0]
        : healthRecordOptions.join(', ')
      : '(Epic, Cerner, SimplePractice…)';

  const softwareText =
    softwareOptions.length > 0
      ? softwareOptions.length === 1
        ? softwareOptions[0]
        : softwareOptions.join(', ')
      : '(Gmail, IntakeQ, RingCentral…)';

  return (
    <div>
      <QuestionContainer>
        <MontserratTypography variant="h2" weight={500}>
          We use{' '}
          <Option
            ref={healthRecordReference}
            onClick={openHealthRecordPicker}
            hasSelectedOption={healthRecordOptions.length > 0}
          >
            {healthRecordText}
          </Option>{' '}
          as our electronic health record and{' '}
          <Option
            ref={softwareReference}
            onClick={openSoftwarePicker}
            hasSelectedOption={softwareOptions.length > 0}
          >
            {softwareText}
          </Option>{' '}
          in the practice.
        </MontserratTypography>
      </QuestionContainer>
      <OnboardingQuestionsPicker
        isOpen={!!activeOption}
        questionReference={questionReference}
        onClose={onClosePicker}
        options={options}
        onSelect={onSelectOption}
        selectedOptions={selectedOptions}
      />
      <Spacing vertical={5} />
      <Spacing vertical={6} />
      <ButtonContainer>
        <Button
          onClick={clickPreviousStep}
          type="button"
          variant="secondary"
          width="265px"
        >
          Previous Step
        </Button>
        <Spacing horizontal={4} />
        <Button
          onClick={onSendAnswers}
          type="button"
          disabled={isDisabledButton}
          color={palette.brightOrange}
          secondaryColor={palette.oPlusRed}
          width="265px"
        >
          Next Step
        </Button>
      </ButtonContainer>
    </div>
  );
};

export default OnboardingQuestionsOwnerStepTwo;
