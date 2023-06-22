import styled from 'styled-components';
import Select from 'components/common/Select/Select';
import palette from 'styles/palette';

export const DropdownBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  color: ${palette.paleBlue};
`;

export const DropdownSelect = styled(Select)`
  & .MuiSelect-root {
    padding: 0px;
    background: white;
    height: 40px;
  }
  & .MuiSelect-filled.MuiSelect-filled {
    padding-right: 0;
    height: 40px;
  }
  & .MuiSelect-root:before {
    display: none;
  }
  & .MuiSelect-select {
    padding: 0px;
    background-color: cream;
    height: 40px;
  }
`;

export const PlaceholderContainer = styled.div`
  top: -3px;
  position: absolute;
  left: 0px;
  z-index: 9;
  pointer-events: none;
`;

export const ColorIndicator = styled.div`
  display: block;
  width: 6px;
  height: 100%;
  background: ${(props) => props.color};
  position: absolute;
  left: 0px;
`;
