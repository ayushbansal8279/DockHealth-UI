import React from 'react';
import styled from 'styled-components';
import { FormControl, InputBase, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import palette, { opacify } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const ErrorLabel = styled.h4`
  color: ${palette.error};
  font-size: 0.75rem;
  padding-left: ${spacing.regularPlus};
  margin: 0;
  margin-bottom: ${spacing.small};
  user-select: none;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regularPlus};
`;

export const UniversalFormControl = withStyles({
  root: {
    backgroundColor: palette.coolGrey4,
    height: 75,
    transition: 'all 0.2s ease-out',
  },
  whiteBackground: {
    backgroundColor: palette.white,
  },
})(({ classes, whiteBackground, error, ...props }) => {
  const className = clsx(
    classes.root,
    error && classes.error,
    whiteBackground && classes.whiteBackground,
  );
  return <FormControl className={className} {...props} />;
});

export const UniversalInputLabel = withStyles({
  root: {
    pointerEvents: 'none',
    top: '50%',
    transform: 'translate(20px, -50%) scale(1)',
    transition: 'all 200ms ease',
    color: palette.mediumGrey,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: fontSizes.regular,
    fontWeight: fontWeights.regular,
    zIndex: 2,
  },
  shrink: {
    top: '10%',
    transform: 'translate(22px, 0.375rem) scale(1)',
    transformOrigin: 'center left',
    transition: 'all 200ms ease',
    color: palette.coolGrey1,
    fontSize: fontSizes.small,
  },
  focused: {
    color: `${palette.coolGrey1} !important`,
  },
  error: {
    color: `${palette.error} !important`,
    '& > span': {
      color: palette.error,
    },
  },
})(InputLabel);

export const UniversalInputBase = withStyles({
  root: {
    height: '100%',
    transition: 'all 0.2s ease-out',
    zIndex: 1,
  },
  input: {
    borderRadius: 0,
    boxShadow: 'none',
    paddingBottom: 0,
    marginTop: spacing.small,
    marginLeft: 22,
    marginRight: 22,
    fontFamily: "'Roboto Condensed', sans-serif",
    '&:focus': {
      backgroundColor: opacify(palette.lightGrey, 0),
      border: 0,
      boxShadow: 'none',
    },
    '&[readonly], &[disabled]': {
      backgroundColor: opacify(palette.lightGrey, 0),
      cursor: 'pointer',
    },
  },
})(InputBase);
