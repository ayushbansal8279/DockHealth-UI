/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const PatientAttachmentsWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  padding: ${spacing.regular} ${spacing.huge};
  background-color: ${props =>
    props.isDragActive ? palette.coolGrey3 : 'transparent'};
  border: ${props =>
    props.isDragActive ? `solid 1px ${palette.coolGrey2}` : `none`};
`;

export const NoteInput = styled.input`
  height: 52px;
  width: 100%;
  margin: ${spacing.regular} 0;
  background-color: ${palette.coolGrey4};
  border: 1px solid ${palette.coolGrey3};
  box-shadow: none;
  color: ${palette.mediumGrey};
  padding: ${spacing.regular};

  &:focus,
  &:active {
    background-color: ${palette.coolGrey4};
    border: 1px solid ${palette.coolGrey3};
    box-shadow: none;
    outline: none;
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
