import React from 'react';
import styled from 'styled-components';
import ListSwitchChevron from 'img/list-switch-chevron';
import palette, { opacify } from './palette';
import { fontWeights } from './font';
import spacing from './spacing';

const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const ArrowIcon = () => (
  <IconWrapper>
    <ListSwitchChevron />
  </IconWrapper>
);

const STANDARD_TRANSITION = 'all 0.25s ease-out';

const listItemStyles = {
  backgroundColor: 'transparent',
  transition: STANDARD_TRANSITION,
  fontFamily: "'Roboto Condensed', sans-serif",
  color: ({ color }) => color || palette.mediumGrey,
  whiteSpace: 'normal',

  '&:hover, &:active, &:focus': {
    backgroundColor: palette.brightBlueWithAlpha,
  },

  '&$selected': {
    backgroundColor: palette.brightBlueWithAlpha,

    '&:hover, &:active, &:focus': {
      backgroundColor: palette.brightBlueWithAlpha,
    },
  },
};

const themeCommonOverrides = () => ({
  MuiListItem: {
    styleOverrides: {
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
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        fontFamily: 'inherit',
        marginTop: 0,
        marginBottom: 0,
      },
    },
  },
  MuiBackdrop: {
    // styleOverrides: {
    //   root: {
    //     backgroundColor: opacify(palette.midnightBlue, 0.5),
    //   },
    // },
  },
  MuiCollapse: {
    styleOverrides: {
      container: {
        width: '100%',
      },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      isSelected: {
        fontWeight: 'bold',
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      gutterBottom: {
        marginBottom: '0.5rem',
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        width: '100%',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: palette.coolGrey6,
        textTransform: 'uppercase',
        fontSize: '16px',

        '&$error': {
          color: palette.error,
        },
        '&$focused': {
          color: palette.brightBlue,
        },
      },
      shrink: {
        fontSize: '12px',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        border: 'none',
        borderRadius: 0,
      },
      input: {
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        fontSize: '16px',
        height: 'auto',

        '&:focus, &:active, &:disabled, &[readonly]': {
          border: 'none',
          boxShadow: 'none',
          backgroundColor: 'transparent',
        },
        '&[readonly]': {
          cursor: 'initial',
        },
      },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        backgroundColor: '#F7FAFB !important',
      },
      underline: {
        '&:before': {
          borderBottomColor: palette.coolGrey6,
        },
        '&$focused:after': {
          borderBottomColor: palette.brightBlue,
        },
        '&.Mui-readonly': {
          '&:after, &:before': {
            borderBottom: 'none',
          },
        },
        '&$error:after': {
          borderBottomColor: palette.error,
        },
        '&$disabled:before': {
          borderBottomStyle: 'solid',
        },
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      square: true,
      elevation: 2,
    },
    styleOverrides: {
      root: {
        border: 'none',
        borderRadius: 0,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: listItemStyles,
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      option: listItemStyles,
      popper: {
        zIndex: 6000,
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      IconComponent: ArrowIcon,
    },
    styleOverrides: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  MuiTabs: {
    defaultProps: {
      textColor: 'inherit',
    },
    styleOverrides: {
      indicator: {
        backgroundColor: palette.brightBlue,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: fontWeights.bold,
      },
      textColorInherit: {
        color: palette.mediumGrey,

        '&$selected': {
          color: palette.brightBlue,
          backgroundColor: palette.coolGrey4,
        },
        '&$disabled': {
          color: palette.coolGrey1,
        },
      },
    },
  },
  MuiIconButton: {
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: {
        color: palette.coolGrey1,
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      colorPrimary: {
        color: palette.coolGrey1,
      },
      colorSecondary: {
        color: palette.brightBlue,
      },
    },
  },
  MuiSkeleton: {
    defaultProps: {
      variant: 'rect',
    },
    styleOverrides: {
      root: {
        backgroundColor: palette.skeletonLoader,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        height: spacing.large,
        marginRight: spacing.tiny,

        color: ({ textcolor }) => textcolor || palette.mediumGrey,
      },
    },
  },
});

export default themeCommonOverrides;
