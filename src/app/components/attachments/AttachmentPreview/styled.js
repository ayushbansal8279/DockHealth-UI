import { Dialog } from '@mui/material';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';
import palette from 'styles/palette';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';


export const AttachmentPreviewDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 5px;
    max-width: 85%;
    overflow-y: 'hidden';
  }
`;

export const AttachmentPreviewContent = styled.div`
  max-height: 50rem;
  min-height: 2rem;
  overflow-y: auto;

  && > * {
    min-height: 2rem;
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
  align-items: ${(props) => props.alignItems ?? 'flex-start'};
  display: flex;
  flex: 1;
  flex-direction: ${(props) => props.direction ?? 'row'};
  justify-content: ${(props) => props.justify ?? 'flex-start'};
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

  ${(props) =>
    props.disabled
      ? 'cursor: not-allowed;'
      : '&:hover { filter: brightness(0.8); }'}
`;

export const AttachmentPreviewHeaderLabel = styled.div`
  color: ${palette.white};
  font-size: ${(props) => (props.big ? 2 : 1)}rem;
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
  margin: 0.5rem;
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

export const CropperContainer = styled.div`
  margin: 0.5rem;
  max-height: 55.5rem;
  position: relative;
`;

export const CropperControlsContainer = styled.div`
  align-items: center;
  background-color: ${palette.veryDarkBlue};
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-start;
  padding: 0.75rem 1rem;
  min-height: auto;
  margin-top: -0.5rem;
`;

export const CropperButton = styled.button`
  align-items: center;
  background-color: ${palette.primaryBlue};
  border: none;
  border-radius: 4px;
  color: ${palette.white};
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  justify-content: center;
  padding: -0.5rem 1rem;
  transition: background-color 0.25s ease-out;
  white-space: nowrap;

  &:hover {
    background-color: ${palette.primaryBlueDark || palette.primaryBlue};
  }

  &:disabled {
    background-color: ${palette.unknownGrey6};
    cursor: not-allowed;
  }
`;

export const CropperToggleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const CropperToggleLabel = styled.label`
  color: ${palette.white};
  cursor: pointer;
  font-size: 0.875rem;
  vertical-align: middle;
`;

export const CropperToggleInput = styled.input`
  cursor: pointer;
  margin: 0;
  vertical-align: middle;
`;

export const AttachmentPreviewFooter = styled.div`
  align-items: center;
  background-color: ${palette.veryDarkBlue};
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid ${palette.unknownGrey6};
`;

export const SaveButton = styled.button`
  background-color: ${palette.primaryBlue};
  border: none;
  border-radius: 4px;
  color: ${palette.white};
  cursor: pointer;
  font-size: 16px;
  padding: 0.5rem 1.5rem;
  transition: background-color 0.25s ease-out;
  margin-left: 0.75rem;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${palette.primaryBlueDark || palette.primaryBlue};
  }

  &.cancel {
    background-color: ${palette.unknownGrey6};
    
    &:hover {
      background-color: ${palette.unknownGrey5 || palette.unknownGrey6};
    }
  }
`;

export const StyledEditIcon = styled(EditIcon)`
  margin-right: 0.5rem;
  font-size: 16px;
`;

export const StyledCancelIcon = styled(CancelIcon)`
  margin-right: 0.5rem;
  font-size: 16px;
`;