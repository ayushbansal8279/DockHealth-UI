import styled from 'styled-components';
import { TextField, InputLabel } from '@material-ui/core';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const StyledTextField = styled(TextField)`
  padding-top: ${spacing.smallPlus} !important;
  padding-bottom: ${spacing.tiny} !important;
  border-bottom: 1px solid ${palette.coolGrey1} !important;

  * > * {
    border-image: none !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    font-family: Roboto Condensed !important;
  }

  * > input {
    color: ${palette.mediumGrey} !important;

    &:disabled {
      background-color: white !important;
      cursor: default;
    }

    font-weight: ${({ inputProps }) => {
      const { value } = inputProps;

      if (value !== '') return 'bold !important';

      return 'default';
    }};
  }
`;

export const StyledLabel = styled(InputLabel)`
  color: ${palette.coolGrey1};
  font-size: 12px !important;
  font-weight: 400 !important;
  font-family: Roboto Condensed !important;
`;
