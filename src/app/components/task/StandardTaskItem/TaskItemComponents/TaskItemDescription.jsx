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
// import RichTextEditor from 'components/RichTextEditorV2/RichTextEditor';
// import TextEditor from 'ui-toolkit/Form/TextEditor/TextEditor';

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
  const [descriptionState, setDescriptionState] = useState(description);

  const { taskListIdentifier } = taskList || {};
  const { matchDescription } = searchMetaData || {};
  const previousDescription = useRef(null);
  const descriptionTextReference = useRef(null);
  const dispatch = useDispatch();
  // const [descriptionState, setDescriptionState] = useMentionsEditorState(
  //   convertToEditorState({
  //     rawText: description,
  //     tokenizedText: tokenizedDescription,
  //     mentions: taskMentions,
  //     handleRichText: false,
  //   }),
  // );
  const descriptionReference = useRef(null);
  const isCompleted = status === TaskStatus.COMPLETE;
  const isDecisionTask = task?.intentType === 'DECISION';

  const completedByName = completedBy
    ? `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
        .trim()
        .replace(/^\.$/, '') || 'Unknown'
    : 'Unknown';

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

  const handleTextEditorBlur = (_, { value }) => {
    console.log('handleTextEditorBlur');
    dispatch(
      updateTaskDescription(task, {
        tokenizedDescription: value,
        taskMentions: [],
      }),
    );
    setEditing(false);
  };

  const handleTextEditorKeyDown = (_, { key, value }) => {
    if (key === 'Enter') {
      dispatch(
        updateTaskDescription(task, {
          tokenizedDescription: value,
          taskMentions: [],
        }),
      );
      setEditing(false);
    }
  };

  return (
    <DescriptionBox width={width} data-test={'foo'}>
      <Box display="flex" flex={1}>
        <input
          readOnly={!isEditing}
          value={descriptionState}
          onChange={(event) => setDescriptionState(event.target.value)}
          onBlur={(event) => {
            dispatch(
              updateTaskDescription(task, {
                tokenizedDescription: event.target.value,
                taskMentions: [],
              }),
            );
            setEditing(false);
          }}
          style={{
            outline: 'none',
            border: isEditing ? '1px solid #00a2e5' : 'none',
            borderRadius: '4px',
            background: 'transparent',
          }}
        />
        {/*<TextEditor*/}
        {/*    type="input"*/}
        {/*    readonly={!isEditing}*/}
        {/*    autofocus={isEditing}*/}
        {/*    value={description}*/}
        {/*    onBlur={handleTextEditorBlur}*/}
        {/*    onKeyDown={handleTextEditorKeyDown}*/}
        {/*    mentions={taskMentions}*/}
        {/*/>*/}
        {/*<RichTextEditor noStyle isSingleLine value={descriptionState} onChange={setDescriptionState} readOnly={!isEditing} className={isEditing ? "simple-input" : ""} onSubmit={(description) => {*/}
        {/*  dispatch(*/}
        {/*      updateTaskDescription(task, {*/}
        {/*        tokenizedDescription: description.trim(),*/}
        {/*        description: description.trim(),*/}
        {/*        taskMentions: [],*/}
        {/*      }),*/}
        {/*  );*/}
        {/*  setDescriptionState(description.trim())*/}
        {/*  setEditing(false)*/}
        {/*}}/>*/}
        {!isCompleted && (
          <DescriptionEditButton>
            <IconButton
              onClick={(event) => {
                if (!disabled) {
                  event.stopPropagation();
                  event.preventDefault();
                  setEditing(!isEditing);
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </DescriptionEditButton>
        )}
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
