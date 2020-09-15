/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { storeAsCurrentTask } from 'actions/task-actions';
import { selectCurrentOrganizationWithRedirection } from 'api/user-api';
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
  StyledCrossIcon,
  StyledTaskLink,
  StyledDescriptionTaskLink,
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
    organizationIdentifier,
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
            const currentOrganizationIdentifier = sessionStorage.getItem(
              'currentOrganizationIdentifier',
            );

            if (organizationIdentifier === currentOrganizationIdentifier) {
              dispatch(storeAsCurrentTask(task));
              onClearAlert();
              hashHistory.push(
                `/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
              );
            } else {
              sessionStorage.setItem('selectedTaskIdentifier', taskIdentifier);
              selectCurrentOrganizationWithRedirection(
                organizationIdentifier,
                `#/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
              );
            }
          }}
        >
          {description?.length > 50
            ? `${description.slice(0, 50).replace(/\s*$/, '')}...`
            : description}
        </StyledTaskLink>{' '}
        added by{' '}
        <StyledTaskLink
          onClick={() => {
            const currentOrganizationIdentifier = sessionStorage.getItem(
              'currentOrganizationIdentifier',
            );

            if (organizationIdentifier === currentOrganizationIdentifier) {
              onClearAlert();
              hashHistory.push(`/assignedToPerson/${creator?.userIdentifier}`);
            } else {
              selectCurrentOrganizationWithRedirection(
                organizationIdentifier,
                `#/assignedToPerson/${creator?.userIdentifier}`,
              );
            }
          }}
        >
          {`${creator?.firstName} ${creator?.lastName}`.length > 42
            ? `${`${creator?.firstName} ${creator?.lastName}`?.slice(0, 42)}...`
            : `${creator?.firstName} ${creator?.lastName}`}
        </StyledTaskLink>
      </ActivityAlertsItemLabel>
      <ActivityAlertItemQuotes>
        “
        {comment?.length > 130
          ? `${comment.slice(0, 130).replace(/\s*$/, '')}...`
          : comment}
        ”
      </ActivityAlertItemQuotes>
    </ActivityAlertsItemContainer>
  );
};

const AssignedAlertItem = ({ itemAlert, onClearAlert, withCrossIcon }) => {
  const { task, createdDateTime, organization } = itemAlert;
  const { description, taskList } = task;
  const { taskListIdentifier } = taskList;
  const {
    organizationInitials,
    organizationName,
    organizationProfileColor,
    organizationIdentifier,
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
        <StyledTaskLink
          onClick={() => {
            const currentOrganizationIdentifier = sessionStorage.getItem(
              'currentOrganizationIdentifier',
            );

            if (organizationIdentifier === currentOrganizationIdentifier) {
              onClearAlert();
              hashHistory.push(`/tasks/${taskListIdentifier}`);
            } else {
              selectCurrentOrganizationWithRedirection(
                organizationIdentifier,
                `#/tasks/${taskListIdentifier}`,
              );
            }
          }}
        >
          {taskList?.listName?.length > 74
            ? `${taskList?.listName.slice(0, 74).replace(/\s*$/, '')}...`
            : taskList?.listName}
        </StyledTaskLink>
      </ActivityAlertsItemLabel>
      <ActivityAlertsItemDescription>
        {description?.length > 130
          ? `${description.slice(0, 130).replace(/\s*$/, '')}...`
          : description}
      </ActivityAlertsItemDescription>
    </ActivityAlertsItemContainer>
  );
};

const CompletedTaskAlertItem = ({ itemAlert, onClearAlert, withCrossIcon }) => {
  const dispatch = useDispatch();
  const { task, createdDateTime, organization } = itemAlert;
  const { description, taskList, taskIdentifier, status } = task;
  const { taskListIdentifier } = taskList;
  const {
    organizationInitials,
    organizationName,
    organizationProfileColor,
    organizationIdentifier,
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
        <StyledDescriptionTaskLink
          onClick={() => {
            const currentOrganizationIdentifier = sessionStorage.getItem(
              'currentOrganizationIdentifier',
            );

            if (organizationIdentifier === currentOrganizationIdentifier) {
              dispatch(storeAsCurrentTask(task));
              onClearAlert();
              hashHistory.push(
                `/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
              );
            } else {
              sessionStorage.setItem('selectedTaskIdentifier', taskIdentifier);
              selectCurrentOrganizationWithRedirection(
                organizationIdentifier,
                `#/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
              );
            }
          }}
        >
          {description?.length > 130
            ? `${description.slice(0, 130).replace(/\s*$/, '')}...`
            : description}
        </StyledDescriptionTaskLink>
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
