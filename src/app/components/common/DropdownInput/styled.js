import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const SelectArrowImg = styled.img`
  pointer-events: none;
  height: 7px;
`;

export const useSecondaryTypeInputStyles = makeStyles({
  root: {
    marginTop: '0 !important',
    backgroundColor: palette.blueGrey,
    paddingRight: `${spacing.small} !important`,
  },
  input: {
    padding: `${spacing.tiny} ${spacing.small} ${spacing.tiny} ${spacing.small}`,
    borderRadius: 4,
    fontFamily: "'Roboto Condensed', sans-serif",
    color: palette.mediumGrey,
    '&[readonly]': {
      cursor: 'pointer',
      backgroundColor: palette.blueGrey,
    },
    '&:focus': {
      border: 'none',
    },
    '&:disabled': {
      cursor: 'initial',
    },
  },
});

export const useSecondaryTypeTextFieldStyles = makeStyles({
  root: {
    border: 'none',
    width: props => (props.width ? `${props.width}px` : '100%'),
  },
});

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
