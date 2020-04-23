import { Typography } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { memoizeWith } from 'ramda';
import palette from './palette';
import themeCommonOverrides from './theme-components';

const themeFactory = memoizeWith(
  ({ fontWeight, fontFamily }) => `${fontWeight}${fontFamily}`,
  ({ fontWeight, fontFamily }) =>
    createMuiTheme({
      palette: {
        primary: {
          main: palette.lighterCyanBlue,
        },
        secondary: {
          main: palette.coolGrey1,
        },
        text: {
          secondary: palette.coolGrey1,
        },
      },
      typography: {
        fontFamily: [`"${fontFamily}"`, 'sans-serif'].join(','),
        h1: {
          fontSize: '250%',
          fontWeight,
        },
        h2: {
          fontSize: '200%',
          fontWeight,
        },
        h3: {
          fontSize: '150%',
          fontWeight,
        },
        h4: {
          fontSize: '100%',
          fontWeight,
        },
        h5: {
          fontSize: '75%',
          fontWeight,
        },
        h6: {
          fontSize: '50%',
          fontWeight,
        },
        subtitle1: {
          fontSize: '100%',
          fontWeight,
        },
        subtitle2: {
          fontSize: '100%',
          fontWeight,
        },
      },
      ...themeCommonOverrides(),
    }),
);

export const getTheme = ({ weight, condensed } = {}) =>
  themeFactory({
    fontWeight: weight,
    fontFamily: condensed ? 'Roboto Condensed' : 'Roboto',
  });

export const RobotoTypography = ({
  weight = 'normal',
  condensed = false,
  ...props
}) => (
  <ThemeProvider theme={getTheme({ weight, condensed })}>
    <Typography {...props} />
  </ThemeProvider>
);
