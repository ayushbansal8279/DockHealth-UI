import React from 'react';
import moment from 'moment';
import CircleCompleted from 'img/circle-completed';
import {
  ActivityAlertsItemContainer,
  ActivityAlertsItemHeader,
  ActivityAlertsItemOrganizationAvatar,
  ActivityAlertsItemOrganizationLabel,
  ActivityAlertsItemLabel,
  ActivityAlertsItemDescription,
  ActivityAlertsItemTime,
  ActivityAlertsItemClearLabel,
  ActivityAlertItemQuotes,
  CompletedCircleIcon,
  StyledLink,
} from './styled';

const AssignedCommentAlertItem = ({ itemAlert, onClearAlert }) => {
  const { task, createdDateTime, organization, targetIdentifier } = itemAlert;
  const { description, taskList, taskIdentifier, status, comments } = task;
  const { taskListIdentifier } = taskList;
  const {
    organizationInitials,
    organizationName,
    organizationProfileColor,
  } = organization;

  const alertComment =
    comments?.find(
      ({ commentIdentifier }) => targetIdentifier === commentIdentifier,
    ) || {};
  const { comment, creator } = alertComment;

  return (
    <ActivityAlertsItemContainer>
      <ActivityAlertsItemHeader>
        <div>
          <ActivityAlertsItemOrganizationAvatar
            organizationProfileColor={organizationProfileColor}
          >
            {organizationInitials}
          </ActivityAlertsItemOrganizationAvatar>
          <ActivityAlertsItemOrganizationLabel>
            {organizationName}
          </ActivityAlertsItemOrganizationLabel>
        </div>
        <div>
          <ActivityAlertsItemTime>
            {moment(createdDateTime).fromNow()}
          </ActivityAlertsItemTime>
          <ActivityAlertsItemClearLabel onClick={onClearAlert}>
            Clear
          </ActivityAlertsItemClearLabel>
        </div>
      </ActivityAlertsItemHeader>
      <ActivityAlertsItemLabel>
        New comment in{' '}
        <StyledLink
          to={`/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`}
        >
          {description?.length > 30
            ? `${description.slice(0, 30)}...`
            : description}
        </StyledLink>{' '}
        added by{' '}
        <StyledLink to={`/assignedToPerson/${creator?.userIdentifier}`}>
          {creator?.firstName} {creator?.lastName}
        </StyledLink>
      </ActivityAlertsItemLabel>
      <ActivityAlertItemQuotes>
        “{comment?.length > 120 ? `${comment.slice(0, 120)}...` : comment}”
      </ActivityAlertItemQuotes>
    </ActivityAlertsItemContainer>
  );
};

const AssignedAlertItem = ({ itemAlert, onClearAlert }) => {
  const { task, createdDateTime, organization } = itemAlert;
  const { description, taskList, taskIdentifier, status } = task;
  const { taskListIdentifier } = taskList;
  const {
    organizationInitials,
    organizationName,
    organizationProfileColor,
  } = organization;
  return (
    <ActivityAlertsItemContainer>
      <ActivityAlertsItemHeader>
        <div>
          <ActivityAlertsItemOrganizationAvatar
            organizationProfileColor={organizationProfileColor}
          >
            {organizationInitials}
          </ActivityAlertsItemOrganizationAvatar>
          <ActivityAlertsItemOrganizationLabel>
            {organizationName}
          </ActivityAlertsItemOrganizationLabel>
        </div>
        <div>
          <ActivityAlertsItemTime>
            {moment(createdDateTime).fromNow()}
          </ActivityAlertsItemTime>
          <ActivityAlertsItemClearLabel onClick={onClearAlert}>
            Clear
          </ActivityAlertsItemClearLabel>
        </div>
      </ActivityAlertsItemHeader>
      <ActivityAlertsItemLabel>
        A New task has been assigned to you in{' '}
        <StyledLink to={`/tasks/${taskListIdentifier}`}>
          {taskList?.listName}
        </StyledLink>
      </ActivityAlertsItemLabel>
      <ActivityAlertsItemDescription>
        <StyledLink
          to={`/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`}
        >
          {description?.length > 120
            ? `${description.slice(0, 120)}...`
            : description}
        </StyledLink>
      </ActivityAlertsItemDescription>
    </ActivityAlertsItemContainer>
  );
};

const CompletedTaskAlertItem = ({ itemAlert, onClearAlert }) => {
  const { task, createdDateTime, organization } = itemAlert;
  const { description, taskList, taskIdentifier, status } = task;
  const { taskListIdentifier } = taskList;
  const {
    organizationInitials,
    organizationName,
    organizationProfileColor,
  } = organization;

  return (
    <ActivityAlertsItemContainer>
      <ActivityAlertsItemHeader>
        <div>
          <ActivityAlertsItemOrganizationAvatar
            organizationProfileColor={organizationProfileColor}
          >
            {organizationInitials}
          </ActivityAlertsItemOrganizationAvatar>
          <ActivityAlertsItemOrganizationLabel>
            {organizationName}
          </ActivityAlertsItemOrganizationLabel>
        </div>
        <div>
          <ActivityAlertsItemTime>
            {moment(createdDateTime).fromNow()}
          </ActivityAlertsItemTime>
          <ActivityAlertsItemClearLabel onClick={onClearAlert}>
            Clear
          </ActivityAlertsItemClearLabel>
        </div>
      </ActivityAlertsItemHeader>
      <ActivityAlertsItemLabel>
        <CompletedCircleIcon src={CircleCompleted} />A task you’ve assigned has
        been completed
      </ActivityAlertsItemLabel>
      <ActivityAlertsItemDescription>
        <StyledLink
          to={`/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`}
        >
          {description?.length > 120
            ? `${description.slice(0, 120)}...`
            : description}
        </StyledLink>
      </ActivityAlertsItemDescription>
    </ActivityAlertsItemContainer>
  );
};

const getItemVariant = (itemAlert, onClearAlert) => {
  const { activityAlertType } = itemAlert;

  switch (activityAlertType) {
    case 'ASSIGN_TASK':
      return (
        <AssignedAlertItem itemAlert={itemAlert} onClearAlert={onClearAlert} />
      );
    case 'CREATE_COMMENT':
      return (
        <AssignedCommentAlertItem
          itemAlert={itemAlert}
          onClearAlert={onClearAlert}
        />
      );
    case 'MARK_COMPLETE':
      return (
        <CompletedTaskAlertItem
          itemAlert={itemAlert}
          onClearAlert={onClearAlert}
        />
      );
    default:
      return null;
  }
};

const ActivityAlertsItem = ({ itemAlert, onClearAlert }) =>
  getItemVariant(itemAlert, onClearAlert);

export default ActivityAlertsItem;
