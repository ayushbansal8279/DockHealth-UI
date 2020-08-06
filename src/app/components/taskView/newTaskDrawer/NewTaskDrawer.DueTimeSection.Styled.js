/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import InputMask from 'react-input-mask';
import styled from 'styled-components';
import palette from 'styles/palette';

const FONT_FAMILY = '"Roboto Condensed", sans-serif';

export const DueTimeLabelContainer = styled.div`
  align-items: center;
  color: ${palette.coolGrey2};
  font-size: 12px;
  padding-bottom: 12px;
  display: flex;
`;

export const DueTimeInputMaskContainer = styled.div`
  align-items: center;
  display: flex;
  border: 0.0625rem solid transparent;
  border-bottom-color: ${props =>
    props.hasError ? palette.error : palette.coolGrey2};
  border-radius: 0;
  height: 24px;
  padding-bottom: 12px;
`;

export const DueTimeErrorMessage = styled.span`
  color: ${palette.error};
  font-family: ${FONT_FAMILY};
  font-size: 12px;
`;

export const DueTimeInputMask = styled(({ isOverDue, ...otherProps }) => (
  <InputMask {...otherProps} />
))`
  && {
    border: none;
    color: ${({ isOverDue }) => (isOverDue ? 'red' : palette.mediumGrey)};
    font-family: ${FONT_FAMILY};
    font-weight: bold;
    width: 90%;

    &:focus {
      box-shadow: none;
      outline: none;
    }
  }
`;
