import styled from 'styled-components';
import { Skeleton } from '@material-ui/lab';
import { Popover } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const StyledPopover = withStyles({
  paper: {
    border: 'none',
    boxShadow: '0px 0px 11px rgba(0, 0, 0, 0.15)',
    minWidth: 230,
    width: ({ width }) => `${width || 230}px`,
  },
})(Popover);

export const StyledButton = styled.button`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  text-align: left;
`;

export const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;
  margin-left: ${spacing.tiny};
`;

export const InputBox = styled.div`
  display: flex;
  padding: ${spacing.smallPlus} ${spacing.smallPlus};
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  font-family: 'Roboto Condensed', sans-serif;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;

export const ListContainer = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  border-top: ${({ withBorder }) =>
    withBorder ? `1px solid ${palette.coolGrey2}` : '0px'};
`;

export const Row = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  color: ${palette.coolGrey1};
  font-family: 'Roboto Condensed', sans-serif;
  ${({ isHovered }) => isHovered && `background: ${palette.blueGrey};`}

  &:not(:last-of-type) {
    margin-bottom: ${spacing.tiny};
  }

  &:hover {
    background-color: rgba(193, 204, 218, 0.25);
  }
`;

export const UnassignRow = styled(Row)`
  padding: ${spacing.small};
`;

export const RefineSearchRow = styled(Row)`
  padding: ${spacing.small};
  color: ${palette.oPlusRed};
`;

export const UnassignRowContainer = styled.div`
  border-bottom: ${({ withBorder }) =>
    withBorder ? `1px solid ${palette.coolGrey2}` : '0px'};
`;

export const LoaderItem = withStyles({
  root: {
    margin: `${spacing.regular} ${spacing.large}`,
  },
})(Skeleton);

export const LoaderContainer = styled.div`
  padding: ${spacing.smallPlus} 0;
`;
