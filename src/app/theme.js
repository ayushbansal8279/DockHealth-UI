import { createMuiTheme } from '@material-ui/core/styles';
import themeCommonOverrides from './theme-components';

const theme = createMuiTheme({
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
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '200%',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '150%',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '100%',
      fontWeight: 'bold',
    },
    subtitle1: {
      fontSize: '100%',
      fontWeight: 'bold',
    },
    subtitle2: {
      fontSize: '100%',
      fontWeight: 'bold',
    },
  },
  ...themeCommonOverrides(),
});

export default theme;
