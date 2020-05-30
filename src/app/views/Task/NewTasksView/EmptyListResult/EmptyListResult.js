import React from 'react';
import { MontserratTypography } from 'styles/theme-montserrat';
import { fontWeights } from 'styles/font';

import { EmptySearchResultContainer, EmptySearchResultImage } from './styled';

const EmptyListResult = ({ imageSrc, text }) => {
  return (
    <EmptySearchResultContainer>
      <EmptySearchResultImage src={imageSrc} alt="No results" />
      <MontserratTypography weight={fontWeights.regularPlus} variant="h3">
        {text}
      </MontserratTypography>
    </EmptySearchResultContainer>
  );
};

export default EmptyListResult;
