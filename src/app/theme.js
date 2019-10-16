import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '"Open Sans"',
      '"Helvetica Neue"',
      'Helvetica',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h2: {
      fontSize: '150%',
      fontWeight: 'bold',
      marginBottom: '0.5em',
    },
    h4: {
      fontSize: '100%',
      fontWeight: 'normal',
    },
  },
  overrides: {
    MuiListItem: {
      root: {
        '&$selected': {
          backgroundColor: '#a6dcea',
        },
        '&$selected:hover': {
          backgroundColor: '#a6dcea',
        },
        '&$selected:focus': {
          backgroundColor: '#a6dcea',
        },
      },
    },
  },
});

export default theme;
