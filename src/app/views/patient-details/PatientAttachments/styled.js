import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const PatientAttachmentsWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  padding: ${spacing.regular} ${spacing.huge};
  background-color: ${props =>
    props.isDragActive ? palette.coolGrey3 : 'transparent'};
  border: 1px solid
    ${props => (props.isDragActive ? palette.coolGrey2 : `transparent`)};
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

export const DropzoneInfoText = styled.p`
  margin-bottom: 12px;
  color: ${palette.coolGrey2};
`;
