import styled from 'styled-components';
import palette from 'styles/palette';

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
