import styled from 'styled-components';

export const ListsToolbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 50px;
`;

export const ListsTabsContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  overflow: hidden;
`;

export const ListSelectionImg = styled.img`
  width: 21px;
  ${({ iconColorFilterActive }) =>
    iconColorFilterActive
      ? `filter: ${iconColorFilterActive}; `
      : 'filter: invert(60%) sepia(60%) saturate(1790%) hue-rotate(348deg) brightness(100%) contrast(88%);'}
`;
