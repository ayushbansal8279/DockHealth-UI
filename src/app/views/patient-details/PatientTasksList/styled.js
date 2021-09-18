import styled from 'styled-components';
import palette from 'styles/palette';

export const ListsToolbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 45px;
`;

export const ListsTabsContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  overflow: hidden;
`;

export const MenuText = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
`;
