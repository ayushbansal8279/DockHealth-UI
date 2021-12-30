import { Box } from '@material-ui/core';
import styled from 'styled-components';
import palette from 'styles/palette';

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
  justify-content: space-between;
  align-items: center;
  z-index: 13;
  padding: 18px 24px;
`;
