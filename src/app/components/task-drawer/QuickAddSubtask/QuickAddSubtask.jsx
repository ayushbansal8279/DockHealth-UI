/* eslint-disable import/extensions */
import { Box } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubtask } from 'actions/task-actions';
import { useBoolean } from 'hooks/useBoolean';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { validateNewSubtask } from 'helpers/validation-helper';
import { onTaskDrawerSubtaskAdd } from 'helpers/ga-event-helper';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import Spacing from 'components/common/Spacing';
import QuickAddTaskInputWrapper from '../QuickAddTaskInputWrapper/QuickAddTaskInputWrapper';
import TextEditor from "ui-toolkit/Form/TextEditor/TextEditor";

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
  const [currentValue, setCurrentValue] = useState("")

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

  const handleTextEditorChange = (_, { value }) => {
    setCurrentValue(value)
  }

  const handleTextEditorKeyDown = (_, { value, key }) => {
    if (key === "Enter") {
      dispatch(
        addSubtask(taskIdentifier, { description: value })
      );
      setCurrentValue("")
    }
  };

  return (
    <QuickAddTaskInputWrapper
      placeholder=""
      isFocused={isFocused}
      error={error}
      hasInputValue={hasInputValue}
    >
      <Box flex={1} overflow="hidden">
        <TextEditor
          type="input"
          placeholder="Add a subtask"
          value={currentValue}
          onChange={handleTextEditorChange}
          onKeyDown={handleTextEditorKeyDown}
        />
      </Box>
    </QuickAddTaskInputWrapper>
  );
};

export default QuickAddSubtask;
