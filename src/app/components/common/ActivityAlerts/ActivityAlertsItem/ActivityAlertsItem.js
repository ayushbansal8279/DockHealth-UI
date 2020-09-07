import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { storeAsCurrentTask } from 'actions/task-actions';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/notifications/cross';
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
  StyledCrossIcon,
  StyledTaskLink,
} from './styled';

const AssignedCommentAlertItem = ({
  itemAlert,
  onClearAlert,
  withCrossIcon,
}) => {
  const dispatch = useDispatch();
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
          {withCrossIcon && (
            <StyledCrossIcon
              src={CrossIcon}
              alt="cross"
              onClick={onClearAlert}
            />
          )}
          {!withCrossIcon && (
            <ActivityAlertsItemClearLabel onClick={onClearAlert}>
              Clear
            </ActivityAlertsItemClearLabel>
          )}
        </div>
      </ActivityAlertsItemHeader>
      <ActivityAlertsItemLabel>
        New comment in{' '}
        <StyledTaskLink
          onClick={() => {
            dispatch(storeAsCurrentTask(task));
            onClearAlert();
            hashHistory.push(
              `/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
            );
          }}
        >
          {description?.length > 30
            ? `${description.slice(0, 30)}...`
            : description}
        </StyledTaskLink>{' '}
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

const AssignedAlertItem = ({ itemAlert, onClearAlert, withCrossIcon }) => {
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
          {withCrossIcon && (
            <StyledCrossIcon
              src={CrossIcon}
              alt="cross"
              onClick={onClearAlert}
            />
          )}
          {!withCrossIcon && (
            <ActivityAlertsItemClearLabel onClick={onClearAlert}>
              Clear
            </ActivityAlertsItemClearLabel>
          )}
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

const CompletedTaskAlertItem = ({ itemAlert, onClearAlert, withCrossIcon }) => {
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
          {withCrossIcon && (
            <StyledCrossIcon
              src={CrossIcon}
              alt="cross"
              onClick={onClearAlert}
            />
          )}
          {!withCrossIcon && (
            <ActivityAlertsItemClearLabel onClick={onClearAlert}>
              Clear
            </ActivityAlertsItemClearLabel>
          )}
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

const getItemVariant = (itemAlert, onClearAlert, withCrossIcon) => {
  const { activityAlertType } = itemAlert;

  switch (activityAlertType) {
    case 'ASSIGN_TASK':
      return (
        <AssignedAlertItem
          itemAlert={itemAlert}
          onClearAlert={onClearAlert}
          withCrossIcon={withCrossIcon}
        />
      );
    case 'CREATE_COMMENT':
      return (
        <AssignedCommentAlertItem
          itemAlert={itemAlert}
          onClearAlert={onClearAlert}
          withCrossIcon={withCrossIcon}
        />
      );
    case 'MARK_COMPLETE':
      return (
        <CompletedTaskAlertItem
          itemAlert={itemAlert}
          onClearAlert={onClearAlert}
          withCrossIcon={withCrossIcon}
        />
      );
    default:
      return null;
  }
};

const ActivityAlertsItem = ({ itemAlert, onClearAlert, withCrossIcon }) =>
  getItemVariant(itemAlert, onClearAlert, withCrossIcon);

export default ActivityAlertsItem;
