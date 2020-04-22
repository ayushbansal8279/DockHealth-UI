import { omit } from 'ramda';
import React, { useRef } from 'react';
import { Link } from 'react-router';
import useBoolean from 'hooks/useBoolean';
import ChevronRightIcon from 'img/chevron-right.svg';
import palette, { getPriorityColor } from 'styles/palette';
import { PriorityContainer, PriorityDot } from '../common/Priority';
import UniversalTooltip from '../common/UniversalTooltip';
import {
  AnimatedPatientsTasklistDate,
  ArchiveButton,
  GreenPatientsTasklistDate,
  PatientsTasklistDate,
  PatientTasklistPatient,
  TaskBodyChevronContainer,
  TaskDateContainer,
  TaskStatusContainer,
} from './TaskBody.styled';

const DueDateComponent = ({
  dueDate,
  formattedDueDate,
  hasNewComment,
  completedDateTime,
  isTaskTimingOut,
  ...otherProps
}) => {
  const props = omit(['isSubtask'], otherProps);

  if (isTaskTimingOut) {
    return (
      <AnimatedPatientsTasklistDate {...props}>
        Nice work!
      </AnimatedPatientsTasklistDate>
    );
  }

  if (hasNewComment && completedDateTime) {
    return (
      <GreenPatientsTasklistDate {...props}>
        New comment
      </GreenPatientsTasklistDate>
    );
  }

  if (dueDate && !completedDateTime) {
    return (
      <PatientsTasklistDate {...props}>{formattedDueDate}</PatientsTasklistDate>
    );
  }

  return null;
};

const getWorkflowStatusName = workflowStatus => {
  switch (workflowStatus) {
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'PLANNED':
      return 'Planned';
    case 'ON_HOLD':
      return 'On Hold';
    default:
      return 'No Status';
  }
};

export default ({
  taskDrawerOpen,
  hidePatient,
  patient,
  isSubtask,
  dueDate,
  isTaskTimingOut,
  formattedDueDate,
  isTaskArchivable,
  status,
  readOnly,
  overdue,
  archiveTask,
  workflowStatus,
  hasNewComment,
  completedDateTime,
}) => {
  const [
    isStatusTooltipOpen,
    showStatusTooltip,
    hideStatusTooltip,
  ] = useBoolean(false);
  const statusReference = useRef(null);

  return (
    <>
      {!taskDrawerOpen && !hidePatient && (
        <PatientTasklistPatient>
          {patient && !isSubtask && (
            <Link
              to={`/patient/${patient.patientIdentifier}`}
              style={{ color: palette.lighterCyanBlue, fontSize: '0.875rem' }}
            >
              <div>
                {`${patient?.lastName}, ${patient?.firstName} ${patient?.mrn ??
                  ''}`.trim()}
              </div>
            </Link>
          )}
        </PatientTasklistPatient>
      )}
      {!taskDrawerOpen && (
        <>
          <TaskDateContainer isTaskArchivable={isTaskArchivable}>
            <DueDateComponent
              completedDateTime={completedDateTime}
              dueDate={dueDate}
              formattedDueDate={formattedDueDate}
              hasNewComment={hasNewComment}
              isSubtask={isSubtask}
              isTaskTimingOut={isTaskTimingOut}
              overdue={overdue}
            />
          </TaskDateContainer>
          <TaskStatusContainer isTaskArchivable={isTaskArchivable}>
            <PriorityContainer archivable={isTaskArchivable}>
              {isTaskArchivable ? (
                <ArchiveButton onClick={archiveTask}>Archive</ArchiveButton>
              ) : (
                status !== 'COMPLETE' && (
                  <>
                    <PriorityDot
                      ref={statusReference}
                      onMouseEnter={showStatusTooltip}
                      onMouseLeave={hideStatusTooltip}
                      color={getPriorityColor(workflowStatus)}
                    />
                    <UniversalTooltip
                      open={isStatusTooltipOpen}
                      anchorEl={statusReference.current}
                      placement="bottom"
                    >
                      {getWorkflowStatusName(workflowStatus)}
                    </UniversalTooltip>
                  </>
                )
              )}
            </PriorityContainer>
          </TaskStatusContainer>
          {!readOnly && (
            <TaskBodyChevronContainer isSubtask={isSubtask}>
              <img
                style={{
                  height: '10px',
                }}
                src={ChevronRightIcon}
                alt="Chevron icon"
              />
            </TaskBodyChevronContainer>
          )}
        </>
      )}
    </>
  );
};
