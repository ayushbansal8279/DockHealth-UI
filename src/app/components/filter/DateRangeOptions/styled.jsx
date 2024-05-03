/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { fontSizes } from 'styles/font';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

export const Container = styled.div`
  width: 100%;
  font-size: ${fontSizes.small};
`;

export const DateRangeInputsWrapper = styled.div`
  position: relative;
  width: 175px;
  display: flex;
  // margin-top: ${spacing.small};
  flex-direction: row;
`;

export const OptionLabel = styled.span`
  width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

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
  color: ${(props) => (props.hasError ? palette.red : palette.coolGrey2)};
  font-size: ${fontSizes.small};
`;
