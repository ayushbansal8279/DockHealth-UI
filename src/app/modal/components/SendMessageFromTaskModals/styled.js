import styled from 'styled-components';
import palette from 'styles/palette';

export const InfoHeaderAttachmentsTextStyled = styled.p`
  color: ${palette.coolGrey1};
  width: 100%;
  margin-top: 20px;
  margin-bottom: 5px;
  font-weight: 400;
`;

export const AttachmentContainerStyled = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  border: 1px solid ${palette.coolGrey3};
  padding: 0.5rem;
  font-size: 14px;
`;

export const AttachmentsContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  justify-content: flex-start;
`;

export const InputContainerStyled = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

export const CheckboxContainerStyled = styled.div`
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
`;

export const IncludeContainerStyled = styled.div`
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const TextEditorContainerStyled = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  background: #f7fafb;
`;

export const InfoHeaderTextStyled = styled.p`
  color: ${palette.coolGrey9};
  font-family: 'Montserrat';
  font-weight: 600;
  margin: 0;
`;
