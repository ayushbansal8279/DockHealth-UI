/* eslint-disable import/extensions */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  TASK_LIST_RESTRICTIONS_PROFILES,
  TASK_LIST_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import { AddTaskInputWrapper, ErrorLabel } from './styled';

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
      style,
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

    const handleTextEditorKeyEnter = (value) => {
      quickAddTask({ description: value, taskListIdentifier });
      setDescription('');
    };

    return (
      <>
        <AddTaskInputWrapper
          hasError={!!error}
          iconColor={iconColorActive}
          style={style}
        >
          <RichTextEditor
            placeholder="Add a task and press enter on your keyboard"
            ref={reference || quickAddTaskInputReference}
            value={description}
            onChange={handleTextEditorChange}
            onKeyEnter={handleTextEditorKeyEnter}
            showToolbar={false}
            multiline={false}
            disableToolbar
            showToolbarInline
            initOnClick
            taskListIdentifier={taskListIdentifier}
          />
        </AddTaskInputWrapper>
        {error && <ErrorLabel>{error}</ErrorLabel>}
      </>
    );
  },
);

export default QuickAddTaskInput;
