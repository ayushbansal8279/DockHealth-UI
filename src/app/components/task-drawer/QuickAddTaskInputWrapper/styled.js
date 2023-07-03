import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const AddSubtaskInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  margin-top: ${spacing.small};
  margin-bottom: ${spacing.small};
  padding: ${spacing.small} ${spacing.regular} ${spacing.none} ${spacing.regular};
  font-size: ${fontSizes.smallPlus};
  background-color: ${palette.white};
  text-align: left;
  border: 1px solid;
  border-color: ${palette.coolGrey3};

  @media print {
    display: none;
  }

  &:before {
    position: absolute;
    top: 50%;
    left: 0;
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.brightBlue};
    font-size: ${fontSizes.regular};
    padding-left: ${spacing.tiny};
  }

  ${({ isFocused, hasError }) =>
    isFocused &&
    `border-color: ${hasError ? palette.red : palette.coolGrey3};
  
    &:before {
      visibility: hidden;
    }`}

  &:after {
    position: absolute;
    top: 50%;
    left: ${spacing.regular};
    content: '${({ placeholder }) => placeholder}';
    display: block;
    transform: translateY(-50%);
    color: ${palette.coolGrey1};
    font-family: 'Montserrat', sans-serif;
    font-weight: ${fontWeights.bold};
    font-size: ${fontSizes.smallPlus};
    text-transform: uppercase;
    pointer-events: none;
  }

  ${({ hidePlaceholder }) =>
    hidePlaceholder &&
    `
    &:after {
      visibility: hidden;
      `}

  ${({ isFocused }) =>
    isFocused &&
    `
        &:after {
      visibility: hidden;
   `}
`;

export const QuickAddHint = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.smallPlus};
  white-space: nowrap;
`;

export const ErrorLabel = styled.div`
  color: ${palette.red};
  font-size: ${fontSizes.smallPlus};
`;
