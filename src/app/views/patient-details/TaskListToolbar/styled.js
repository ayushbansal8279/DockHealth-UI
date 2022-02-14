import styled from 'styled-components';
import palette from 'styles/palette';
import { Box, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export const ListsToolbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 50px;
`;
export const LabelBox = styled(Box)`
  cursor: pointer;
`;

export const ListsTabsContainer = styled.div`
  display: flex;
  flex: 1 0 0;
  overflow: hidden;
`;

export const MenuText = styled.p`
  margin-bottom: 0;
  color: ${palette.mediumGrey};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

export const ToolbarLabel = withStyles({
  root: {
    color: palette.coolGrey1,
    display: 'inline-block',
  },
})(Typography);
