/* eslint-disable no-unused-expressions */
import { DialogProps, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { range } from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import { onListsTutorialModalEvent } from 'helpers/ga-event-helper';
import {
  ChildrenContainer,
  DialogComponent,
  FooterContainer,
  HeaderContainer,
  NextButton,
  StepperContainer,
  StepperDot,
  TitleContainer,
} from './HelpfulTipsDialog.Styled';
import Spacing from './Spacing';

interface HelpfulTipsDialogProps extends DialogProps {
  children?: Array<{
    content: React.ReactNode;
    title?: string;
    description?: string;
  }>;
  closeDialog?: () => void;
}

const renderStepperDot = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => (stepIndex: number) => {
  return (
    <StepperDot
      key={stepIndex}
      active={stepIndex === currentStep}
      onClick={() => setCurrentStep(stepIndex)}
    />
  );
};

const HelpfulTipsDialog = ({
  children,
  open,
  closeDialog,
}: HelpfulTipsDialogProps) => {
  const [stepsCount, setStepsCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const { content, title, description } = children?.[currentStep] || {};

  useEffect(() => {
    setStepsCount(children?.length ?? 0);
    setCurrentStep(0);
  }, [children]);

  useEffect(() => {
    if (currentStep && children?.length > 0)
      onListsTutorialModalEvent(children?.[currentStep].title);
  }, [currentStep, children]);

  const isLastStep = currentStep + 1 === stepsCount;

  const setNextStep = useCallback(() => {
    if (isLastStep) {
      // eslint-disable-next-line no-unused-expressions
      closeDialog?.();
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [closeDialog, currentStep, isLastStep]);

  if (!Array.isArray(children)) {
    return null;
  }

  return (
    <DialogComponent open={open} fullWidth>
      <HeaderContainer>
        <IconButton size="small" disabled />
        <div style={{ height: '1.15rem' }}>&nbsp;</div>
        <IconButton
          size="small"
          color="inherit"
          edge="end"
          onClick={() => closeDialog?.()}
        >
          <Close />
        </IconButton>
      </HeaderContainer>
      <TitleContainer>
        {title && (
          <MontserratTypography weight="600" variant="h3">
            {title.toUpperCase()}
          </MontserratTypography>
        )}
        {description && (
          <>
            <Spacing vertical={3} />
            <RobotoTypography weight="600" variant="h4">
              {description}
            </RobotoTypography>
          </>
        )}
      </TitleContainer>
      <ChildrenContainer>{content}</ChildrenContainer>
      <StepperContainer>
        {range(0, stepsCount).map(
          renderStepperDot({ currentStep, setCurrentStep }),
        )}
      </StepperContainer>
      <FooterContainer>
        <NextButton
          variant="text"
          color="inherit"
          size="small"
          onClick={() => {
            closeDialog?.();
            onListsTutorialModalEvent('Skip tutorial button click');
          }}
        >
          <MontserratTypography weight="normal" variant="h4">
            SKIP TUTORIAL
          </MontserratTypography>
        </NextButton>
        <Spacing horizontal={3} />
        <NextButton
          variant="contained"
          color="primary"
          size="small"
          onClick={setNextStep}
        >
          <MontserratTypography weight="600" variant="h4">
            {isLastStep ? 'DONE' : 'NEXT'}
          </MontserratTypography>
        </NextButton>
      </FooterContainer>
    </DialogComponent>
  );
};

export default HelpfulTipsDialog;
