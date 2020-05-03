import { Dialog } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import styled from 'styled-components';
import palette from 'styles/palette';

export const AttachmentPreviewDialog = withStyles({
  paper: {
    borderRadius: 0,
    maxWidth: '60.5rem',
    overflowY: 'hidden',
  },
})(Dialog);

export const AttachmentPreviewContent = styled.div`
  max-height: 59rem;
  min-height: 6rem;
  overflow-y: auto;

  && > * {
    min-height: 6rem;
  }
`;

export const AttachmentPreviewFlexContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const AttachmentPreviewHeader = styled.div`
  align-items: center;
  background-color: ${palette.veryDarkBlue};
  display: flex;
  flex-flow: row nowrap;
  height: 5rem;
  justify-content: space-between;
  padding: 1.5rem;
  width: 100%;
`;

export const AttachmentPreviewHeaderSection = styled.div`
  align-items: ${props => props.alignItems ?? 'flex-start'};
  display: flex;
  flex: 1;
  flex-direction: ${props => props.direction ?? 'row'};
  justify-content: ${props => props.justify ?? 'flex-start'};
  max-width: 33.3333%;
`;

export const AttachmentPreviewHeaderAnchor = styled.a`
  align-items: center;
  display: flex;
  cursor: pointer;
  filter: brightness(1);
  justify-content: center;
  transition: filter 0.25s ease-out;
  will-change: filter;

  ${props =>
    props.disabled
      ? 'cursor: not-allowed;'
      : '&:hover { filter: brightness(0.8); }'}
`;

export const AttachmentPreviewHeaderLabel = styled.div`
  color: ${palette.white};
  font-size: ${props => (props.big ? 2 : 1)}rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AttachmentPreviewHeaderButton = styled(
  AttachmentPreviewHeaderLabel,
)`
  cursor: pointer;
  transition: filter 0.25s ease-out;

  &:hover {
    filter: brightness(0.8);
  }
`;

export const AttachmentPreviewHeaderIconContainer = styled.div`
  margin: 0 0.5rem;
`;

export const AttachmentPreviewHeaderSmallLabel = styled(
  AttachmentPreviewHeaderLabel,
)`
  color: ${palette.unknownGrey6};
  font-size: 0.875rem;
`;

export const AttachmentPreviewImage = styled.img`
  box-sizing: border-box;
  margin: 1.5rem;
  max-height: 55.5rem;
  object-fit: contain;
`;

export const AttachmentPreviewAudio = styled.audio`
  margin: 1.5rem;
  width: 100%;
`;

export const StyledPdfDocument = styled(Document)`
  align-items: center;
  background-color: ${palette.unknownGrey5};
  display: flex;
  flex-flow: column nowrap;
`;

export const StyledPdfPage = styled(Page)`
  overflow-x: hidden;
  position: relative;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const UnsupportedFileContainer = styled.div`
  align-items: center;
  display: flex;
  height: 13.5rem;
  justify-content: center;
  padding: 1rem;
`;
