import { RotatableChevronWithSpacing } from './components/common/RotatableChevron';
import palette, { opacify } from './palette';

const STANDARD_TRANSITION = 'all 0.25s ease-out';

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
    MuiBackdrop: {
      root: {
        backgroundColor: opacify(palette.midnightBlue, 0.5),
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
      root: {
        padding: 0,
      },
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
        transition: STANDARD_TRANSITION,
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
      label: {
        zIndex: 100,
      },
      text: {
        color: palette.cyanBlue,
        fontSize: '1.5rem',
        minHeight: '3.625rem',
        textTransform: 'none',
      },
      contained: {
        background: `linear-gradient(to top right, ${palette.brightBlue}, ${palette.darkBlue})`,
        borderRadius: 0,
        color: palette.white,
        filter: 'brightness(1)',
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        minHeight: '3.625rem',
        minWidth: '16.5625rem',
        position: 'relative',
        textTransform: 'uppercase',
        transition: STANDARD_TRANSITION,
        '&::before': {
          background: `linear-gradient(to top right, ${palette.darkBlue}, ${palette.darkBlue})`,
          content: '""',
          height: '100%',
          left: 0,
          opacity: 0,
          position: 'absolute',
          top: 0,
          transition: STANDARD_TRANSITION,
          width: '100%',
        },
        '&$disabled': {
          background: `linear-gradient(to top right, ${palette.white}, ${palette.white})`,
          border: `0.125rem solid ${palette.coolGrey1}`,
          color: palette.coolGrey1,
        },
        '&:hover': {
          color: palette.white,
          '&::before': {
            opacity: 1,
          },
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
