import styled from 'styled-components';
import palette from 'styles/palette';
import { Autocomplete as MuiAutocomplete } from '@mui/lab';

export const Autocomplete = styled(MuiAutocomplete)`
  &&& {
    &.MuiAutocomplete-root {
      width: 100%;
    }

    // &.MuiAutocomplete-inputRoot {
    //   width: 100%;
    //   padding-right: 0 !important;
    // }

    // &.MuiAutocomplete-input {
    & input {
      width: 100% !important;
      padding: 24px;
      background: ${palette.coolGrey4};
      border: none;
      outline: none;
    }

    &.MuiAutocomplete-listbox {
      max-height: 238px;
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
