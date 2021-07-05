/* eslint-disable import/prefer-default-export */
import React from 'react';
import styled from 'styled-components';
import ListSwitchChevron from 'img/list-switch-chevron';
import palette, { opacify } from './palette';

const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
`;

export const ArrowIcon = () => (
  <IconWrapper>
    <ListSwitchChevron />
  </IconWrapper>
);

const STANDARD_TRANSITION = 'all 0.25s ease-out';

const themeCommonOverrides = () => ({
  props: {
    MuiPaper: {
      square: true,
      elevation: 2,
    },
    MuiSelect: {
      IconComponent: ArrowIcon,
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
        border: 'none',
        borderRadius: 0,
        margin: 0,
        padding: 0,
      },
    },
    MuiTypography: {
      gutterBottom: {
        marginBottom: '0.5rem',
      },
    },
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
    MuiInputLabel: {
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
    MuiInputBase: {
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
    MuiFilledInput: {
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
    MuiPaper: {
      root: {
        border: 'none',
        borderRadius: 0,
      },
    },
    MuiMenuItem: {
      root: {
        backgroundColor: 'transparent',
        transition: STANDARD_TRANSITION,
        fontFamily: "'Roboto Condensed', sans-serif",
        color: ({ color }) => color || palette.mediumGrey,

        '&:hover, &:active, &:focus': {
          backgroundColor: palette.brightBlueWithAlpha,
        },

        '&$selected': {
          backgroundColor: palette.brightBlueWithAlpha,

          '&:hover, &:active, &:focus': {
            backgroundColor: palette.brightBlueWithAlpha,
          },
        },
      },
    },
    MuiSelect: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

export default themeCommonOverrides;
