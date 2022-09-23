import palette from 'styles/palette';
import { createTheme } from '@material-ui/core/styles';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const redTheme = createTheme({
  palette: {
    text: {
      primary: palette.oPlusRed,
      secondary: palette.mediumGrey,
    },
  },
  typography: {
    h2: {
      fontSize: fontSizes.regularPlus,
      lineHeight: 1.5,
      textTransform: 'uppercase',
    },
    body1: {
      color: palette.black,
      fontSize: fontSizes.regular,
      fontWeight: fontWeights.extraLight,
      lineHeight: 1.5,
      textAlign: 'center',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        padding: `${spacing.small} ${spacing.small}`,
        borderRadius: 0,
        fontSize: fontSizes.smallPlus,
        fontWeight: fontWeights.regularPlus,
      },
      contained: {
        padding: `${spacing.small} ${spacing.small}`,
        background: `linear-gradient(26.82deg, ${palette.oPlusRed}  9.75%, ${palette.orange} 87.04%);`,
        border: 0,
        color: palette.white,
        height: 48,
        boxShadow: 'none',
      },
      outlined: {
        padding: `${spacing.small} ${spacing.small}`,
        border: `2px solid ${palette.oPlusRed}`,
        color: palette.oPlusRed,
      },
    },
  },
});

export default {
  redTheme,
};
