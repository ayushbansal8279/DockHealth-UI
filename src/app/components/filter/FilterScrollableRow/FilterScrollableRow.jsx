import styled from 'styled-components';

const FilterScrollableRow = styled.div`
  display: flex;
  flex: 1;
  padding-bottom: 20px;
  overflow-x: auto;
  overflow-y: hidden;

  // Showing scrollbar always
  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  &::-webkit-scrollbar:horizontal {
    height: 11px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid white;
    background-color: rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }
`;

export default FilterScrollableRow;
