import { Typography } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import themeCommonOverrides from './theme-components';

const themeMontserratFactory = ({ fontWeight }) =>
  createMuiTheme({
    palette: {
      primary: {
        main: '#0ca1c7',
      },
      secondary: {
        main: '#8492a4',
      },
    },
    typography: {
      fontFamily: ['"Montserrat"', 'sans-serif'].join(','),
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
    },
    ...themeCommonOverrides(),
  });

const themeMontserrat = themeMontserratFactory({ fontWeight: 'bold' });

export const themeMontserratNormal = themeMontserratFactory({
  fontWeight: 'normal',
});

export const themeMontserrat500 = themeMontserratFactory({
  fontWeight: '500',
});

export const themeMontserrat600 = themeMontserratFactory({
  fontWeight: '600',
});

const themeProxy = new Proxy(
  {
    bold: themeMontserrat,
    normal: themeMontserratNormal,
    '500': themeMontserrat500,
    '600': themeMontserrat600,
  },
  {
    get(proxy, path) {
      return proxy[path] ?? proxy.normal;
    },
  },
);

export const MontserratTypography = ({ weight, ...props }) => (
  <ThemeProvider theme={themeProxy[weight]}>
    <Typography {...props} />
  </ThemeProvider>
);

export default themeMontserrat;
