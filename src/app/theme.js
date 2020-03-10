import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['"Open Sans"', 'sans-serif'].join(','),
    h1: {
      fontSize: '250%',
    },
    h2: {
      fontSize: '200%',
    },
    h3: {
      fontSize: '150%',
    },
    h4: {
      fontSize: '100%',
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
    MuiButton: {
      text: {
        color: '#007cab',
        fontSize: '1.5rem',
        minHeight: '3.625rem',
        minWidth: '16.5625rem',
        textTransform: 'none',
      },
      contained: {
        backgroundColor: '#007cab',
        borderRadius: '0.25rem',
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        minHeight: '3.625rem',
        minWidth: '16.5625rem',
        textTransform: 'none',
        transition: 'all 0.25s ease-out',
        '&$disabled': {
          backgroundColor: '#125375',
          color: '#ffffff80',
        },
        '&:hover': {
          backgroundColor: '#0ca1c7',
        },
      },
      containedPrimary: {
        backgroundColor: '#d9036b',
        fontSize: '1.5rem',
        '&$disabled': {
          backgroundColor: '#a70252',
          color: '#ffffffc0',
        },
        '&:hover': {
          backgroundColor: '#fc1384',
        },
      },
      sizeSmall: {
        fontSize: '1rem',
        minHeight: '2.5rem',
      },
    },
  },
});

export default theme;
