/* eslint-disable import/prefer-default-export */
// import palette from 'styles/palette';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';

export const StyledIconButton = withStyles({
  root: {
    color: 'inherit',
  },
})(IconButton);

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 16px 12px;
  zindex: 0;
`;

export const ColorSet = {
  '--sendbird-light-primary-500': '#00487c',
  '--sendbird-light-primary-400': '#4bb3fd',
  '--sendbird-light-primary-300': '#213a56',
  '--sendbird-light-primary-200': '#0496ff',
  '--sendbird-light-primary-100': '#027bc5',
};
