/* eslint-disable react/jsx-no-duplicate-props */
// import { TextField } from '@mui/material';
import { TextField } from '@mui/material';
// import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import styled from 'styled-components';
import { fontWeights } from 'styles/font';

export const StyledTextField = styled(TextField)`
  & {
    border: none;
    height: 100%;
    padding: 0;
    width: ${(props) => (props.fullWidth ? '100%' : '9rem')};

    &::after,
    &::before {
      border: 0 !important;
    }

    // & label {
    //   color: palette.coolGrey1;
    // }
    // '& label.Mui-disabled' {
    //   color: palette.coolGrey2;
    // },
    // & label.Mui-focused {
    //   color: palette.coolGrey1;
    // }
    // & .MuiInput-underline:after {
    //   borderBottomColor: palette.coolGrey1;
    // }
    // & .MuiInput-input {
    //   boxShadow: 'none';
    // }
    // & label + .MuiInput-formControl {
    //   marginTop: '16px';
    // }
    // & .MuiInputBase-inputMultiline {
    //   height: '19px';
    //   minHeight: 0;
    // },
    // & .MuiInputBase-multiline {
    //   paddingTop: 0;
    //   paddingBottom: 0;
    // },
    // & .MuiInputBase-root {
    //   flexWrap: props => (props.parentType === 'selectTag' ? 'wrap' : '');
    //   // paddingRight: props =>
    //   //   props.parentType === 'selectTag' ? '30px' : '0px',
    // },

    // & .MuiInputBase-input {
    //   height: 100%;
    //   border: none;
    //   box-shadow: none;
    //   background: none;
    //   font-size: 0.875rem;
    //   font-weight: ${fontWeights.regular};
    //   padding: 0;

    //   // &::placeholder {
    //   //   color: ${palette.coolGrey1};
    //   //   font-size: 1rem;
    //   //   font-weight: ${fontWeights.regular};
    //   //   opacity: 0.8;
    //   //   text-transform: uppercase;
    //   // }
    // }
  }
`;
