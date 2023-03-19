/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Box, Fade, IconButton, Popper } from '@mui/material';
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
import {
  convertToEditorState,
  convertFromEditorStateToOutput,
} from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
// import { EditorState } from 'draft-js';
// import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import EditIcon from '@mui/icons-material/Edit';
import {
  Description,
  DescriptionBox,
  CompletedBy,
  TaskItemParentTaskLabel,
  TaskItemDescriptionIndicators,
  DescriptionTooltipWrapper,
  DescriptionBorder,
  TaskContext,
  DescriptionEditButton,
} from '../../styled';

const TaskItemDescription = ({
  task,
  // isCompletedGroup,
  highlightedValue,
  hasParentTaskLabel,
  isEditing,
  setEditing,
  disabled,
  disableMentions,
  isEditButtonVisible = false,
  width,
}) => {
  const {
    description,
    tokenizedDescription,
    taskMentions,
    status,
    parentTask,
    searchMetaData,
    completedBy,
    completedDt,
    taskList,
    linkedTaskTemplate,
    read,
  } = task;
  const { taskListIdentifier } = taskList || {};
  const { matchDescription } = searchMetaData || {};
  const previousDescription = useRef(null);
  const descriptionTextReference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
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
  const isDecisionTask = task?.intentType === 'DECISION';

  const completedByName = completedBy
    ? `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
        .trim()
        .replace(/^\.$/, '') || 'Unknown'
    : 'Unknown';

  const convertedDescriptionState = useMemo(
    () => convertFromEditorStateToOutput(descriptionState, false),
    [descriptionState],
  );

  useEffect(() => {
    if (isEditing && descriptionReference.current) {
      setTimeout(descriptionReference.current.focus, 0);
    }
  }, [isEditing, descriptionReference]);

  useEffect(() => {
    if (previousDescription.current !== null) {
      // const newContent = createMentionEntities(
      //   tokenizedDescription,
      //   description,
      //   taskMentions,
      //   false,
      // );
      // setDescriptionState(EditorState.push(descriptionState, newContent));
    }
    previousDescription.current = description;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  const onParentLabelClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      dispatch(openDrawer());
      dispatch(storeAsCurrentTask(parentTask));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentTask],
  );

  const handleKeyBindingFunction = useCallback((event) => {
    if (event.key === 'Enter') {
      return 'enter-command';
    }
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
    (command) => {
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
    <DescriptionBox width={width}>
      <Box display="flex" flex={1}>
        <Description
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={(reference) => {
            if (reference) {
              descriptionTextReference.current = reference.querySelector(
                '.public-DraftStyleDefault-block',
              );
            }
          }}
          isCrossedOut={isCompleted}
          isUnread={!read}
        >
          <DescriptionBorder disabled={disabled} isEdited={isEditing}>
            <TextEditor
              value={description}
              ref={descriptionReference}
              readOnly={disabled || !isEditing}
              oneline
              state={descriptionState}
              onChange={setDescriptionState}
              taskListIdentifier={taskListIdentifier}
              highlightedValues={
                matchDescription && highlightedValue?.toLowerCase().split(/\s+/)
              }
              keyBindingFn={handleKeyBindingFunction}
              handleKeyCommand={handleKeyCommand}
              onBlur={handleBlur}
              disableMentions={disableMentions}
            />
            <Popper
              anchorEl={descriptionTextReference.current}
              placement="bottom-start"
              open={
                checkIfShouldDisplayTooltip(descriptionTextReference.current) &&
                isHovered &&
                !isEditing
              }
              style={{
                zIndex: 115,
                maxWidth:
                  descriptionTextReference?.current?.offsetWidth || '650px',
              }}
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={250}>
                  <DescriptionTooltipWrapper>
                    {convertedDescriptionState?.rawText}
                  </DescriptionTooltipWrapper>
                </Fade>
              )}
            </Popper>
            {isEditButtonVisible && !isCompleted && (
              <DescriptionEditButton active={isEditing}>
                <IconButton
                  onClick={(event) => {
                    if (!disabled) {
                      event.stopPropagation();
                      event.preventDefault();
                      setEditing(true);
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </DescriptionEditButton>
            )}
          </DescriptionBorder>
        </Description>
      </Box>
      <TaskItemDescriptionIndicators>
        {isCompleted && (
          <CompletedBy isCompleted={isCompleted}>
            <span>{`By ${completedByName} ${
              completedDt &&
              ` on ${
                completedDt ? `${moment(completedDt).format('MM/DD/YYYY')}` : ''
              }`
            } ${
              linkedTaskTemplate ? `, launched ${linkedTaskTemplate.name}` : ''
            }
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
        {linkedTaskTemplate && !isCompleted && !isDecisionTask && (
          <TaskContext>
            <span>Triggers: {linkedTaskTemplate.name}</span>
          </TaskContext>
        )}
        {linkedTaskTemplate && !isCompleted && isDecisionTask && (
          <TaskContext>
            <span>Triggers a SmartFlow</span>
          </TaskContext>
        )}
      </TaskItemDescriptionIndicators>
    </DescriptionBox>
  );
};
export default TaskItemDescription;
