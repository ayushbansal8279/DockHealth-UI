import { Popover } from '@material-ui/core';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import palette from 'styles/palette';

export const TaskBodyMainContainer = styled.div`
  align-items: center;
  cursor: ${props => (props.readOnly ? 'default' : 'pointer')};
  display: flex;
  height: 100%;
`;

export const PatientsTasklistNew = styled(motion.div)`
  color: ${palette.vividPink};
  font-size: 0.625rem;
  font-variant: small-caps;
  line-height: 1;
`;

export const PatientsTasklistDescription = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: ${palette.unknownGrey1};
  display: inline-flex;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.25;
  flex: 1;
  max-width: ${props => {
    let width = 27.5;

    if (props.isSubtask) {
      width -= 2.375;
    }

    if (props.paneled) {
      width -= 2;
    }

    return width;
  }}rem;
  padding-bottom: 0.125rem;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PatientsTaskListInnerDescription = styled.span`
  ${props => !props.hasDescription && `color: ${palette.unknownGrey5};`}
  position: relative;
`;

export const PatientsTasklistStrikeThrough = styled.div`
  background-color: ${props =>
    props.hasDescription ? palette.unknownGrey1 : palette.unknownGrey5};
  left: 0;
  height: 1px;
  position: absolute;
  top: 50%;
  transition: width 0.3s ease-out 0.1s;
  width: ${props => (props.active ? 100 : 0)}%;
`;

export const PatientsTasklistInfo = styled.div`
  color: ${palette.unknownGrey7};
  font-size: 0.875rem;
  line-height: 1.15;
  padding-bottom: 0.1875rem;
  white-space: nowrap;
}
`;

export const PatientTasklistPatient = styled.div`
  align-items: flex-end;
  align-self: flex-end;
  display: flex;
  line-height: 1.625rem;
  height: 100%;
  padding-bottom: 0.1875rem;
  margin-right: 0.625rem;
  min-width: 13rem;
  width: 13rem;
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
  color: ${props => (props.overdue ? palette.error : palette.unknownGrey1)};
  display: flex;
  font-size: 0.875rem;
  height: 2.5rem;
  padding-bottom: 0.1875rem;
`;

export const GreenPatientsTasklistDate = styled(PatientsTasklistDate)`
  color: ${palette.memberGreen};
`;

export const AnimatedPatientsTasklistDate = styled(GreenPatientsTasklistDate)`
  animation: ${patientsTaskListDateAnimation} 3s ease 0s 1 normal forwards;
`;

export const PatientTasklistContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin-right: 0.625rem;
  padding: 0.25rem 0;
  position: relative;
  ${props => {
    let width = 27.5;

    if (props.isSubtask) {
      width -= 2.375;
    }

    if (props.paneled) {
      width -= 2;
    }

    return `min-width: ${width}rem; width: ${width}rem;`;
  }}
`;

export const CompletedBy = styled.div`
  align-items: flex-end;
  display: flex;
  height: ${props => (props.isCompleted ? 1 : 0)}rem;
  overflow: hidden;
  padding-bottom: ${props => (props.isCompleted ? '0.1875rem' : 0)};
  transition: all 0.1s ease-out;
  transition-delay: ${props => (props.isCompleted ? '0' : '0.4')}s;
  width: 100%;

  > span {
    color: ${palette.memberGreen};
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
  margin-right: 0.625rem;
  width: 3.4375rem;
`;

export const ArchiveButton = styled.div`
  align-items: center;
  border: 1px solid ${palette.lightCyanBlue};
  border-radius: 0.25rem;
  color: ${palette.lighterCyanBlue};
  cursor: pointer;
  display: flex;
  font-size: 0.75rem;
  height: 1.6875rem;
  padding: 0 0.5rem;
`;

export const RolloverNestedListItemText = styled.div`
  background-color: ${palette.midnightBlue};
  border-radius: 0;
  color: ${palette.white};
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
  align-items: center;
  align-self: flex-end;
  display: flex;
  height: 1.625rem;
  justify-content: center;
  min-width: 2.4375rem;
  padding-bottom: 0.1875rem;
  width: 2.4375rem;
`;

export const TaskDateContainer = styled.div`
  align-items: flex-end;
  align-self: flex-end;
  display: flex;
  height: 100%;
  line-height: 1.625rem;
  min-width: 11.25rem;
  width: 11.25rem;

  ${props =>
    props.isTaskArchivable &&
    `
    margin-Right: 0;
    min-Width: 8.5rem;
    width: 8.5rem;
  `}
`;

export const TaskStatusContainer = styled.div`
  align-self: flex-end;
  align-items: center;
  display: flex;
  height: 1.625rem;
  justify-content: center;
  min-width: ${props => (props.isTaskArchivable ? 5.1875 : 2.4375)}rem;
  width: ${props => (props.isTaskArchivable ? 5.1875 : 2.4375)}rem;
`;

export const TaskDescriptionOuterContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

export const EditedTaskDescriptionLabel = styled.span`
  color: ${palette.coolGrey2};
  font-size: 0.9rem;
  font-weight: normal;
  margin-left: 0.5ch;
`;
