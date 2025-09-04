import styled from 'styled-components';
import React from 'react';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const TextEditorFormStyleContainer = styled.div`
  background-color: #f7fafb !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0 0 5px 15px;
  color: #3d4858;
  font-size: 16px;
  min-height: 50px;
  position: relative;
  border-bottom: ${({ focused, hasError }) => 
    hasError ? (focused ? '' : '1px solid #e40909') : ''
  };
  font-family: Outfit;
`;

export const TextEditorInputLabel = styled.div`
  position: ${({ shouldExpandLabel }) => shouldExpandLabel ? 'absolute' : 'relative'};
  top: ${({ shouldExpandLabel }) => shouldExpandLabel ? '10px' : '2px'};
  left: ${({ shouldExpandLabel }) => shouldExpandLabel ? '10px' : '0px'};
  color: ${({ hasError }) => hasError ? palette.oPlusRed : palette.coolGrey1};
  transition: all 0.2s ease-in-out;
`;

export const DescriptionLabel = styled.label`
  display: block;
  font-family: inherit;
  font-size: ${({ shouldExpandLabel }) => shouldExpandLabel ? fontSizes.regular : fontSizes.tinyPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-transform: none;
  margin-bottom: ${({ shouldExpandLabel }) => shouldExpandLabel ? '0px' : '2px'};

  & > span {
    text-transform: none;
    color: inherit;
  }
`;

export const ErrorMessage = styled.div`
  color: ${palette.red};
  font-size: 12px;
  font-weight: ${fontWeights.light};
  margin-top: 4px;
  margin-bottom: 8px;
  font-family: inherit;
`;
