import React from 'react';
import { IndicatorContainer, IndicatorBar } from './styled';

const OnboardingIndicator = ({ steps, completedSteps }) => {
  const stepsArray = Array.from({ length: steps }, (_, i) => i + 1);
  return (
    <IndicatorContainer>
      {stepsArray.map((step) => (
        <IndicatorBar
          steps={steps}
          step={step}
          completedSteps={completedSteps}
        />
      ))}
    </IndicatorContainer>
  );
};

export default OnboardingIndicator;
