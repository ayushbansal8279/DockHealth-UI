import styled from 'styled-components';
import palette from 'styles/palette';
import { makeStyles } from '@material-ui/core/styles';

export const useAutocompleteStyles = makeStyles({
  root: {
    width: '100%',
  },
  inputRoot: {
    width: '100%',
    paddingRight: '0 !important',
  },
  input: {
    width: '100% !important',
    padding: '24px 24px',
    background: palette.coolGrey4,
    border: 'none',
    outline: 'none',
  },
  listbox: {
    maxHeight: 238,
  },
});

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
