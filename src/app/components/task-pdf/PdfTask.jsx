import React from 'react';
import ClipIcon from '../../img/clip.png';
import PdfCheckboxOff from '../../img/pdf/pdf-checkbox-off.png';
import PdfCheckboxOn from '../../img/pdf/pdf-checkbox-on.png';
import ProfileIcon from '../../img/profile.png';
import getPdfTaskData from './PdfTask.Data';
import {
  Avatar,
  AvatarContainer,
  CheckboxContainer,
  DueDateLabel,
  EditedLabel,
  InitialSpacing,
  InlineContainer,
  InnerContainer,
  MainInnerContainer,
  PatientContainer,
  PatientLabel,
  PriorityStrip,
  SideContainer,
  StatusContainer,
  StatusDot,
  StyledClipIcon,
  StyledProfileIcon,
  SubtaskOrderContainer,
  SubtaskOrderLabel,
  TaskContainer,
  TaskDescription,
  TaskSubLabel,
  SubtasksContainer,
} from './PdfTask.Styled';

const renderSubtask = ({ taskListMembers, taskListMembersAvatars }) => (
  { taskIdentifier, ...props },
  subtaskOrder,
) => (
  <PdfTask
    key={taskIdentifier}
    taskListMembers={taskListMembers}
    taskListMembersAvatars={taskListMembersAvatars}
    taskIdentifier={taskIdentifier}
    oneBasedSubtaskOrder={subtaskOrder + 1}
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
    oneBasedSubtaskOrder = 1,
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
    assignedByLabel,
    bottomLabel,
    patientName,
    dueDateLabel,
    isOverdue,
    currentPriorityColor,
  } = getPdfTaskData(props);

  return (
    <>
      <TaskContainer wrap={false} isSubtask={isSubtask}>
        {isHighPriority ? <PriorityStrip /> : undefined}
        {isSubtask ? (
          <SubtaskOrderContainer>
            <SubtaskOrderLabel>{oneBasedSubtaskOrder}.</SubtaskOrderLabel>
          </SubtaskOrderContainer>
        ) : (
          <InitialSpacing />
        )}
        <InnerContainer>
          <CheckboxContainer
            src={isComplete ? PdfCheckboxOn : PdfCheckboxOff}
          />
        </InnerContainer>
        <InnerContainer>
          <AvatarContainer color={assignedMemberColor}>
            <Avatar color={assignedMemberColor}>{avatarContent}</Avatar>
          </AvatarContainer>
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
          {assignedByLabel ? (
            <TaskSubLabel>{assignedByLabel}</TaskSubLabel>
          ) : (
            undefined
          )}
          {bottomLabel ? <TaskSubLabel>{bottomLabel}</TaskSubLabel> : undefined}
        </MainInnerContainer>
        <PatientContainer>
          <PatientLabel>{patientName}</PatientLabel>
        </PatientContainer>
        <SideContainer>
          <DueDateLabel isOverdue={isOverdue}>{dueDateLabel}</DueDateLabel>
        </SideContainer>
        <StatusContainer>
          <StatusDot color={currentPriorityColor} />
        </StatusContainer>
      </TaskContainer>
      {subtasks?.length > 0 ? (
        <SubtasksContainer>
          {subtasks.map(
            renderSubtask({ taskListMembers, taskListMembersAvatars }),
          )}
        </SubtasksContainer>
      ) : (
        undefined
      )}
    </>
  );
};

export default PdfTask;
