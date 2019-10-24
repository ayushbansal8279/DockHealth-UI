import styled from 'styled-components';

export const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 10px;
  font-variant: small-caps;
`;

export const PatientsTasklistDescription = styled.div`
  color: #303538;
  display: inline-block;
  font-size: 16px;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PatientsTasklistStrikeThrough = styled.div`
  background-color: #303538;
  left: 0;
  height: 1px;
  position: absolute;
  top: 50%;
  transition: width 0.3s ease-out 0.1s;
  width: ${props => (props.active ? 100 : 0)}%;
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
