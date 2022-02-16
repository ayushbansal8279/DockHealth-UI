import styled from 'styled-components';
import Select from 'components/common/Select/Select';

export const BooleanBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  cursor: pointer;
`;

export const BooleanSelect = styled(Select)`
  & .MuiSelect-root {
    padding: 0px;
    background: white;
  }
  & .MuiSelect-root:before {
    display: none;
  }
`;
