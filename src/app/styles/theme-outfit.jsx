import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import palette from './palette';
import themeCommonOverrides from './theme-components';

const themeOutfitFactory = ({ fontWeight }) =>
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
      fontFamily: ['"Outfit"', 'sans-serif'].join(','),
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

const themeOutfit = themeOutfitFactory({ fontWeight: 'bold' });

export const themeOutfitNormal = themeOutfitFactory({
  fontWeight: 'normal',
});

export const themeOutfit300 = themeOutfitFactory({
  fontWeight: '300',
});

export const themeOutfit400 = themeOutfitFactory({
  fontWeight: '400',
});

export const themeOutfit500 = themeOutfitFactory({
  fontWeight: '500',
});

export const themeOutfit600 = themeOutfitFactory({
  fontWeight: '600',
});

export const themeOutfit700 = themeOutfitFactory({
  fontWeight: '700',
});

const themeProxy = new Proxy(
  {
    bold: themeOutfit,
    normal: themeOutfitNormal,
    300: themeOutfit300,
    400: themeOutfit400,
    500: themeOutfit500,
    600: themeOutfit600,
    700: themeOutfit700,
  },
  {
    get(proxy, path) {
      return proxy[path] ?? proxy.normal;
    },
  },
);

export const OutfitTypography = ({
  weight = 'normal',
  textDecoration,
  ...props
}) => (
  <ThemeProvider theme={themeProxy[weight]}>
    <Typography {...props} style={{ ...textDecoration }} />
  </ThemeProvider>
);

export default themeOutfit;
