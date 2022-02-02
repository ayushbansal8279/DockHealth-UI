/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { storeAsCurrentTask } from 'actions/task-actions';
import { TaskStatus } from 'helpers/task-helpers';
import { openDrawer } from 'actions/task-drawer-actions';
import TextEditor from 'components/common/TextEditor/TextEditor';
import Spacing from 'components/common/Spacing';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import Tooltip from 'components/common/Tooltip/Tooltip';
import { convertToEditorState } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { EditorState } from 'draft-js';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import {
  Description,
  DescriptionBox,
  CompletedBy,
  TaskItemParentTaskLabel,
  DescriptionLabel,
  DescriptionWrapper,
  TaskItemDescriptionIndicators,
  DescriptionText,
} from '../../styled';

const TaskItemDescription = ({
  task,
  isCompletedGroup,
  highlightedValue,
  hasParentTaskLabel,
}) => {
  const {
    description,
    tokenizedDescription,
    taskMentions,
    status,
    edited,
    duplicated,
    type,
    parentTask,
    searchMetaData,
    completedBy,
    completedDt,
  } = task;
  const { matchDescription } = searchMetaData || {};
  const descriptionTextReference = useRef(null);
  const previousDescription = useRef(null);
  const dispatch = useDispatch();
  const hasMentions = taskMentions?.length > 0;
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
      handleRichText: false,
    }),
  );

  const isCompleted = status === TaskStatus.COMPLETE;
  const isEdited = type === 'TEMPLATE' ? false : edited;
  const isDuplicated = type === 'TEMPLATE' ? false : duplicated;

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  useEffect(() => {
    if (previousDescription.current !== null && hasMentions) {
      const newContent = createMentionEntities(
        tokenizedDescription,
        description,
        taskMentions,
        false,
      );
      setDescriptionState(EditorState.push(descriptionState, newContent));
    }
    previousDescription.current = description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

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
      <Tooltip
        title={description}
        hideTooltip={
          !checkIfShouldDisplayTooltip(descriptionTextReference.current)
        }
      >
        <DescriptionWrapper>
          <Description
            ref={reference => {
              if (reference) {
                descriptionTextReference.current = hasMentions
                  ? reference.querySelector('.public-DraftStyleDefault-block')
                  : reference.querySelector('p');
              }
            }}
            isCrossedOut={!isCompletedGroup && isCompleted}
          >
            {hasMentions ? (
              <TextEditor
                readOnly
                oneline
                state={descriptionState}
                onChange={setDescriptionState}
                highlightedValues={
                  matchDescription &&
                  highlightedValue?.toLowerCase().split(/\s+/)
                }
              />
            ) : (
              <DescriptionText>{description}</DescriptionText>
            )}
          </Description>
          {isEdited && !isDuplicated && (
            <DescriptionLabel>(edited)</DescriptionLabel>
          )}
          {isDuplicated && <DescriptionLabel>(duplicated)</DescriptionLabel>}
        </DescriptionWrapper>
      </Tooltip>
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
