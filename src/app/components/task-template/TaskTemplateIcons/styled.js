/* eslint-disable @typescript-eslint/no-unused-vars */
import styled, { keyframes, css } from 'styled-components';
import { Grid } from '@mui/material';
import palette, { featurePalette } from 'styles/palette';

export const GridImg = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  ${({ matched }) =>
    matched && `background: ${featurePalette.globalSearchHighlight};`}
`;

export const DisabledLink = styled.span``;

export const CommentsWrapper = styled.div`
  width: fit-content;
  opacity: ${({ hasComments, isBorderColumnItem }) =>
    hasComments || isBorderColumnItem ? 1 : 0};
`;

export const CommentsContainer = styled.div`
width: 100%;
&:hover {
  & ${CommentsWrapper} {
    opacity: 1;
  }
`;

export const LabelWrapper = styled.div`
  width: fit-content;
  opacity: ${({ isBorderColumnItem }) => (isBorderColumnItem ? 1 : 0)};
`;

export const LabelContainer = styled.div`
width: 100%;
&:hover {
  & ${LabelWrapper} {
    opacity: 1;
  }
`;
export const FilesWrapper = styled.div`
  width: fit-content;
  opacity: ${({ attachments, isBorderColumnItem }) =>
    attachments || isBorderColumnItem ? 1 : 0};
`;

export const FilesContainer = styled.div`
width: 100%;
&:hover {
  & ${FilesWrapper} {
    opacity: 1;
  }
`;
