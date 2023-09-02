/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import { selectCurrentOrganizationWithRedirection } from 'api/organization-api';
import CircleCompleted from 'img/circle-completed.svg';
import CrossIcon from 'img/notifications/cross.svg';
import { useDispatch } from 'react-redux';
import { openDrawer } from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';
import { determineAlertTitle, determineAlertSubTitle } from '../helpers';
import {
  ActivityAlertsItemContainer,
  ActivityAlertsItemHeader,
  ActivityAlertsItemOrganizationAvatar,
  ActivityAlertsItemOrganizationLabel,
  ActivityAlertItemTitle,
  ActivityAlertsItemTime,
  ActivityAlertsItemClearLabel,
  ActivityAlertItemSubTitle,
  CompletedCircleIcon,
  StyledCrossIcon,
  StyledFooter,
} from './styled';

// eslint-disable-next-line unicorn/prevent-abbreviations

const AlertItem = ({ itemAlert, onClearAlert, withCrossIcon, closeAlerts }) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    activityAlertTitle,
    activityAlertSubTitle,
    activityAlertType,
    task = {},
    createdDateTime,
    organization = {},
    targetIdentifier,
  } = itemAlert;
  let activityTask = {};
  if (task) {
    activityTask = task;
  }
  const {
    description,
    taskList = {},
    taskIdentifier,
    status,
    comments,
    dueDate,
  } = activityTask;
  const { taskListIdentifier, listName } = taskList;
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
  const { comment, creator = {} } = alertComment;
  const { userName } = creator;
  const dueTime = moment(dueDate).format('hh:mm A');

  let onGoFunction = null;

  if (
    activityAlertType === 'ASSIGN_TASK' ||
    activityAlertType === 'CREATE_COMMENT' ||
    activityAlertType === 'MARK_COMPLETE' ||
    activityAlertType === 'MENTION_TASK' ||
    activityAlertType === 'MENTION_COMMENT' ||
    activityAlertType === 'TASK_IS_DUE_TODAY' ||
    activityAlertType === 'CREATE_TASK_BUNDLE'
  ) {
    onGoFunction = () => {
      const currentOrganizationIdentifier = sessionStorage.getItem(
        'currentOrganizationIdentifier',
      );

      if (organizationIdentifier === currentOrganizationIdentifier) {
        closeAlerts();
        const newPath = `/core/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`;
        if (location.pathname === newPath) {
          dispatch(storeAsCurrentTask(task));
          dispatch(openDrawer());
        } else {
          history.push(newPath);
        }
      } else {
        sessionStorage.setItem('selectedTaskIdentifier', taskIdentifier);
        closeAlerts();
        selectCurrentOrganizationWithRedirection(
          organizationIdentifier,
          `#/core/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
        );
      }
    };
  } else {
    return null;
  }

  const title = determineAlertTitle(
    activityAlertTitle,
    listName,
    description,
    userName,
    dueTime,
  );

  const subtitle = determineAlertSubTitle(
    activityAlertSubTitle,
    description,
    comment,
  );

  const formattedTitle =
    title?.length > 65 ? `${title.slice(0, 65).replace(/\s*$/, '')}...` : title;
  let formattedSubtitle = null;

  if (
    activityAlertType === 'CREATE_COMMENT' ||
    activityAlertType === 'MENTION_COMMENT'
  ) {
    formattedSubtitle = `"${
      subtitle?.length > 128
        ? `${subtitle.slice(0, 128).replace(/\s*$/, '')}...`
        : subtitle
    }"`;
  } else {
    formattedSubtitle =
      subtitle?.length > 130
        ? `${subtitle.slice(0, 130).replace(/\s*$/, '')}...`
        : subtitle;
  }

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
      <ActivityAlertItemTitle>
        {activityAlertType === 'MARK_COMPLETE' && (
          <CompletedCircleIcon src={CircleCompleted} />
        )}
        {formattedTitle}
      </ActivityAlertItemTitle>
      <ActivityAlertItemSubTitle>{formattedSubtitle}</ActivityAlertItemSubTitle>
      {onGoFunction && (
        <StyledFooter>
          <span onClick={onGoFunction}>Go</span>
        </StyledFooter>
      )}
    </ActivityAlertsItemContainer>
  );
};

const ActivityAlertsItem = ({
  itemAlert,
  onClearAlert,
  withCrossIcon,
  closeAlerts,
}) => (
  <AlertItem
    itemAlert={itemAlert}
    onClearAlert={onClearAlert}
    withCrossIcon={withCrossIcon}
    closeAlerts={closeAlerts}
  />
);

export default ActivityAlertsItem;
