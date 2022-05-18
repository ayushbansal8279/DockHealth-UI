import styled from 'styled-components';
import palette from 'styles/palette';

export const TextEditorContainerStyled = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  background: #f7fafb;
`;

export const InfoHeaderTextStyled = styled.p`
  width: 100%;
  color: ${palette.coolGrey9};
  font-family: 'Montserrat';
  font-weight: 600;
  margin: 0;
  padding-top: 1.5rem;
`;

export const TextWaringStyled = styled.p`
  padding-top: 1.5rem;
  color: #ff0000;
  width: 100%;
  margin-bottom: 0.5rem;
`;

export const CheckboxContainerStyled = styled.div`
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
`;

export const AttachmentContainerStyled = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  border: 1px solid ${palette.coolGrey3};
  padding: 0.5rem;
`;

export const AttachmentsContainerStyled = styled.div`
  display: flex;
  gap: 0.2rem;
  width: 100%;
  justify-content: flex-start;
`;

export const InputContainerStyled = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;
