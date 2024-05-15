import styled from 'styled-components';
import palette from 'styles/palette';
import { Select as MuiSelect } from '@mui/material';

export const Select = styled(MuiSelect)`
  display: flex;
  align-items: center;
  background: ${(props) =>
    props.isOpen ? palette.newBrightBlue : palette.newDarkBlue};
  color: ${palette.white};
  height: 32px;
  width: auto;
  border-radius: 4px;

  &:hover {
    background: ${(props) =>
      props.isOpen ? palette.cornFlowerBlue : palette.purpleNavy};
  }

  & .switchIcon > path {
    fill: ${(props) => props.iconcoloractive ?? palette.white};
  }
`;

export const SelectWrapper = styled.div`
  @media print {
    display: none;
  }
`;

export const SelectIcon = styled.span`
  border-right: 1px solid ${palette.white};
  height: 40px;
  display: flex;
  align-items: center;
  padding-right: 10px;
  filter: brightness(0) invert(1);
  font-family: Outfit;
  font-size: 14px;
  font-weight: 500;
  line-height: 11.19px;
  text-align: center;
`;
