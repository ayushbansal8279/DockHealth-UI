import styled from 'styled-components';
import palette from 'styles/palette';

export const TextEditorContainerStyled = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  background: #f7fafb;
  text-align: left;
`;

export const InfoHeaderAttachmentsTextStyled = styled.p`
  color: ${palette.coolGrey1};
  width: 100%;
  margin-top: 20px;
  margin-bottom: 5px;
  font-weight: 400;
  text-align: left;
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
  text-align: left;
`;

export const AddEditLabelStyled = styled.span`
  text-align: right;
  color: ${palette.brightBlue};
  text-decoration: underline;
  text-decoration-color: transparent;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover,
  &:focus {
    text-decoration-color: ${palette.brightBlue};
  }
`;

export const AddEditContactLink = styled.div`
  margin-left: auto;
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

export const InfoHeaderTextStyled = styled.p`
  color: ${palette.coolGrey9};
  font-family: 'Outfit';
  font-weight: 600;
  margin: 0;
`;

export const LabelName = styled.span`
  color: ${palette.coolGrey1};
  width: 100%;
  font-weight: 800;
`;

export const LabelValue = styled.span`
  color: ${palette.coolGrey1};
  width: 100%;
  font-weight: 400;
`;

export const ContactInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
