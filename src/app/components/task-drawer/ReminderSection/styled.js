import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const ReminderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: 0px;
  margin-bottom: ${spacing.tiny};
  transition: opacity 0.4s ease-out;
  font-family: 'Roboto Condensed', sans-serif;
`;

export const Description = styled.p`
  display: inline-block;
  margin-bottom: 0;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
`;

export const ReminderTypeSelectOption = styled.div`
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

export const SelectArrowImg = styled.img`
  position: absolute;
  top: 50%;
  right: ${spacing.small};
  transform: translateY(-45%);
  cursor: pointer;
  pointer-events: none;
`;

export const useReminderTypeInputStyles = makeStyles({
  root: {
    marginTop: '0 !important',
  },
  input: {
    padding: `${spacing.tiny} ${spacing.largePlus} ${spacing.tiny} ${spacing.small}`,
    backgroundColor: palette.blueGrey,
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

export const useReminderTypeTextFieldStyles = makeStyles({
  root: {
    border: 'none',
    width: 140,
  },
});
