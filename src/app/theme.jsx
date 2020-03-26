import { Typography } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import themeCommonOverrides from './theme-components';

const themeFactory = ({ fontWeight }) =>
  createMuiTheme({
    palette: {
      primary: {
        main: '#0ca1c7',
      },
      secondary: {
        main: '#8492a4',
      },
      text: {
        secondary: '#8492a4',
      },
    },
    typography: {
      fontFamily: ['"Roboto"', 'sans-serif'].join(','),
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
  });

const theme = themeFactory({ fontWeight: 'bold' });

export const themeNormal = themeFactory({
  fontWeight: 'normal',
});

export const theme500 = themeFactory({
  fontWeight: '500',
});

export const theme600 = themeFactory({
  fontWeight: '600',
});

const themeProxy = new Proxy(
  {
    bold: theme,
    normal: themeNormal,
    '500': theme500,
    '600': theme600,
  },
  {
    get(proxy, path) {
      return proxy[path] ?? proxy.normal;
    },
  },
);

export const RobotoTypography = ({ weight, ...props }) => (
  <ThemeProvider theme={themeProxy[weight]}>
    <Typography {...props} />
  </ThemeProvider>
);

export default theme;
