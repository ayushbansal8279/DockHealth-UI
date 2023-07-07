import styled from 'styled-components';
// import { makeStyles } from '@mui/styles';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

import DropdownInput from './DropdownInput';

export const SelectArrowImg = styled.img`
  pointer-events: none;
  height: 7px;
`;

export const StyledDropdownInput = styled(DropdownInput)`
& .MuiInput-root {
  marginTop: 0 !important;
  backgroundColor: palette.blueGrey;
  paddingRight: ${spacing.small} !important;
}
& .MuiInputBase-input {
  padding: ${spacing.tiny} ${spacing.small} ${spacing.tiny} ${spacing.small};
  borderRadius: 4;
  fontFamily: 'Roboto Condensed', sans-serif;
  font-size: 1rem;
  color: palette.mediumGrey;

  &[readonly] {
    cursor: pointer;
    backgroundColor: palette.blueGrey;
  },
  &:focus {
    border: none;
  }
  &:disabled {
    cursor: initial;
  }

  & .MuiTextField-root {
    border: none;
    transition: none;
    width: ${({width}) => (width ? `${width}px` : '100%')};
  }
}
`

export const SelectOption = styled.div`
  width: 100%;
  padding: ${spacing.smallPlus};
  text-align: left;
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.coolGrey1};
  background-color: ${({ isActive }) =>
    isActive ? palette.coolGrey4 : 'transparent'};
  font-weight: ${({ isActive }) =>
    isActive ? fontWeights.bold : fontWeights.light};
`;
