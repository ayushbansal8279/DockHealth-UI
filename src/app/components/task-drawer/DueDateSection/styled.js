/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';
import InputMask from 'react-input-mask';
import { fontWeights } from 'styles/font';

const FONT_FAMILY = '"Roboto Condensed", sans-serif';

export const DueDateLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey1};
  cursor: pointer;
  display: flex;
  padding: 0.5rem;

  ${({ isHovered }) =>
    isHovered &&
    `
      background-color: ${palette.coolGrey4};
  
      && > * {
        font-weight: bold;
      }
    `}
`;

export const DueTimeLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey1};
  font-size: 12px;
  padding-bottom: 12px;
  display: flex;
`;

export const DueTimeInputMaskContainer = styled.div`
  align-items: center;
  display: flex;
  border: 0.0625rem solid transparent;
  border-bottom-color: ${props =>
    props.hasError ? palette.error : palette.coolGrey1};
  border-radius: 0;
  height: 24px;
  padding-bottom: 12px;
`;

export const DueTimeErrorMessage = styled.span`
  color: ${palette.error};
  font-family: ${FONT_FAMILY};
  font-size: 12px;
`;

export const DueTimeInputMask = styled(
  React.forwardRef(
    ({ isOverDue, isEmpty, isFocus, ...otherProps }, reference) => (
      <InputMask ref={reference} {...otherProps} />
    ),
  ),
)`
  && {
    border: none;
    color: ${({ isOverDue }) =>
      isOverDue ? palette.oPlusRed : palette.mediumGrey};
    font-family: ${FONT_FAMILY};
    font-weight: bold;
    width: 90%;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }
`;

export const TimeOptionsContainer = styled.div`
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  font-family: 'Roboto Condensed', sans-serif;
`;

export const TimeOptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem;
  text-align: left;
  font-family: inherit;
  color: ${palette.coolGrey1};
  background-color: ${({ isActive }) =>
    isActive ? palette.coolGrey4 : 'transparent'};
  font-weight: ${({ isActive }) =>
    isActive ? fontWeights.bold : fontWeights.regular};

  ${({ isSelected }) => isSelected && `font-weight: ${fontWeights.bold};`}
`;
