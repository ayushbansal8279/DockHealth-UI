import styled from 'styled-components';
import palette from 'styles/palette';
import { Autocomplete as MuiAutocomplete } from '@mui/material';

export const Autocomplete = styled(MuiAutocomplete)`
  &&& {
    &.MuiAutocomplete-root {
      width: 100%;
      border-radius: 8px;
      border: 1px solid ${palette.black};
    }

    & .MuiOutlinedInput-root {
      padding: 0;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;

      & .MuiAutocomplete-input {
        padding: 16px;
      }
    }

      & input::placeholder {
        color: black !important;
        opacity: 1 !important; /* Ensures full visibility */
      }
    }

    & input {
      width: 100% !important;
      padding: 16px;
      border-radius: 8px;
      border: none;
      outline: none;
    }

    & .MuiAutocomplete-listbox {
      max-height: 238px;
      border-radius: 8px;
      background: ${palette.white};
    }

    & .MuiAutocomplete-popupIndicator {
      // color: ${palette.darkGrey};
    }
  }
`;

export const SelectedUsersContainer = styled.div`
  width: 100%;
  max-height: 210px;
  margin-top: 16px;
  overflow-y: auto;
`;

export const SelectedUserText = styled.p`
  display: block;
  margin-bottom: 0;
`;

export const ExternalUserLabel = styled.span`
  color: ${palette.coolGrey2};
`;

export const SelectedUserItem = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: auto 1fr auto;
  grid-gap: 12px;
  align-items: center;
  padding: 4px 0;
`;
