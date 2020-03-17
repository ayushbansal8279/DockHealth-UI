import styled from 'styled-components';
import { UniversalStyledInput } from '../userProfileView/UniversalStyledInput';

export const PanelActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0.5rem 0;
`;

export const SingleFormPanelContainer = styled.div`
  align-content: flex-start;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;
`;

export const SmallPatientInput = styled(UniversalStyledInput)``;

export const PatientInput = styled(UniversalStyledInput)`
  && {
    grid-column-end: span 3;
  }
`;
