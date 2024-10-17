/* eslint-disable import/extensions */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  TASK_LIST_RESTRICTIONS_PROFILES,
  TASK_LIST_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import Circle from 'img/circle.svg';
import { AddTaskInputWrapper, ErrorLabel } from './styled';
import {
  CircleIcon,
  MainStandardTaskItemCell,
  StandardTaskItemContainer,
} from '../../task/styled';
import { Box } from '@mui/material';
const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

const QuickAddTaskInput = React.forwardRef(
  (
    {
      // autofocus = false,
      quickAddTask,
      onFocus,
      onBlur,
      validator,
      taskListIdentifier = null,
      disableMentions = false,
      small,
      iconColorActive,
      origin,
      style,
      isWorkflowAddTaskRow,
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    // const [newTaskDescription, setNewTaskDescription] =
    //   useMentionsEditorState();
    // const [hasInputValue, setHasInputValue] = useState(false);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    // const [isFocused, setIsFocused] = useState(false);
    const quickAddTaskInputReference = useRef(null);
    // const selectedTask = useSelector(selectedTaskSelector);

    const currentUser = useSelector(userProfileSelector);
    const taskListRestrictions =
      TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];

    if (taskListRestrictions?.createTask === DISABLED) {
      return null;
    }

    const handleTextEditorChange = (value) => {
      if (error) {
        setError(null);
      }
      setDescription(value);
    };

    const handleTextEditorKeyEnter = (value, taskMentions) => {
      quickAddTask({ description: value, taskListIdentifier, taskMentions });
      setDescription('');
    };

    return (
      <>
        {origin === 'LIST' ? (
          <StandardTaskItemContainer
            workflowAddTask
            iconColorActive={iconColorActive}
            origin={origin}
          >
            <MainStandardTaskItemCell
              bolded
              position="static"
              alignItems="flex-start"
              paddingLeft="huge"
              paddingRight="small"
            >
              <CircleIcon src={Circle} />
              <Box flex={1} overflow="hidden">
                <RichTextEditor
                  placeholder="Add task"
                  ref={reference || quickAddTaskInputReference}
                  value={description}
                  onChange={handleTextEditorChange}
                  onKeyEnter={handleTextEditorKeyEnter}
                  showToolbar={false}
                  onBlur={onBlur}
                  multiline={false}
                  disableToolbar
                  showToolbarInline
                  initOnClick
                  taskListIdentifier={taskListIdentifier}
                />
              </Box>
            </MainStandardTaskItemCell>
          </StandardTaskItemContainer>
        ) : (
          <AddTaskInputWrapper
            isWorkflowAddTaskRow={isWorkflowAddTaskRow}
            hasError={!!error}
            iconColor={iconColorActive}
            style={style}
          >
            <RichTextEditor
              placeholder="Add task"
              ref={reference || quickAddTaskInputReference}
              value={description}
              onChange={handleTextEditorChange}
              onKeyEnter={handleTextEditorKeyEnter}
              showToolbar={false}
              onBlur={onBlur}
              multiline={false}
              disableToolbar
              showToolbarInline
              initOnClick
              taskListIdentifier={taskListIdentifier}
            />
          </AddTaskInputWrapper>
        )}
        {error && <ErrorLabel>{error}</ErrorLabel>}
      </>
    );
  },
);

export default QuickAddTaskInput;
