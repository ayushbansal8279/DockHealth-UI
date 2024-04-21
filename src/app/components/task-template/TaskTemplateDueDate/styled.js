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
