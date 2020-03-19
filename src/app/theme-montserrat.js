import { createMuiTheme } from '@material-ui/core/styles';
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

export default themeMontserrat;
