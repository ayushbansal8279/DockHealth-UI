import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['"Open Sans"', 'sans-serif'].join(','),
    h2: {
      fontSize: '150%',
      fontWeight: 'bold',
      marginBottom: '0.5em',
    },
    h4: {
      fontSize: '100%',
      fontWeight: 'normal',
      lineHeight: '1.25',
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
    MuiPickersDay: {
      isSelected: {
        fontWeight: 'bold',
      },
    },
  },
});

export default theme;
