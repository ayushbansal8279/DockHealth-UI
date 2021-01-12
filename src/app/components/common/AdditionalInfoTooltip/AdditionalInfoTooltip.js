import React from 'react';
import QuestionMark from 'img/question-mark';
import UniversalTooltipContainer from '../UniversalTooltipContainer';

const AdditionalInfoTooltip = ({ description }) => (
  <UniversalTooltipContainer label={description}>
    <img src={QuestionMark} alt="tooltip" />
  </UniversalTooltipContainer>
);

export default AdditionalInfoTooltip;
