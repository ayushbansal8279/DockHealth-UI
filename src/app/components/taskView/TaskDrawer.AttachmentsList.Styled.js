import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';

export const AddAttachmentButton = styled.button.attrs({ type: 'button' })`
  background-color: transparent;
  border-width: 0;
  border-radius: 0.25rem;
  color: ${palette.greyBlue};
  cursor: pointer;
  margin: 0 -0.25rem;
  padding: 0.1875rem;
  transition: background-color 0.25s ease-out;
  will-change: background-color;

  &:hover {
    background-color: ${opacify(palette.black, 0.05)};
  }
`;

export const AttachmentFileInput = styled.input.attrs({
  type: 'file',
})`
  height: 1px;
  left: -100vw;
  opacity: 0.01;
  position: absolute;
  top: -100vh;
  visibility: hidden;
  width: 1px;
`;

export const AttachmentListEntryRemove = styled.button.attrs({
  type: 'button',
})`
  align-items: center;
  background-color: transparent;
  border-width: 0;
  color: ${palette.error};
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  height: 1rem;
  line-height: 1rem;
  margin-left: 0.5ch;
  opacity: 0;
  transition: filter 0.25s ease-out, opacity 0.15s linear;
  will-change: filter, opacity;

  &:hover {
    filter: brightness(1.25);
  }
`;

export const AttachmentListEntry = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 0.25rem;

  &:hover ${AttachmentListEntryRemove} {
    opacity: 1;
  }
`;

export const AttachmentListEntryLabel = styled.button.attrs({
  type: 'button',
})`
  background-color: transparent;
  border-width: 0;
  color: ${palette.lighterCyanBlue};
  cursor: pointer;
  display: flex;
  transition: filter 0.25s ease-out;
  will-change: filter;

  &:hover {
    filter: brightness(1.25);
  }
`;

export const UploadingFileContainer = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 1rem;
  margin-top: 0.25rem;
`;

export const UploadingFileLabel = styled.div`
  margin-right: 0.25rem;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UploadingFileProgressBar = styled.div`
  background-color: ${palette.unknownGrey4};
  flex: 1;
  position: relative;
  height: 0.6875rem;
`;

export const UploadingFileCurrentProgress = styled.div`
  background-color: ${palette.lighterCyanBlue};
  left: 0;
  height: 100%;
  position: absolute;
  transition: width 0.2s ease-out;
  top: 0;
  will-change: width;
  width: ${props => props.uploadProgress ?? 0}%;
  z-index: 1;
`;
