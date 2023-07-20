/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo } from 'react';
import ClipIcon from 'img/clip.png';
import Circle from 'img/pdf/pdf-circle.png';
import CircleCompleted from 'img/pdf/pdf-circle-completed.png';
import PriorityIcon from 'img/pdf/priority-icon.png';
import palette from 'styles/palette';
import ArrowIcon from 'img/arrow.png';
import { trunc } from 'helpers/utility-functions';
import getPdfTaskData from './PdfTask.Data';
import {
  AssignToText,
  AssignedToContainer,
  CheckboxContainer,
  ArrowContainer,
  ArrowIconWrapper,
  // EditedLabel,
  InitialSpacing,
  InlineContainer,
  InnerContainer,
  MainInnerContainer,
  PatientContainer,
  TextLabel,
  PriorityStripContainer,
  PriorityStrip,
  ListNameContainer,
  StatusContainer,
  StyledClipIcon,
  TaskContainer,
  TaskDescription,
  TaskSubLabel,
  SubtasksContainer,
  TaskInnerContainer,
  TaskInBundleContainer,
  StatusColorContainer,
  DueDateContainer,
} from './PdfTask.Styled';

const renderSubtask =
  ({ taskListMembers, taskListMembersAvatars, columnsWidth }) =>
  ({ taskIdentifier, ...props }) =>
    (
      <PdfTask
        key={taskIdentifier}
        taskListMembers={taskListMembers}
        taskListMembersAvatars={taskListMembersAvatars}
        taskIdentifier={taskIdentifier}
        columnsWidth={columnsWidth}
        {...props}
      />
    );

const PdfTask = (props) => {
  const {
    subtasks,
    description: descriptionName,
    assignedToUsers,
    taskListMembers,
    taskListMembersAvatars,
    columnsWidth,
    name,
    tasks,
  } = props;

  const description = descriptionName || name || '';

  const usersList = useMemo(() => {
    const maxLength = 20;
    const usersVisible = 2;
    const usersString =
      assignedToUsers?.reduce((accumulator, { userName }, index) => {
        if (index + 1 > usersVisible) return accumulator;
        return `${accumulator}${index > 0 ? ', ' : ''}${trunc(
          userName,
          maxLength,
        )} `;
      }, '') || '';
    const extraCounter =
      assignedToUsers?.length > 2 ? `+${assignedToUsers.length - 3}` : '';
    return `${usersString}${extraCounter}`;
  }, [assignedToUsers]);

  const {
    isSubtask,
    isComplete,
    isHighPriority,
    isEdited,
    hasAttachments,
    mainContainerWidth,
    bottomLabel,
    patientName,
    dueDateLabel,
    isOverdue,
    completedByLabel,
    workflowStatusLabel,
    workflowStatusColor,
    listName,
  } = getPdfTaskData(props);

  const isWorkflowBundle = !!tasks;

  return (
    <>
      <TaskContainer wrap={false} isSubtask={isSubtask}>
        <TaskInnerContainer>
          {isHighPriority && (
            <PriorityStripContainer>
              <PriorityStrip src={PriorityIcon} />
            </PriorityStripContainer>
          )}
          <InitialSpacing />
          <InnerContainer>
            {isWorkflowBundle ? (
              <ArrowContainer>
                <ArrowIconWrapper src={ArrowIcon} />
              </ArrowContainer>
            ) : (
              <CheckboxContainer src={isComplete ? CircleCompleted : Circle} />
            )}
          </InnerContainer>
          <MainInnerContainer mainContainerWidth={mainContainerWidth}>
            <InlineContainer>
              {hasAttachments ? <StyledClipIcon src={ClipIcon} /> : undefined}
              <TaskDescription
                mainContainerWidth={mainContainerWidth}
                isEdited={isEdited}
              >
                {description}
              </TaskDescription>
            </InlineContainer>
            {completedByLabel ? (
              <TaskSubLabel color={palette.brightBlue}>
                {completedByLabel}
              </TaskSubLabel>
            ) : undefined}
            {bottomLabel ? (
              <TaskSubLabel>{bottomLabel}</TaskSubLabel>
            ) : undefined}
          </MainInnerContainer>
          {columnsWidth.patient ? (
            <PatientContainer width={columnsWidth.patient}>
              <TextLabel>{patientName}</TextLabel>
            </PatientContainer>
          ) : undefined}
          <StatusContainer>
            {!isComplete && (
              <StatusColorContainer color={workflowStatusColor} />
            )}
            <TextLabel>
              {isComplete ? 'Completed' : workflowStatusLabel}
            </TextLabel>
          </StatusContainer>
          <AssignedToContainer>
            <AssignToText>{usersList}</AssignToText>
          </AssignedToContainer>
          <DueDateContainer>
            <TextLabel isRed={isOverdue}>{dueDateLabel}</TextLabel>
          </DueDateContainer>
          {columnsWidth.listName ? (
            <ListNameContainer width={columnsWidth.listName}>
              <TextLabel>{listName}</TextLabel>
            </ListNameContainer>
          ) : undefined}
        </TaskInnerContainer>
      </TaskContainer>
      {subtasks?.length > 0 && (
        <SubtasksContainer>
          {subtasks.map(
            renderSubtask({
              taskListMembers,
              taskListMembersAvatars,
              columnsWidth,
            }),
          )}
        </SubtasksContainer>
      )}
      {tasks?.length > 0 && (
        <TaskInBundleContainer>
          {tasks.map(
            renderSubtask({
              taskListMembers,
              taskListMembersAvatars,
              columnsWidth,
            }),
          )}
        </TaskInBundleContainer>
      )}
    </>
  );
};

export default PdfTask;
