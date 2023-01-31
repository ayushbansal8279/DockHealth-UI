/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import palette from 'styles/palette';
import { IconButton } from '@mui/material';
import styled from 'styled-components';

const InnerIconButton = ({ size, ...props }) => <IconButton {...props} />;

export const StyledIconButton = styled(InnerIconButton)`
  &&& {
    &.MuiIconButton-root {
      border: 0.125rem dashed ${palette.coolGrey1};
      color: ${palette.brightBlue};
      font-size: ${({ size }) => (size * 30) / 54};
      font-weight: 500;
      height: ${({ size }) => size};
      line-height: 1;
      min-height: ${({ size }) => size};
      min-width: ${({ size }) => size};
      padding: 0;
      width: ${({ size }) => size};
    }
  }
`;

export default StyledIconButton;
