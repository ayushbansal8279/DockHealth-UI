import styled from 'styled-components';
import spacing from 'styles/spacing';
import { IconButton, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import { Close } from '@material-ui/icons';
import { fontSizes } from 'styles/font';

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
  height: 210px;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  overflow: scroll;
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

export const CloseIconButton = withStyles({
  root: {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'block',
  },
})(IconButton);

export const CloseIcon = withStyles({
  root: {
    width: 16,
    height: 16,
  },
})(Close);

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
