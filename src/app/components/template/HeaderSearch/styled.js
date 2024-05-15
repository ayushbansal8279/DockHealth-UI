import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import ClearIcon from '@mui/icons-material/Clear';

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  flex-basis: ${({ wide }) => (wide ? 580 : 106)}px;
  transition: flex-basis 0.25s ease-out;
  border: 1px solid ${palette.zinc};
  color: ${palette.coolGrey1};
  height: 32px;
  border-radius: 4px;
  @media print {
    display: none;
  }

  @media (max-width: 900px) {
    flex-basis: 100%;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  // padding: 2px 0;
  color: ${palette.mediumGrey};
  outline: none;
  border: none;
  font-family: Roboto;
  font-weight: 400;
  line-height: 18.75px;
  font-size: ${fontSizes.regular};
  width: 50px;
  height: 19px;
  background: transparent;

  &::placeholder {
    color: ${palette.coolGrey2};
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
