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
  PatientsTasklistDate,
  PatientTasklistPatient,
  TaskBodyChevronContainer,
  TaskDateContainer,
  TaskStatusContainer,
} from './TaskBody.styled';

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
}) => (
  <>
    {!taskDrawerOpen && !hidePatient && (
      <PatientTasklistPatient>
        {patient && !isSubtask && (
          <Link
            to={`/patient/${patient.patientId}`}
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
      <TaskDateContainer isTaskArchivable={isTaskArchivable}>
        {dueDate && !isTaskTimingOut && (
          <PatientsTasklistDate overdue={overdue}>
            {formattedDueDate}
          </PatientsTasklistDate>
        )}
        {isTaskTimingOut && (
          <AnimatedPatientsTasklistDate>
            Nice work!
          </AnimatedPatientsTasklistDate>
        )}
      </TaskDateContainer>
    )}
    {!taskDrawerOpen && (
      <>
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
