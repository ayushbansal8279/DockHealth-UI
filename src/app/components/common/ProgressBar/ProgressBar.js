import React from 'react';
import Spacing from '../Spacing';
import {
  ProgressBarWrapper,
  ProgressBarLine,
  ProgressBarContainer,
  ProgressBarLabel,
} from './styled';

const ProgressBar = ({ progress, width = 180, label }) => (
  <ProgressBarContainer>
    <ProgressBarWrapper width={width}>
      <ProgressBarLine progress={progress} />
    </ProgressBarWrapper>

    {label && (
      <>
        <Spacing horizontal={3} />
        <ProgressBarLabel>{label}</ProgressBarLabel>
      </>
    )}
  </ProgressBarContainer>
);

export default ProgressBar;
