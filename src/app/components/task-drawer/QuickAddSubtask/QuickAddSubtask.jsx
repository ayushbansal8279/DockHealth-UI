/* eslint-disable import/extensions */
import { Box } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubtask } from 'actions/task-actions';
import { useBoolean } from 'hooks/useBoolean';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { validateNewSubtask } from 'helpers/validation-helper';
import { onTaskDrawerSubtaskAdd } from 'helpers/ga-event-helper';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInputWrapper from '../QuickAddTaskInputWrapper/QuickAddTaskInputWrapper';

const QuickAddSubtask = () => {
  const selectedTask = useSelector(selectedTaskSelector) || {};
  const { taskIdentifier, taskList } = selectedTask;
  const taskListIdentifier = taskList?.taskListIdentifier;
  const editorReference = useRef(null);
  const [newTaskDescription, setNewTaskDescription] = useMentionsEditorState();
  const [hasInputValue, setHasInputValue] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [isDisabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const resetInputState = () => {
    setDisabled(false);
    setNewTaskDescription();
    setHasInputValue(false);

    // reset cursor position inside draft editor
    editorReference.current.blur();
    editorReference.current.focus();
  };

  const handleInputEnterDown = () => {
    let validatorError = null;
    setDisabled(true);

    const { rawText, tokenizedText } = convertFromEditorStateToOutput(
      newTaskDescription,
      false,
    );

    validatorError = validateNewSubtask(rawText);
    setError(validatorError);

    if (rawText && !validatorError) {
      onTaskDrawerSubtaskAdd('Quick add input');
      dispatch(addSubtask(taskIdentifier, { description: tokenizedText }))
        .then(resetInputState)
        .catch(resetInputState);
    }
  };

  const handleOnChange = (state) => {
    if (error) {
      setError(null);
    }
    setNewTaskDescription(state);
    setHasInputValue(!!convertFromEditorStateToOutput(state, false).rawText);
  };

  return (
    <QuickAddTaskInputWrapper
      placeholder="Add a subtask"
      isFocused={isFocused}
      error={error}
      hasInputValue={hasInputValue}
    >
      <Box flex={1} overflow="hidden">
        <Spacing vertical={6} />
        <TextEditor
          ref={editorReference}
          taskListIdentifier={taskListIdentifier}
          disabled={isDisabled}
          onFocus={setFocused}
          onBlur={unsetFocused}
          state={newTaskDescription}
          onChange={handleOnChange}
          keyBindingFn={(event) => {
            if (event.keyCode === 13) {
              return 'enter-command';
            }
            return undefined;
          }}
          handleKeyCommand={(command) => {
            if (command === 'enter-command') {
              handleInputEnterDown();
              return 'handled';
            }

            return 'not-handled';
          }}
        />
      </Box>
    </QuickAddTaskInputWrapper>
  );
};

export default QuickAddSubtask;
