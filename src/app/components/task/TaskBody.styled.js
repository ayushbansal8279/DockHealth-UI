import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

export const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 0.625rem;
  font-variant: small-caps;
  left: 0;
  position: absolute;
  top: -0.75rem;
`;

export const PatientsTasklistDescription = styled.div`
  color: #303538;
  display: inline-block;
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1;
  padding-bottom: 0.125rem;
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
  font-size: 0.875rem;
  line-height: 1;
  padding-bottom: 0.1875rem;
`;

export const PatientTasklistPatient = styled.div`
  align-items: flex-end;
  display: flex;
  line-height: 12px;
  margin-right: 24px;
  padding-bottom: ${props => props.elementPaddingBottom};
  min-width: 140px;
  width: 140px;
`;

export const PatientsTasklistDate = styled.div`
  font-size: 0.875rem;
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
  height: ${props => (props.isCompleted ? 0.875 : 0)}rem;
  overflow: hidden;
  transition: height 0.1s ease-out;
  transition-delay: ${props => (props.isCompleted ? '0' : '0.4')}s;
  width: 100%;

  > span {
    color: #20b255;
    font-size: 0.875rem;
    line-height: 1;
    transition: transform 0.4s ease-out;
    transition-delay: ${props => (props.isCompleted ? 0.1 : 0)}s;
    transform: translateX(${props => (props.isCompleted ? 0 : -100)}%);
  }
`;

export const MemberPickerContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 8px;
  width: 4rem;
`;
