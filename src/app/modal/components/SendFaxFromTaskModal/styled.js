import styled from 'styled-components';
import palette from 'styles/palette';

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
export const TextWaringStyled = styled.p`
  padding-top: 1.5rem;
  color: #ff0000;
  font-size: 16px;
  width: 100%;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;
export const InfoHeaderAttachmentsTextStyled = styled.p`
  color: ${palette.coolGrey1};
  font-weight: 400;
  margin: 0;
`;

export const InputContainerStyled = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;
