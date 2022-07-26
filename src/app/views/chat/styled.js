import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import palette from 'styles/palette';
import styled from 'styled-components';

export const StyledIconButton = withStyles({
  root: {
    color: 'inherit',
  },
})(IconButton);

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  // padding: 16px 12px;
  zindex: 0;
`;

export const ColorSet = {
  '--sendbird-light-primary-500': '#00487c',
  '--sendbird-light-primary-400': '#4bb3fd',
  '--sendbird-light-primary-300': palette.midnightBlue,
  '--sendbird-light-primary-200': '#0496ff',
  '--sendbird-light-primary-100': '#027bce',
};

export const HeaderContainer = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: ${palette.darkBlue};
  color: ${palette.white};
`;

export const ChatContainer = styled.div`
  height: 90%;
  width: 100%;
`;
