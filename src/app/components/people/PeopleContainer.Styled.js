import styled from 'styled-components';
import { Grid } from '@material-ui/core';

export const ListContainer = styled.div`
  background-color: #fff;
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
    border-bottom: 1px solid #dedee2;
  }
`;

export const PersonStatus = styled.div`
  color: #007cab;
  margin-bottom: 1.5rem;
`;

export const MemberContainer = styled(Grid).attrs({ item: true })`
  && {
    margin: 0 1rem 0 2rem;
  }
`;
