/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { storeAsCurrentTask } from 'actions/task-actions';
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
  isCompletedGroup,
  isCompleted,
  matchDescription,
  highlightedValue,
  description,
  tokenizedDescription,
  taskMentions,
  edited,
  duplicated,
  hasParentTaskLabel,
  parentTask,
  completedByName,
  completedDt,
}) => {
  const descriptionTextReference = useRef(null);
  const previousDescription = useRef(null);
  const dispatch = useDispatch();
  const [descriptionState, setDescriptionState] = useMentionsEditorState(
    convertToEditorState({
      rawText: description,
      tokenizedText: tokenizedDescription,
      mentions: taskMentions,
      handleRichText: false,
    }),
  );

  useEffect(() => {
    if (previousDescription.current !== null) {
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
                descriptionTextReference.current =
                  taskMentions?.length > 0
                    ? reference.querySelector('.public-DraftStyleDefault-block')
                    : reference.querySelector('p');
              }
            }}
            isCrossedOut={!isCompletedGroup && isCompleted}
          >
            {taskMentions?.length > 0 ? (
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
          {edited && !duplicated && (
            <DescriptionLabel>(edited)</DescriptionLabel>
          )}
          {duplicated && <DescriptionLabel>(duplicated)</DescriptionLabel>}
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
