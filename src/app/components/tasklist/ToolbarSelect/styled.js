import styled from 'styled-components';
import palette from 'styles/palette';
import { Select as MuiSelect } from '@mui/material';

export const Select = styled(MuiSelect)`
  &&& {
    &.MuiSelect-root {
      display: flex;
      align-items: center;
      height: 46px;
      padding: 4px 32px 4px 12px;
      box-sizing: border-box;
      border-radius: 5px;
      color: ${palette.darkGrey};
    }

    &:hover .MuiSelect-root,
    &.Mui-focused .MuiSelect-root {
      background: ${palette.coolGrey3};
    }

    & .MuiOutlinedInput-notchedOutline {
      border: none;
    }

    & .switchIcon > path {
      fill: ${(props) => props.iconcoloractive ?? palette.dirtyBanana};
    }
  }
`;

export const SelectWrapper = styled.div`
  @media print {
    display: none;
  }
`;
