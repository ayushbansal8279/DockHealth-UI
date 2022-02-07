/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  storeAsCurrentTask,
  updateTaskDescription,
} from 'actions/task-actions';
import { TaskStatus } from 'helpers/task-helpers';
import { openDrawer } from 'actions/task-drawer-actions';
import TextEditor from 'components/common/TextEditor/TextEditor';
import Spacing from 'components/common/Spacing';
import { checkIfShouldDisplayTooltip } from 'components/task/OverflowTooltip/OverflowTooltip';
import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  convertToEditorState,
  convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
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
  isEditing,
  setEditing,
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
    taskList,
  } = task;
  const { taskListIdentifier } = taskList || {};
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
  const descriptionReference = useRef(null);
  const isCompleted = status === TaskStatus.COMPLETE;
  const descriptionEdited = type === 'TEMPLATE' ? false : edited;
  const isDuplicated = type === 'TEMPLATE' ? false : duplicated;

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  const convertedDescriptionState = useMemo(
    () => convertFromEditorStateToOutput(descriptionState, false),
    [descriptionState],
  );

  const stateHasMentions = convertedDescriptionState.mentions?.length > 0;

  useEffect(() => {
    if (isEditing && descriptionReference.current) {
      descriptionReference.current.focus();
    }
  }, [isEditing, descriptionReference]);

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

  const handleKeyBindingFn = useCallback(event => {
    if (event.key === 'Enter') {
      return 'enter-command';
    }

    return undefined;
  }, []);

  const handleBlur = useCallback(() => {
    const { tokenizedText, rawText, mentions } = convertFromEditorStateToOutput(
      descriptionState,
      false,
    );
    if (rawText !== description) {
      dispatch(
        updateTaskDescription(task, {
          tokenizedDescription: tokenizedText,
          description: rawText,
          taskMentions: [...(task.taskMentions || []), ...(mentions || [])],
        }),
      );
    }
    setEditing(false);
  }, [description, descriptionState, dispatch, setEditing, task]);

  const handleKeyCommand = useCallback(
    command => {
      if (command === 'enter-command') {
        // eslint-disable-next-line no-unused-expressions
        descriptionReference.current?.blur();
        return 'handled';
      }

      return 'not-handled';
    },
    [descriptionReference],
  );

  return (
    <DescriptionBox>
      <Tooltip
        title={convertedDescriptionState.rawText}
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
            isEditing={isEditing}
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              setEditing(true);
            }}
          >
            {stateHasMentions || isEditing ? (
              <TextEditor
                ref={descriptionReference}
                readOnly={!isEditing}
                oneline
                state={descriptionState}
                onChange={setDescriptionState}
                taskListIdentifier={taskListIdentifier}
                highlightedValues={
                  matchDescription &&
                  highlightedValue?.toLowerCase().split(/\s+/)
                }
                keyBindingFn={handleKeyBindingFn}
                handleKeyCommand={handleKeyCommand}
                onBlur={handleBlur}
              />
            ) : (
              <DescriptionText>
                {convertedDescriptionState.rawText}
              </DescriptionText>
            )}
          </Description>
          {descriptionEdited && !isDuplicated && (
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
