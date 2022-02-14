import styled from 'styled-components';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import palette from 'styles/palette';
import { InputLabel } from '@material-ui/core';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const TextEditorFormStyleContainer = styled.div`
  background-color: #f7fafb !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 10px;
  border-bottom: ${({ focused, hasError }) => {
    if (!hasError) {
      return focused ? '2px solid #0ca1c7' : '1px solid #8492a4';
    }
    return '2px solid #e40909';
  }};
`;

export const TextEditorInputLabel = styled(
  ({ richTextEnabled, hasError, ...props }) => <InputLabel {...props} />,
)`
  margin-bottom: ${({ richTextEnabled, focused }) =>
    richTextEnabled && focused ? '20px' : '0px'};
`;

export const DescriptionLabel = styled.label`
  display: block;
  margin-bottom: ${spacing.small};
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-transform: uppercase;

  & > span {
    text-transform: none;
  }
`;

export const CompletedByLabel = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
`;
