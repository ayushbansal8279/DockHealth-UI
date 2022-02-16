import styled from 'styled-components';
import Select from 'components/common/Select/Select';

export const DropdownBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  cursor: pointer;
`;

export const DropdownSelect = styled(Select)`
  & .MuiSelect-root {
    padding: 0px;
    background: white;
  }
  & .MuiSelect-root:before {
    display: none;
  }
`;
