import React, { useCallback, useRef } from 'react';
import moment from 'moment';
import { storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import Spacing from 'components/common/Spacing';
import OverflowTooltip from 'components/task/OverflowTooltip/OverflowTooltip';
import {
  Description,
  DescriptionBox,
  CompletedBy,
  TaskItemParentTaskLabel,
  DescriptionTooltip,
  DescriptionLabel,
  DescriptionWrapper,
  TaskItemDescriptionIndicators,
} from '../../styled';

const TaskItemDescription = ({
  isCompletedGroup,
  isCompleted,
  descriptionState,
  setDescriptionState,
  matchDescription,
  highlightedValue,
  description,
  edited,
  duplicated,
  hasParentTaskLabel,
  parentTask,
  completedByName,
  completedDt,
  dispatch,
}) => {
  const descriptionTextReference = useRef(null);

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
          ref={reference => {
            if (reference) {
              descriptionTextReference.current = reference.querySelector(
                '.public-DraftStyleDefault-block',
              );
            }
          }}
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
          <OverflowTooltip textReference={descriptionTextReference.current}>
            <DescriptionTooltip>{description}</DescriptionTooltip>
          </OverflowTooltip>
        </Description>
        {edited && !duplicated && <DescriptionLabel>(edited)</DescriptionLabel>}
        {duplicated && <DescriptionLabel>(duplicated)</DescriptionLabel>}
      </DescriptionWrapper>
      <TaskItemDescriptionIndicators>
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
        {hasParentTaskLabel && (
          <>
            {isCompleted && <Spacing horizontal={2} />}
            <TaskItemParentTaskLabel>
              Subtask of
              <span
                onClick={onParentLabelClick}
              >{` ${parentTask.description}`}</span>
            </TaskItemParentTaskLabel>
          </>
        )}
      </TaskItemDescriptionIndicators>
    </DescriptionBox>
  );
};
export default TaskItemDescription;
