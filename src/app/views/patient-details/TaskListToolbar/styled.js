import styled from 'styled-components';
import palette from 'styles/palette';
import { Box } from '@material-ui/core';

export const ListsToolbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 50px;
`;
export const LabelBox = styled(Box)`
  cursor: pointer;
`;

export const ListsTabsContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  overflow: hidden;
`;

export const MenuText = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;
