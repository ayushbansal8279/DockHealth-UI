/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable sonarjs/no-identical-functions */
import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { storeAsCurrentTask } from 'actions/task-actions';
import { selectCurrentOrganizationWithRedirection } from 'api/user-api';
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

const AlertItem = ({ itemAlert, onClearAlert, withCrossIcon }) => {
  const dispatch = useDispatch();
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

  let onGoFunction = null;

  if (
    activityAlertType === 'ASSIGN_TASK' ||
    activityAlertType === 'CREATE_COMMENT' ||
    activityAlertType === 'MARK_COMPLETE' ||
    activityAlertType === 'MENTION_TASK' ||
    activityAlertType === 'MENTION_COMMENT'
  ) {
    onGoFunction = () => {
      const currentOrganizationIdentifier = sessionStorage.getItem(
        'currentOrganizationIdentifier',
      );

      if (organizationIdentifier === currentOrganizationIdentifier) {
        dispatch(storeAsCurrentTask(task));
        onClearAlert();
        history.push(
          `/core/tasks/${taskListIdentifier}/${status}/${taskIdentifier}`,
        );
      } else {
        sessionStorage.setItem('selectedTaskIdentifier', taskIdentifier);
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

const ActivityAlertsItem = ({ itemAlert, onClearAlert, withCrossIcon }) => (
  <AlertItem
    itemAlert={itemAlert}
    onClearAlert={onClearAlert}
    withCrossIcon={withCrossIcon}
  />
);

export default ActivityAlertsItem;
