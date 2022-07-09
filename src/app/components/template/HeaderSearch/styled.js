import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import MuiCancelIcon from '@material-ui/icons/Cancel';

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  flex-basis: ${({ wide }) => (wide ? 374 : 115)}px;
  transition: flex-basis 0.25s ease-out;
  border: 1px solid ${palette.coolGrey2};
  color: ${palette.coolGrey1};
  @media print {
    display: none;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 8px 0;
  color: ${palette.mediumGrey};
  outline: none;
  border: none;
  font-size: ${fontSizes.regular};

  &::placeholder {
    color: ${palette.coolGrey1};
    text-transform: uppercase;
  }
`;

export const CancelIcon = withStyles({
  root: {
    width: 20,
    height: 20,
  },
})(MuiCancelIcon);

export const ClearButton = styled.button`
  color: inherit;
`;
