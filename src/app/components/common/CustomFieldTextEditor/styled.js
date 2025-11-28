import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const TextEditorFormStyleContainer = styled.div`
  border: ${({ focused }) =>
    focused ? '2px solid #0ca1c7' : '1px solid #e0e0e0'};
  border-radius: 10px;
  padding-left: ${({ focused }) => (focused ? '0' : '10px')};
  color: #3d4858;
  font-size: 16px;
  min-height: 50px;
  position: relative;
  border-bottom: ${({ focused, hasError }) =>
    hasError ? (focused ? '' : '1px solid #e40909') : ''};
  font-family: Outfit;
`;

export const TextEditorInputLabel = styled.div`
  position: ${({ shouldExpandLabel }) =>
    shouldExpandLabel ? 'absolute' : 'relative'};
  top: ${({ shouldExpandLabel }) => (shouldExpandLabel ? '10px' : '2px')};
  left: ${({ shouldExpandLabel }) => (shouldExpandLabel ? '10px' : '0px')};
  color: ${({ hasError }) => (hasError ? palette.oPlusRed : palette.coolGrey1)};
  transition: all 0.2s ease-in-out;
`;

export const DescriptionLabel = styled.label`
  display: block;
  font-family: inherit;
  font-size: ${({ shouldExpandLabel }) =>
    shouldExpandLabel ? fontSizes.regular : fontSizes.small};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-transform: none;
  margin-left: ${({ focused }) => (focused ? '10px' : '0')};
  margin-bottom: ${({ shouldExpandLabel }) =>
    shouldExpandLabel ? '0px' : '2px'};

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
