import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import palette from './palette';
import themeCommonOverrides from './theme-components';

const themeMontserratFactory = ({ fontWeight }) =>
  createTheme({
    palette: {
      primary: {
        main: palette.lighterCyanBlue,
      },
      secondary: {
        main: palette.coolGrey1,
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
        fontSize: '87.5%',
        fontWeight,
      },
      h6: {
        fontSize: '75%',
        fontWeight,
      },
    },
    components: {
      ...themeCommonOverrides(),
    },
  });

const themeMontserrat = themeMontserratFactory({ fontWeight: 'bold' });

export const themeMontserratNormal = themeMontserratFactory({
  fontWeight: 'normal',
});

export const themeMontserrat300 = themeMontserratFactory({
  fontWeight: '300',
});

export const themeMontserrat400 = themeMontserratFactory({
  fontWeight: '400',
});

export const themeMontserrat500 = themeMontserratFactory({
  fontWeight: '500',
});

export const themeMontserrat600 = themeMontserratFactory({
  fontWeight: '600',
});

export const themeMontserrat700 = themeMontserratFactory({
  fontWeight: '700',
});

export const themeMontserrat800 = themeMontserratFactory({
  fontWeight: '800',
});

const themeProxy = new Proxy(
  {
    bold: themeMontserrat,
    normal: themeMontserratNormal,
    300: themeMontserrat300,
    400: themeMontserrat400,
    500: themeMontserrat500,
    600: themeMontserrat600,
    700: themeMontserrat700,
    800: themeMontserrat800,
  },
  {
    get(proxy, path) {
      return proxy[path] ?? proxy.normal;
    },
  },
);

export const MontserratTypography = ({
  weight = 'normal',
  textDecoration,
  ...props
}) => (
  <ThemeProvider theme={themeProxy[weight]}>
    <Typography {...props} style={{ ...textDecoration }} />
  </ThemeProvider>
);

export default themeMontserrat;
