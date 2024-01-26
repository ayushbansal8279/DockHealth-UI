import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import ClearIcon from '@mui/icons-material/Clear';

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  flex-basis: ${({ wide }) => (wide ? 580 : 140)}px;
  transition: flex-basis 0.25s ease-out;
  border: 2px solid ${palette.zinc};
  color: ${palette.coolGrey1};
  height: 40px;
  border-radius: 5px;
  @media print {
    display: none;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 6px 0;
  color: ${palette.mediumGrey};
  outline: none;
  border: none;
  font-size: ${fontSizes.regularPlus};
  width: 0px;
  background: transperant;

  &::placeholder {
    color: ${palette.zinc};
    // text-transform: uppercase;
  }
`;

export const CancelIcon = styled(ClearIcon)`
  &&& {
    color: ${palette.coolGrey1};
    &.MuiCancelIcon-root {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ClearButton = styled.button`
  color: inherit;
  background-color: ${palette.whiteSmoke};
  border-radius: 50%;
`;
