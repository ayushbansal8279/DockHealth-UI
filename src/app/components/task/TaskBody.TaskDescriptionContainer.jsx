import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
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

const AnimatedPatientsTasklistInfo = ({ children }) => {
  const infoReference = useRef(null);
  const [animated, setAnimated] = useState(false);
  const referenceScrollWidth = infoReference.current?.scrollWidth;
  const referenceOffsetWidth = infoReference.current?.offsetWidth;

  const animationDuration =
    (referenceScrollWidth - referenceOffsetWidth) / 20 || 0;

  const stopPercentage = (100 * 0.5) / (animationDuration + 1);

  useEffect(() => {
    setAnimated(referenceScrollWidth > referenceOffsetWidth);
  }, [referenceOffsetWidth, referenceScrollWidth]);

  return (
    <PatientsTasklistInfo
      animated={animated}
      animationDuration={animationDuration + 1}
      referenceScrollWidth={referenceScrollWidth}
      referenceOffsetWidth={referenceOffsetWidth}
      stopPercentage={stopPercentage}
      ref={infoReference}
    >
      {children}
    </PatientsTasklistInfo>
  );
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
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <AnimatedPatientsTasklistInfo>
          {updated && (
            <img
              src={UpdateIndicatorIcon}
              alt="Updated"
              style={{
                height: '1rem',
                paddingRight: '0.125rem',
                width: '1rem',
              }}
            />
          )}
          {`Assigned by ${formattedUserName} ${formattedCreationDate}${countInfoContent}`}
        </AnimatedPatientsTasklistInfo>
      </div>
      <div>
        <CompletedBy isCompleted={status === 'COMPLETE' && completedByContent}>
          <span>{completedByContent}</span>
        </CompletedBy>
      </div>
    </PatientTasklistContainer>
  );
};
