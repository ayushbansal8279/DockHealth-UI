/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import InputMask from 'react-input-mask';
import { fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

const FONT_FAMILY = '"Outfit", sans-serif';

export const TimeDropdownContainer = styled.div`
  position: relative;
`;

export const TimeLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey1};
  font-size: 12px;
  padding-bottom: 12px;
  display: flex;
`;

export const TimeInputMaskContainer = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  border: 0.0625rem solid transparent;
  border-bottom-color: ${(props) =>
    props.hasError ? palette.error : palette.coolGrey1};
  border-radius: 0;
  height: 24px;
  padding-bottom: 12px;

  ${({ type }) =>
    type === 'secondary' &&
    `
      height: auto;
      width: 92px;
      padding-bottom: 0;
      border: none;
      border-radius: 4px;
      background-color: ${palette.blueGrey};
    `}
`;

export const TimeErrorMessage = styled.span`
  color: ${palette.error};
  font-family: ${FONT_FAMILY};
  font-size: 12px;

  ${({ type }) =>
    type === 'secondary' &&
    `
    position: absolute;
    left: ${spacing.small};
    width: auto;
  `}
`;

export const TimeInputMask = styled(
  React.forwardRef(
    ({ error, type, isEmpty, isFocus, ...otherProps }, reference) => (
      <InputMask ref={reference} {...otherProps} />
    ),
  ),
)`
  && {
    width: 100%;
    border: none;
    color: ${({ error, value }) => {
      if (error) return palette.error;

      if (!value) return palette.coolGrey2;

      return palette.mediumGrey;
    }};
    font-family: ${FONT_FAMILY};
    font-weight: bold;
    background-color: transparent;

    ${({ type }) =>
      type === 'secondary' &&
      `
      height: 27px;
      font-weight: ${fontWeights.light};
      padding: ${spacing.tiny};
    `}

    &:focus {
      box-shadow: none;
      outline: none;
    }

    &:disabled {
      background-color: transparent;
      cursor: initial;
    }
  }
`;

export const TimeOptionsContainer = styled.div`
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  font-family: inherit;
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
`;

export const EndAdornmentContainer = styled.div`
  position: absolute;
  top: 60%;
  right: 9px;
  transform: translate(50%, -50%);
`;
