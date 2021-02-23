import styled from 'styled-components';
import { List } from '@material-ui/core';

export const FiledInSelect = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: ${props => (props.enableDropDown ? 'pointer' : '')};

  & > * {
    font-size: 1rem;
    margin-left: 6px;
  }
`;

export const StyledList = styled(List)`
  max-height: 12.5rem;
  overflow-y: auto;
`;

export const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const ListNameContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const ListNameSelectContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
