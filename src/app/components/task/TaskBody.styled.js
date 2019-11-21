import styled, { keyframes } from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';

export const PatientsTasklistNew = styled.div`
  color: #d9036b;
  font-size: 0.625rem;
  font-variant: small-caps;
  left: 0;
  position: absolute;
  top: -0.75rem;
`;

export const PatientsTasklistDescription = styled.div`
  box-sizing: border-box;
  color: #303538;
  display: inline-block;
  font-size: 1.25rem;
  font-weight: bold;
  line-height: 1;
  flex: 1;
  max-width: 450px;
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
  height: 2.5rem;
  padding-bottom: 0.1875rem;
  padding-right: 24px;
  min-width: 218px;
  width: 218px;
`;

const patientsTaskListDateAnimation = keyframes`
  0%, 20%, 100% {
    opacity: 0;
  }

  25%, 95% {
    opacity: 1
  }
`;

export const PatientsTasklistDate = styled.div`
  align-items: flex-end;
  color: ${props => (props.overdue ? '#f40707' : '#303538')};
  display: flex;
  font-size: 0.875rem;
  height: 2.5rem;
  padding-bottom: 0.1875rem;
`;

export const AnimatedPatientsTasklistDate = styled(PatientsTasklistDate)`
  animation: ${patientsTaskListDateAnimation} 3s ease 0s 1 normal forwards;
  color: #20b255;
`;

export const PatientTasklistContainer = styled(Grid)`
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

export const ArchiveButton = styled.div`
  align-items: center;
  border: 1px solid #2aadce;
  border-radius: 0.25rem;
  color: #0ca1c7;
  cursor: pointer;
  display: flex;
  font-size: 0.75rem;
  height: 1.6875rem;
  padding: 0 0.5rem;
`;

export const RolloverNestedListItemText = styled.div`
  background-color: #05adec;
  border-radius: 0;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  max-width: 50vw;
  padding: 0.375rem 0.5rem;
  pointer-events: none;
  word-break: break-word;
`;

export const RolloverPopover = styled(Popover)`
  && {
    pointer-events: none;
  }

  && > div {
    border-radius: 0;
  }
`;

export const TaskBodyChevronContainer = styled.div`
  align-items: flex-end;
  display: flex;
  height: 2.5rem;
  justify-content: flex-start;
  margin-right: ${props => (props.isSubtask ? 0 : 4)}px;
  min-width: 2.4375rem;
  padding-bottom: 0.1875rem;
  width: 2.4375rem;
`;
