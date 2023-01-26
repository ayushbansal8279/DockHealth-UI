import { IconButton } from '@mui/material';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const BackButton = styled(IconButton)`
  && {
    height: 2.25rem;
    padding: 0;
    margin-right: 0.5rem;
    width: 2.25rem;
  }
`;

export const PersonDetailsViewHeader = styled.div`
  align-items: center;
  display: flex;
  height: 88px;
  padding: 1rem;
`;

export const TaskGroupsContainer = styled.div`
  margin: 0 ${spacing.large} ${spacing.huge} ${spacing.large};
`;

export const TaskViewContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  background-color: ${palette.coolGrey4};
`;
