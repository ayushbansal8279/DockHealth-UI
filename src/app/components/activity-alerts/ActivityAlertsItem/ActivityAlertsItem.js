/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { selectCurrentOrganizationWithRedirection } from 'api/organization-api';
import CircleCompleted from 'img/circle-completed';
import CrossIcon from 'img/notifications/cross';
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
const getInterpolatedText = (tpl, args) =>
  tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

const AlertItem = ({ itemAlert, onClearAlert, withCrossIcon, closeAlerts }) => {
  const history = useHistory();
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
    activityAlertType === 'TASK_IS_DUE_TODAY'
  ) {
    onGoFunction = () => {
      const currentOrganizationIdentifier = sessionStorage.getItem(
        'currentOrganizationIdentifier',
      );

      if (organizationIdentifier === currentOrganizationIdentifier) {
        closeAlerts();
        history.push(
          `/core/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
        );
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

  const title = getInterpolatedText(activityAlertTitle, {
    task_list_name: listName,
    task_description: description,
    comment_creator: userName,
    due_time: !dueTime || dueTime === '12:00 AM' ? '' : `at ${dueTime}`,
  });

  const subtitle = getInterpolatedText(activityAlertSubTitle, {
    task_description: description,
    comment_description: comment,
  });

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
