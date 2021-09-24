/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import { IconButton } from '@material-ui/core';

export const StyledIconButton = withStyles({
  root: {
    border: `0.125rem dashed ${palette.coolGrey1}`,
    color: palette.brightBlue,
    fontSize: ({ size }) => (size * 30) / 54,
    fontWeight: '500',
    height: ({ size }) => size,
    lineHeight: 1,
    minHeight: ({ size }) => size,
    minWidth: ({ size }) => size,
    padding: 0,
    width: ({ size }) => size,
  },
})(({ size, ...props }) => <IconButton {...props} />);

export default StyledIconButton;
