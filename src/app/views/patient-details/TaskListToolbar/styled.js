import palette from '@/app/styles/palette';
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
  width: 18px;
  height: 18px;
  ${({ iconColorFilterActive }) =>
    iconColorFilterActive
      ? `filter: ${iconColorFilterActive}; `
      : 'filter: invert(60%) sepia(60%) saturate(1790%) hue-rotate(348deg) brightness(100%) contrast(88%);'};
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 35px)`};
  grid-template-rows: 32px;
  height: 32px;
  z-index: 13;
  overflow: hidden;
  @media print {
    display: none;
  }
`;

export const GridItemFullView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  height: 32px;
  text-align: center;
  cursor: pointer;
  border-radius: 4px 0px 0px 4px;
  border-width: ${({ active }) =>
    active ? '0px 0px 0px 0px;' : '1px 0px 1px 1px;'};
  border-style: solid;
  border-color: ${palette.zinc};
  padding: 2px 4px 10px 5px;
  gap: 10px;
  @media print {
    display: none;
  }
`;

export const GridItemSlimView = styled.div`
  background-color: ${(props) =>
    props.active ? palette.newDarkBlue : palette.white};
  color: ${(props) => (props.active ? palette.white : palette.zinc)};
  height: 32px;
  text-align: center;
  border-width: ${({ active }) =>
    active ? '0px 0px 0px 0px;' : '1px 1px 1px 0px;'};
  border-style: solid;
  border-color: ${palette.zinc};
  border-radius: 0px 4px 4px 0px;
  padding: 2px 5px 10px 5px;
  gap: 10px;
  cursor: pointer;
  @media print {
    display: none;
  }
`;
