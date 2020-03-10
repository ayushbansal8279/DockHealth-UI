import { createMuiTheme } from '@material-ui/core';

const themeMontserrat = createMuiTheme({
  typography: {
    fontFamily: ['"Montserrat"', 'sans-serif'].join(','),
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
    },
  },
});

export default themeMontserrat;
