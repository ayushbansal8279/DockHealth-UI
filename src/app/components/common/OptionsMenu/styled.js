/* eslint-disable import/prefer-default-export */
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

export const StyledButton = styled.button`
  display: block;
`;

export const useMenuStyles = makeStyles({
  root: {
    minWidth: 120,
    maxWidth: 300,
  },
});

export const OptionsMenuContainer = styled.div`
  display: flex;
  @media print {
    display: none;
  }
`;
