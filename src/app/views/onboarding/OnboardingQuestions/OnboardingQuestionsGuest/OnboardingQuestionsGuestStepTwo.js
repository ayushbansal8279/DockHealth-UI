/* eslint-disable unicorn/no-nested-ternary */
import React from 'react';
import Spacing from 'components/common/Spacing';
import {
  Option,
  QuestionContainer,
  TutorialOptionsContainer,
  ButtonContainer,
  PreviousButton,
  NextButton,
} from '../styled';

const OnboardingQuestionsGuest = ({
  tutorialOption,
  setTutorialOption,
  clickPreviousStep,
  onSendAnswers,
  isDisabledButton,
}) => (
  <div>
    <QuestionContainer>
      I’d like to learn more about how to optimize Dock with a 1:1 info session
      with the Dock team{' '}
      <TutorialOptionsContainer>
        <Option
          onClick={() => setTutorialOption('yes')}
          hasSelectedOption={tutorialOption === 'yes'}
        >
          Yes
        </Option>
        {' / '}
        <Option
          onClick={() => setTutorialOption('no')}
          hasSelectedOption={tutorialOption === 'no'}
        >
          No
        </Option>
      </TutorialOptionsContainer>
      .
    </QuestionContainer>
    <Spacing vertical={5} />
    {tutorialOption === 'yes' && (
      <iframe
        src="https://calendly.com/d/mw76-cdrg/30-min-dock-demo"
        title="calendly"
        width="100%"
        height="1200px"
      />
    )}
    <Spacing vertical={6} />
    <ButtonContainer>
      <PreviousButton type="button" onClick={clickPreviousStep}>
        Previous Step
      </PreviousButton>
      <Spacing horizontal={4} />
      <NextButton
        type="button"
        onClick={onSendAnswers}
        disabled={isDisabledButton}
      >
        Next Step
      </NextButton>
    </ButtonContainer>
  </div>
);

export default OnboardingQuestionsGuest;
