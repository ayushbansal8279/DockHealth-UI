import { Typography, Grid, IconButton, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const LabelBox = styled(Box)`
  cursor: pointer;
`;

export const ToolbarContainer = styled.div`
  display: block;
  background-color: ${palette.coolGrey4};
  color: ${palette.coolGrey1};
  width: calc(100vw - 83px);
  position: sticky;
  left: 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 13;
`;
