/* eslint-disable @typescript-eslint/no-unused-vars */
import styled, { keyframes, css } from 'styled-components';
import { Grid } from '@mui/material';
import palette, { featurePalette } from 'styles/palette';

export const GridImg = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ matched }) =>
    matched && `background: ${featurePalette.globalSearchHighlight};`}
`;

export const DisabledLink = styled.span``;
