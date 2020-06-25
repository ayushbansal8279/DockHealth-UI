import React from 'react';
import ClipIcon from 'img/clip.png';
import Circle from 'img/pdf/pdf-circle.png';
import CircleCompleted from 'img/pdf/pdf-circle-completed.png';
import PriorityIcon from 'img/pdf/priority-icon.png';
import ProfileIcon from 'img/profile.png';
import palette from 'styles/palette';
import getPdfTaskData from './PdfTask.Data';
import {
  Avatar,
  AvatarContainer,
  CheckboxContainer,
  EditedLabel,
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
  StyledProfileIcon,
  TaskContainer,
  TaskDescription,
  TaskSubLabel,
  SubtasksContainer,
  TaskInnerContainer,
  StatusColorContainer,
  DueDateContainer,
} from './PdfTask.Styled';

const renderSubtask = ({
  taskListMembers,
  taskListMembersAvatars,
  columnsWidth,
}) => ({ taskIdentifier, ...props }) => (
  <PdfTask
    key={taskIdentifier}
    taskListMembers={taskListMembers}
    taskListMembersAvatars={taskListMembersAvatars}
    taskIdentifier={taskIdentifier}
    columnsWidth={columnsWidth}
    {...props}
  />
);

const PdfTask = props => {
  const {
    subtasks,
    description,
    assignedTo,
    taskListMembers,
    taskListMembersAvatars,
    columnsWidth,
  } = props;

  const avatarContent = assignedTo?.userIdentifier ? (
    taskListMembersAvatars.get(assignedTo?.userIdentifier)
  ) : (
    <StyledProfileIcon src={ProfileIcon} />
  );

  const {
    isSubtask,
    isComplete,
    isHighPriority,
    isEdited,
    hasAttachments,
    mainContainerWidth,
    assignedMemberColor,
    bottomLabel,
    patientName,
    dueDateLabel,
    isOverdue,
    completedByLabel,
    workflowStatusLabel,
    workflowStatusColor,
    listName,
  } = getPdfTaskData(props);

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
            <CheckboxContainer src={isComplete ? CircleCompleted : Circle} />
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
              {isEdited ? <EditedLabel>(edited)</EditedLabel> : undefined}
            </InlineContainer>
            {completedByLabel ? (
              <TaskSubLabel color={palette.brightBlue}>
                {completedByLabel}
              </TaskSubLabel>
            ) : (
              undefined
            )}
            {bottomLabel ? (
              <TaskSubLabel>{bottomLabel}</TaskSubLabel>
            ) : (
              undefined
            )}
          </MainInnerContainer>
          {columnsWidth.patient ? (
            <PatientContainer width={columnsWidth.patient}>
              <TextLabel>{patientName}</TextLabel>
            </PatientContainer>
          ) : (
            undefined
          )}
          <StatusContainer>
            {!isComplete && (
              <StatusColorContainer color={workflowStatusColor} />
            )}
            <TextLabel>
              {isComplete ? 'Completed' : workflowStatusLabel}
            </TextLabel>
          </StatusContainer>
          <InnerContainer>
            <AvatarContainer color={assignedMemberColor}>
              <Avatar color={assignedMemberColor}>{avatarContent}</Avatar>
            </AvatarContainer>
          </InnerContainer>
          <DueDateContainer>
            <TextLabel isRed={isOverdue}>{dueDateLabel}</TextLabel>
          </DueDateContainer>
          {columnsWidth.listName ? (
            <ListNameContainer width={columnsWidth.listName}>
              <TextLabel>{listName}</TextLabel>
            </ListNameContainer>
          ) : (
            undefined
          )}
        </TaskInnerContainer>
      </TaskContainer>
      {subtasks?.length > 0 ? (
        <SubtasksContainer>
          {subtasks.map(
            renderSubtask({
              taskListMembers,
              taskListMembersAvatars,
              columnsWidth,
            }),
          )}
        </SubtasksContainer>
      ) : (
        undefined
      )}
    </>
  );
};

export default PdfTask;
