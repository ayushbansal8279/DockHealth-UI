/* eslint-disable react/jsx-no-duplicate-props */
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

    & .MuiInputBase-input {
      height: 100%;
      border: none;
      box-shadow: none;
      background: none;
      font-size: 0.875rem;
      font-weight: ${fontWeights.regular};
      padding: 0;

  }
`;
