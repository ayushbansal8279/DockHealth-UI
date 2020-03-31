import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import palette from '../../palette';

export const ListContainer = styled.div`
  background-color: ${palette.white};
  padding: 1rem;
`;

export const ListEntryContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin: 0 0.5rem;
  padding: 1rem 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid ${palette.unknownGrey6};
  }
`;

export const PersonStatus = styled.div`
  color: ${palette.cyanBlue};
  margin-bottom: 1.5rem;
`;

export const MemberContainer = styled(Grid).attrs({ item: true })`
  && {
    margin: 0 1rem 0 2rem;
  }
`;
