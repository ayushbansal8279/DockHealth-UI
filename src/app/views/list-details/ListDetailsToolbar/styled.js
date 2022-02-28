import { Box } from '@material-ui/core';
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const LabelBox = styled(Box)`
  cursor: pointer;
`;

export const ToolbarContainer = styled.div`
  display: block;
  background-color: ${palette.coolGrey4};
  color: ${palette.coolGrey1};
  position: sticky;
  left: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 13;
  padding: ${spacing.small} ${spacing.large};
`;
