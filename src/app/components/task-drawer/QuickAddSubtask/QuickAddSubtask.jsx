/* eslint-disable import/extensions */
import { Box } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubtask } from 'actions/task-actions';
import { useBoolean } from 'hooks/useBoolean';
// import { validateNewSubtask } from 'helpers/validation-helper';
import { onTaskDrawerSubtaskAdd } from 'helpers/ga-event-helper';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import QuickAddTaskInputWrapper from '../QuickAddTaskInputWrapper/QuickAddTaskInputWrapper';

const QuickAddSubtask = () => {
  const selectedTask = useSelector(selectedTaskSelector) || {};
  const { taskIdentifier, taskList } = selectedTask;
  // const taskListIdentifier = taskList?.taskListIdentifier;
  const editorReference = useRef(null);
  const [currentValue, setCurrentValue] = useState('');
  const [hasInputValue, setHasInputValue] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);
  const [isDisabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  const resetInputState = () => {
    setDisabled(false);
    setHasInputValue(false);

    setCurrentValue('');
    editorReference.current?.focus();
  };

  // const handleInputEnterDown = () => {
  //   let validatorError = null;
  //   setDisabled(true);

  //   const { rawText, tokenizedText } = convertFromEditorStateToOutput(
  //     newTaskDescription,
  //     false,
  //   );

  //   validatorError = validateNewSubtask(rawText);
  //   setError(validatorError);

  //   if (rawText && !validatorError) {
  //     onTaskDrawerSubtaskAdd('Quick add input');
  //     dispatch(addSubtask(taskIdentifier, { description: tokenizedText }))
  //       .then(resetInputState)
  //       .catch(resetInputState);
  //   }
  // };

  const handleTextEditorChange = (value) => {
    if (error) {
      setError(null);
    }
    setCurrentValue(value);
  };

  const handleTextEditorKeyEnter = (value) => {
    onTaskDrawerSubtaskAdd('Quick add input');
    dispatch(addSubtask(taskIdentifier, { description: value }))
      .then(resetInputState)
      .catch(resetInputState);
  };

  return (
    <QuickAddTaskInputWrapper
      placeholder=""
      isFocused={isFocused}
      error={error}
      hasInputValue={hasInputValue}
    >
      <Box flex={1} overflow="hidden">
        <RichTextEditor
          ref={editorReference}
          value={currentValue}
          placeholder="Add a subtask"
          onChange={handleTextEditorChange}
          onKeyEnter={handleTextEditorKeyEnter}
          showToolbar={false}
          multiline={false}
          disableToolbar
          showToolbarInline
          initOnClick
        />
      </Box>
    </QuickAddTaskInputWrapper>
  );
};

export default QuickAddSubtask;
