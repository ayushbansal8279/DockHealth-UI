import React, { useCallback } from 'react';
import moment from 'moment';
import { storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import Spacing from 'components/common/Spacing';
import {
  Description,
  DescriptionBox,
  CompletedBy,
  TaskItemParentTaskLabel,
  DescriptionTooltip,
  DescriptionLabel,
  DescriptionWrapper,
} from '../../styled';

const TaskItemDescription = ({
  descriptionReference,
  isCompletedGroup,
  isCompleted,
  descriptionState,
  setDescriptionState,
  matchDescription,
  highlightedValue,
  isDescriptionTooltipVisible,
  description,
  edited,
  duplicated,
  hasParentTaskLabel,
  parentTask,
  completedByName,
  completedDt,
  dispatch,
}) => {
  const onParentLabelClick = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      dispatch(openDrawer());
      dispatch(storeAsCurrentTask(parentTask));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentTask],
  );

  return (
    <DescriptionBox>
      <DescriptionWrapper>
        <Description
          ref={descriptionReference}
          isCrossedOut={!isCompletedGroup && isCompleted}
        >
          <MentionsEditor
            readOnly
            oneline
            state={descriptionState}
            onChange={setDescriptionState}
            highlightedValues={
              matchDescription && highlightedValue?.toLowerCase().split(/\s+/)
            }
          />
          {isDescriptionTooltipVisible && (
            <DescriptionTooltip>{description}</DescriptionTooltip>
          )}
        </Description>
        {edited && !duplicated && <DescriptionLabel>(edited)</DescriptionLabel>}
        {duplicated && <DescriptionLabel>(duplicated)</DescriptionLabel>}
      </DescriptionWrapper>
      {hasParentTaskLabel && (
        <>
          <TaskItemParentTaskLabel>
            Subtask of
            <span
              onClick={onParentLabelClick}
            >{` ${parentTask.description}`}</span>
          </TaskItemParentTaskLabel>
          {isCompleted && <Spacing vertical={2} />}
        </>
      )}
      {isCompletedGroup && (
        <CompletedBy isCompleted={isCompleted}>
          <span>{`Completed by ${completedByName} ${completedDt &&
            ` on ${
              completedDt
                ? `on ${moment(completedDt).format('MM/DD/YYYY')}`
                : ''
            }`}
  `}</span>
        </CompletedBy>
      )}
    </DescriptionBox>
  );
};
export default TaskItemDescription;
