import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import palette from 'styles/palette';

export const HeaderContainer = styled.div`
  height: 63px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: ${palette.darkBlue};
  color: ${palette.white};
`;

export const HeaderText = styled.p`
  margin: 0;
  color: ${palette.coolGrey2};
  text-transform: uppercase;
`;

export const StyledIconButton = withStyles({
  root: {
    color: 'inherit',
  },
})(IconButton);
