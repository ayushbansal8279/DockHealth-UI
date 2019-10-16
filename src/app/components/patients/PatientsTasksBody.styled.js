import styled from 'styled-components';

export const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 10px;
  font-variant: small-caps;
`;

export const PatientsTasklistDescription = styled.div`
  font-size: 16px;
  color: #303538;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ isComplete }) => isComplete && 'text-decoration: line-through;'}
`;

export const PatientsTasklistInfo = styled.div`
  font-size: 12px;
  color: #5e6366;
`;

export const PatientsTasklistComments = styled.div`
  font-size: 12px;
  color: #0ca1c7;
`;

export const PatientsTasklistDate = styled.div`
  font-size: 16px;
  color: #303538;
`;
