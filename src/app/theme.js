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
