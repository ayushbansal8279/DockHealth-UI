import React from 'react';
import { Link } from 'react-router';

import ChevronRightIcon from '../../img/chevron-right.svg';
import {
  priorityColor,
  PriorityContainer,
  PriorityDot,
} from '../common/Priority';
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
  isSubtask,
  isTaskTimingOut,
  ...props
}) => {
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

  if (dueDate && !isSubtask && !completedDateTime) {
    return (
      <PatientsTasklistDate {...props}>{formattedDueDate}</PatientsTasklistDate>
    );
  }

  return null;
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
  return (
    <>
      {!taskDrawerOpen && !hidePatient && (
        <PatientTasklistPatient>
          {patient && !isSubtask && (
            <Link
              to={`/patient/${patient.patientIdentifier}`}
              style={{ color: '#0ca1c7', fontSize: '0.875rem' }}
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
                  <PriorityDot color={priorityColor(workflowStatus)} />
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
