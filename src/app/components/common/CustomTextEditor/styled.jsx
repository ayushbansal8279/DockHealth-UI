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
  padding-top: 5px;
  padding-left: 20px;
  color: #3D4858;
  font-size: 16px;
  border-bottom: ${({ focused, hasError }) => {
    if (hasError) {
      return focused ? '' : '1px solid #e40909';
    }
  }};
  font-family: Outfit;
`;

export const TextEditorInputLabel = styled(
  ({ richTextEnabled, hasError, ...props }) => <InputLabel {...props} />,
)``;

export const DescriptionLabel = styled.label`
  display: block;
  font-family: inherit;
  font-size: ${fontSizes.tinyPlus};
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
