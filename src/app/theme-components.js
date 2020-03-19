import { RotatableChevronWithSpacing } from './components/common/RotatableChevron';

const themeCommonOverrides = () => ({
  props: {
    MuiPopover: {
      PaperProps: {
        elevation: 0,
        square: true,
      },
    },
    MuiSelect: {
      IconComponent: RotatableChevronWithSpacing,
    },
    MuiMenu: {
      PaperProps: {
        square: true,
      },
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
    MuiCollapse: {
      container: {
        width: '100%',
      },
    },
    MuiPickersDay: {
      isSelected: {
        fontWeight: 'bold',
      },
    },
    MuiPopover: {
      paper: {
        border: '0.0625rem solid #c1ccda',
        margin: 0,
        padding: 0,
      },
    },
    MuiSelect: {
      outlined: {
        borderRadius: 0,
        height: '2.5rem',
      },
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
      selectMenu: {
        alignItems: 'center',
        color: '#00a2e5',
        display: 'flex',
        fontSize: '1rem',
        height: '2.5rem',
        padding: '0 1rem',
        textTransform: 'uppercase',
      },
    },
    MuiTypography: {
      gutterBottom: {
        marginBottom: '0.5rem',
      },
    },
    MuiList: {
      padding: 0,
    },
    MuiMenu: {
      paper: {
        border: '0.0625rem solid #c1ccda',
        borderRadius: 0,
        boxShadow: 'none',
      },
      list: {
        padding: 0,
      },
    },
    MuiMenuItem: {
      root: {
        backgroundColor: '#fff',
        filter: 'brightness(1)',
        fontSize: '1rem',
        padding: '0.125rem 1rem',
        textTransform: 'uppercase',
        transition: 'all 0.25s ease-out',
        '&:hover': {
          backgroundColor: '#fff',
          color: '#0ca1c7',
          filter: 'brightness(1.05)',
        },
        '&:active, &:focus': {
          backgroundColor: '#fff',
        },
        '&$selected': {
          backgroundColor: '#fff',
          color: '#0ca1c7',
          '&:hover': {
            backgroundColor: '#fff',
            color: '#0ca1c7',
            filter: 'brightness(1.05)',
          },
          '&:active, &:focus': {
            backgroundColor: '#fff',
          },
        },
      },
    },
    MuiButton: {
      text: {
        color: '#007cab',
        fontSize: '1.5rem',
        minHeight: '3.625rem',
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

export default themeCommonOverrides;
