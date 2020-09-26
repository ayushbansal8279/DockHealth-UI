import styled from 'styled-components';
import spacing from 'styles/spacing';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const ListPickerModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 384px; // per design
  width: 100%;
`;

export const AddListForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const AddListInputWrapper = styled.div`
  position: relative;
  width: 100%;
  font-size: ${fontSizes.smallPlus};

  ${({ isFocused }) =>
    !isFocused &&
    `&:before {
    position: absolute;
    top: 50%;
    left: ${spacing.regularPlus};
    display: block;
    content: '+';
    transform: translateY(-50%);
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }`}
`;

export const AddListInput = styled.input`
  height: auto;
  padding: ${spacing.smallPlus} ${spacing.huge};
  margin-bottom: 0;
  border-color: ${palette.coolGrey2};
  border-top: none;
  font-size: ${fontSizes.regular};
  box-shadow: none;

  &:focus {
    border-top: none;
    border-color: ${palette.coolGrey2};
    box-shadow: none;
    padding-left: ${spacing.regularPlus};
  }
`;

export const Title = styled.h2`
  margin-bottom: ${spacing.small};
  font-size: ${fontSizes.regularPlus};
  text-transform: uppercase;
  color: ${palette.brightBlue};
  font-family: Roboto Condensed;
`;

export const Description = styled.p`
  margin-bottom: 0;
  color: ${palette.darkGrey};
  font-size: ${fontSizes.regular};
`;

export const ListsWrapper = styled.div`
  flex: 1;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  overflow: auto;
`;

export const ListItem = styled.button`
  display: block;
  width: 100%;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  color: ${({ isSelected }) => (isSelected ? palette.white : palette.darkGrey)};
  font-size: ${fontSizes.regular};
  text-align: left;
  cursor: ${({ isSelected }) => (isSelected ? 'initial' : 'pointer')};
  ${({ isSelected }) => isSelected && `background: ${palette.darkBlue};`}
  appearance: none;
  border-radius: 0;
  outline: none;

  ${({ isSelected }) =>
    !isSelected && `&:hover { background: ${palette.brightBlueWithAlpha}; }`}
`;

export const EmptyMessage = styled.p`
  color: ${palette.coolGrey2};
  margin-top: ${spacing.huge};
  text-align: center;
`;

export const StyledButton = withStyles({
  root: {
    minWidth: 'unset',
    width: '100%',
  },
  outlined: {
    borderRadius: 0,
    color: palette.darkBlue,
    border: `2px solid ${palette.darkBlue}`,
  },
})(Button);
