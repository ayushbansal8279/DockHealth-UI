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
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  border: none;
  transition: none;
  & .MuiInput-root {
    margintop: 0 !important;
    backgroundcolor: palette.blueGrey;
    paddingright: ${spacing.small} !important;
  }
  & .MuiInputBase-input {
    padding: ${spacing.tiny} ${spacing.small} ${spacing.tiny} ${spacing.small};
    borderradius: 4;
    fontfamily: 'Roboto Condensed', sans-serif;
    font-size: 1rem;
    color: palette.mediumGrey;

    &[readonly] {
      cursor: pointer;
      backgroundcolor: palette.blueGrey;
    }
    ,
    &:focus {
      border: none;
    }
    &:disabled {
      cursor: initial;
    }
  }
`;

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
