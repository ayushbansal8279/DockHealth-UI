import { AnimatePresence } from 'framer-motion';
import React from 'react';

import ReactHtmlParser from 'react-html-parser';
import { mentionifyAndLinkifyTaskText } from '../../helpers/utility-functions';
import EnvelopeIcon from '../../img/envelope.svg';
import UpdateIndicatorIcon from '../../img/update-indicator.svg';
import {
  CompletedBy,
  EditedTaskDescriptionLabel,
  PatientsTasklistDescription,
  PatientsTasklistInfo,
  PatientsTaskListInnerDescription,
  PatientsTasklistNew,
  PatientsTasklistStrikeThrough,
  PatientTasklistContainer,
  TaskDescriptionOuterContainer,
} from './TaskBody.styled';

const animationProperties = {
  variants: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: '0.625rem', opacity: 1 },
  },
  initial: 'hidden',
  exit: 'hidden',
  animate: 'visible',
  transition: { ease: 'backInOut', duration: 0.25 },
};

export default ({
  isSubtask,
  read,
  task,
  taskDescriptionReference,
  onTaskDescriptionMouseEnter,
  onTaskDescriptionMouseLeave,
  description,
  taskInnerDescriptionReference,
  status,
  createdDateTime,
  updatedDateTime,
  updated,
  formattedCreationDate,
  formattedUserName,
  completedByContent,
  countInfoContent,
  members,
}) => {
  return (
    <PatientTasklistContainer isSubtask={isSubtask}>
      <AnimatePresence>
        {!read && (
          <PatientsTasklistNew {...animationProperties}>
            NEW
          </PatientsTasklistNew>
        )}
      </AnimatePresence>
      <TaskDescriptionOuterContainer>
        {task.sourceMessage && (
          <img
            src={EnvelopeIcon}
            alt="Email"
            style={{
              paddingRight: '5px',
            }}
          />
        )}
        <PatientsTasklistDescription
          ref={taskDescriptionReference}
          onMouseEnter={onTaskDescriptionMouseEnter}
          onMouseLeave={onTaskDescriptionMouseLeave}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <PatientsTaskListInnerDescription
              hasDescription={Boolean(description)}
              ref={taskInnerDescriptionReference}
            >
              {ReactHtmlParser(
                mentionifyAndLinkifyTaskText({
                  members,
                  value: description || 'Unnamed task',
                }),
              )}
              <PatientsTasklistStrikeThrough
                hasDescription={Boolean(description)}
                active={status === 'COMPLETE'}
              />
            </PatientsTaskListInnerDescription>
          </span>
          {createdDateTime !== updatedDateTime && (
            <EditedTaskDescriptionLabel>(edited)</EditedTaskDescriptionLabel>
          )}
        </PatientsTasklistDescription>
      </TaskDescriptionOuterContainer>
      <div>
        <PatientsTasklistInfo>
          {updated && (
            <img
              src={UpdateIndicatorIcon}
              alt="Updated"
              style={{
                width: '17px',
                height: '17px',
                paddingRight: '2px',
              }}
            />
          )}
          {`Assigned by ${formattedUserName} at ${formattedCreationDate}${countInfoContent}`}
        </PatientsTasklistInfo>
      </div>
      <div>
        <CompletedBy isCompleted={status === 'COMPLETE' && completedByContent}>
          <span>{completedByContent}</span>
        </CompletedBy>
      </div>
    </PatientTasklistContainer>
  );
};
