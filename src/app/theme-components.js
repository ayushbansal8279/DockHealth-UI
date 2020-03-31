import { RotatableChevronWithSpacing } from './components/common/RotatableChevron';
import palette from './palette';

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
          backgroundColor: palette.softCyan,
        },
        '&$selected:hover': {
          backgroundColor: palette.softCyan,
        },
        '&$selected:focus': {
          backgroundColor: palette.softCyan,
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
        border: `0.0625rem solid ${palette.coolGrey2}`,
        margin: 0,
        padding: 0,
      },
    },
    MuiSelect: {
      outlined: {
        borderRadius: 0,
        height: '2.5rem',
        '&$selectMenu': {
          color: palette.brightBlue,
        },
      },
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
      selectMenu: {
        alignItems: 'center',
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
        border: `0.0625rem solid ${palette.coolGrey2}`,
        borderRadius: 0,
        boxShadow: 'none',
      },
      list: {
        padding: 0,
      },
    },
    MuiMenuItem: {
      root: {
        backgroundColor: palette.white,
        filter: 'brightness(1)',
        fontSize: '1rem',
        padding: '0.125rem 1rem',
        textTransform: 'uppercase',
        transition: 'all 0.25s ease-out',
        '&:hover': {
          backgroundColor: palette.white,
          color: palette.lighterCyanBlue,
          filter: 'brightness(1.05)',
        },
        '&:active, &:focus': {
          backgroundColor: palette.white,
        },
        '&$selected': {
          backgroundColor: palette.white,
          color: palette.lighterCyanBlue,
          '&:hover': {
            backgroundColor: palette.white,
            color: palette.lightCyanBlue,
            filter: 'brightness(1.05)',
          },
          '&:active, &:focus': {
            backgroundColor: palette.white,
          },
        },
      },
    },
    MuiButton: {
      text: {
        color: palette.cyanBlue,
        fontSize: '1.5rem',
        minHeight: '3.625rem',
        textTransform: 'none',
      },
      contained: {
        backgroundColor: palette.cyanBlue,
        borderRadius: '0.25rem',
        color: palette.white,
        filter: 'brightness(1)',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        minHeight: '3.625rem',
        minWidth: '16.5625rem',
        textTransform: 'none',
        transition: 'all 0.25s ease-out',
        '&$disabled': {
          backgroundColor: palette.cyanBlue,
          color: palette.white,
          filter: 'brightness(0.8)',
        },
        '&:hover': {
          backgroundColor: palette.cyanBlue,
          color: palette.white,
          filter: 'brightness(1.2)',
        },
      },
      containedPrimary: {
        backgroundColor: palette.vividPink,
        color: palette.white,
        fontSize: '1.5rem',
        '&$disabled': {
          backgroundColor: palette.vividPink,
          color: palette.white,
          filter: 'brightness(0.8)',
        },
        '&:hover': {
          backgroundColor: palette.vividPink,
          color: palette.white,
          filter: 'brightness(1.2)',
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
