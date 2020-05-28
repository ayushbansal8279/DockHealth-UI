import React, { useState } from 'react';
import ResultImage from 'img/empty-search-result';
import ResultImage1 from 'img/empty-search-result-1';
import ResultImage2 from 'img/empty-search-result-2';
import { MontserratTypography } from 'styles/theme-montserrat';
import { fontWeights } from 'styles/font';

import { EmptySearchResultContainer, EmptySearchResultImage } from './styled';

const resultImages = [ResultImage, ResultImage1, ResultImage2];

const EmptySearchResult = () => {
  const [resultImage] = useState(
    resultImages[Math.floor(Math.random() * resultImages.length)],
  );

  return (
    <EmptySearchResultContainer>
      <EmptySearchResultImage src={resultImage} alt="No results" />
      <MontserratTypography weight={fontWeights.regularPlus} variant="h3">
        No results were found for your search
      </MontserratTypography>
    </EmptySearchResultContainer>
  );
};

export default EmptySearchResult;
