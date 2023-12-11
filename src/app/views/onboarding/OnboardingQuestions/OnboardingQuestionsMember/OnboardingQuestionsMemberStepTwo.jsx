import React from 'react';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { OutfitTypography } from 'styles/theme-outfit';
import palette from 'styles/palette';
import {
  Option,
  QuestionContainer,
  TutorialOptionsContainer,
  ButtonContainer,
} from '../styled';

const OnboardingQuestionsOwnerGuest = ({
  tutorialOption,
  setTutorialOption,
  onSendAnswers,
  clickPreviousStep,
  isDisabledButton,
}) => (
  <div>
    <QuestionContainer>
      <OutfitTypography variant="h2">
        I&apos;d like to learn more about how to optimize Dock with a 1:1 info
        session with the Dock team{' '}
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
      </OutfitTypography>
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
        width="265px"
        color={palette.brightOrange}
        secondaryColor={palette.oPlusRed}
      >
        Next Step
      </Button>
    </ButtonContainer>
  </div>
);

export default OnboardingQuestionsOwnerGuest;
