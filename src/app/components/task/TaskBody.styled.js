import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

export const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 10px;
  font-variant: small-caps;
  left: 0;
  position: absolute;
  top: -8px;
`;

export const PatientsTasklistDescription = styled.div`
  color: #303538;
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PatientsTasklistStrikeThrough = styled.div`
  background-color: ${props => (props.hasDescription ? '#303538' : '#ababb2')};
  left: 0;
  height: 1px;
  position: absolute;
  top: 50%;
  transition: width 0.3s ease-out 0.1s;
  width: ${props => (props.active ? 100 : 0)}%;
`;

export const PatientsTasklistInfo = styled.div`
  color: #5e6366;
  font-size: 12px;
  line-height: 1.15;
`;

export const PatientsTasklistDate = styled.div`
  font-size: 12px;
  color: #303538;
`;

export const PatientTasklistContainer = styled(Grid)`
  align-self: center;
  padding-right: 24px;
  position: relative;
`;

export const CompletedBy = styled.div`
  align-items: flex-end;
  display: flex;
  height: ${props => (props.isCompleted ? 20 : 0)}px;
  overflow: hidden;
  transition: height 0.1s ease-out;
  transition-delay: ${props => (props.isCompleted ? '0' : '0.4')}s;
  width: 100%;

  > span {
    color: #20b255;
    font-size: 12px;
    transition: transform 0.4s ease-out;
    transition-delay: ${props => (props.isCompleted ? 0.1 : 0)}s;
    transform: translateX(${props => (props.isCompleted ? 0 : -100)}%);
  }
`;
