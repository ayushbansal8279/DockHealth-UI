import React from 'react';
import styled from 'styled-components';
import {fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const AddPlaceholder = styled.div`
  color: ${palette.lightGrey};

  &::first-letter {
    color: ${palette.lightGrey};
    font-size: ${fontSizes.regular};
  }

  &:hover:first-letter {
    color: ${palette.brightBlue};
  }

  &:hover {
    div {
      color: ${palette.brightBlue};
    }
    color: ${palette.brightBlue};
  }
`;

export const StartDateWrapper = styled.div`
  width: fit-content;
  opacity: 0;
`;

export const StartDateContainer = styled.div`
width: 100%;
&:hover {
  & ${StartDateWrapper} {
    opacity: 1;
  }
`;
export const DueDateWrapper = styled.div`
  width: fit-content;
  opacity: 0;
`;

export const DueDatesContainer = styled.div`
width: 100%;
&:hover {
  & ${DueDateWrapper} {
    opacity: 1;
  }
`;
