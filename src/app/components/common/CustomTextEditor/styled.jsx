import styled from 'styled-components';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import palette, { typography } from 'styles/palette';
import { InputLabel } from '@mui/material';
import { fontSizes, fontWeights } from 'styles/font';

export const TextEditorFormStyleContainer = styled.div`
  background-color: #f7fafb !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0 0 5px 15px;
  color: #3D4858;
  font-size: 16px;
  min-height: 50px;
  position: relative;
  border-bottom: ${({ focused, hasError }) => {
    if (hasError) {
      return focused ? '' : '1px solid #e40909';
    }
  }};
  font-family: Outfit;
`;

export const TextEditorInputLabel = styled(
  ({ richTextEnabled, hasError, shouldShrinkLabel, ...props }) => (
    <InputLabel {...props} />
  ),
)`
  position: ${({ shouldShrinkLabel }) =>
    shouldShrinkLabel ? 'absolute' : 'relative'};
  top: ${({ shouldShrinkLabel }) => (shouldShrinkLabel ? '20px' : '0px')};
  left: ${({ shouldShrinkLabel }) => (shouldShrinkLabel ? '10px' : '0px')};
`;

export const DescriptionLabel = styled.label`
  display: block;
  font-family: inherit;
  font-size: ${({ shouldShrinkLabel }) =>
    shouldShrinkLabel ? '22px' : fontSizes.tiny};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-transform: none;

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

export const ErrorMessage = styled.div`
  color: ${palette.red};
  font-size: 12px;
  font-weight: ${fontWeights.light};
  margin-top: 4px;
  margin-bottom: 8px;
  font-family: inherit;
`;
