/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';

export const DateInput = styled(({ hasError, ...props }) => (
  <InputMask {...props} />
))`
  display: block;
  width: 100%;
  padding: 0 6px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.hasError ? palette.red : palette.coolGrey2};
  border-radius: 2px;
  overflow: auto;
  color: ${palette.coolGrey2};
  font-size: ${fontSizes.small};
  height: 25px;

  ${({ value }) => value && `color: ${palette.mediumGrey};`}

  ${({ hasError }) => hasError && `color: ${palette.red};`}
`;
