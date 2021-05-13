/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const DateInputMask = styled(
  React.forwardRef(({ error, ...otherProps }, reference) => (
    <InputMask ref={reference} {...otherProps} />
  )),
)`
  && {
    width: 90px;
    height: 27px;
    margin: 0;
    padding: ${spacing.tiny} ${spacing.small};
    background-color: ${palette.blueGrey};
    border-radius: 4px;
    border: none;
    box-shadow: none;
    font-family: 'Roboto Condensed', sans-serif;
    color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
    text-align: center;

    &::placeholder {
      font-size: 15px;
      font-family: 'Roboto Condensed', sans-serif;
    }

    &:focus,
    &:active {
      outline: none;
      border: none;
      box-shadow: none;
      background-color: ${palette.blueGrey};
    }
  }
`;
