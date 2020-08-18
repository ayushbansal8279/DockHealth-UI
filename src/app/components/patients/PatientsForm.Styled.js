import styled from 'styled-components';
import { UniversalInput } from '../common/UniversalInput/UniversalInput';

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

export const SmallPatientInput = styled(UniversalInput)``;

export const PatientInput = styled(UniversalInput)`
  && {
    grid-column-end: span 3;
  }
`;
