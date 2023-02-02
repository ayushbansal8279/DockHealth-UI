/* eslint-disable import/extensions */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Circle from 'img/circle.svg';
import { validateNewSubtask } from 'helpers/validation-helper';
import { onSubtaskAdded } from 'helpers/ga-event-helper';
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { addSubtask, closeQuickAddSubtask } from 'actions/task-actions';
import {
  StandardTaskItemContainer,
  MainStandardTaskItemCell,
  CircleIcon,
} from '../styled';

const QuickAddSubatask = ({
  parentTaskIdentifier,
  taskListIdentifier = null,
  onFocus,
  iconColorActive,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const editorReference = useRef(null);
  const [newTaskDescription, setNewTaskDescription] = useMentionsEditorState();
  const [hasInputValue, setHasInputValue] = useState(false);
  const [error, setError] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editorReference.current) editorReference.current.focus();
  }, []);

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
      dispatch(
        addSubtask(parentTaskIdentifier, {
          description: tokenizedText,
          taskListIdentifier,
        }),
      )
        .then(resetInputState)
        .catch(resetInputState);
      onSubtaskAdded('Quick add input');
    }
  };

  const handleOnChange = (state) => {
    if (error) {
      setError(null);
    }
    setNewTaskDescription(state);
    setHasInputValue(!!convertFromEditorStateToOutput(state, false).rawText);
  };

  const onBlurMentionsEditor = () => {
    if (!hasInputValue) dispatch(closeQuickAddSubtask(parentTaskIdentifier));
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const keyBindingMentionsEditor = (event) => {
    if (event.key === 'Enter') {
      return 'enter-command';
    }
    if (event.key === 'Escape') {
      return 'escape-command';
    }
  };

  const handleKeyMentionsEditor = (command) => {
    if (command === 'enter-command') {
      handleInputEnterDown();
      return 'handled';
    }

    if (command === 'escape-command') {
      editorReference.current.blur();
      return 'handled';
    }

    return 'not-handled';
  };

  return (
    <StandardTaskItemContainer isAddingTask iconColorActive={iconColorActive}>
      <MainStandardTaskItemCell
        bolded
        position="static"
        alignItems="flex-start"
        paddingLeft="huge"
        paddingRight="small"
      >
        <CircleIcon src={Circle} />
        <TextEditor
          ref={editorReference}
          taskListIdentifier={taskListIdentifier}
          disabled={isDisabled}
          onBlur={onBlurMentionsEditor}
          onFocus={onFocus}
          state={newTaskDescription}
          onChange={handleOnChange}
          keyBindingFn={keyBindingMentionsEditor}
          handleKeyCommand={handleKeyMentionsEditor}
        />
      </MainStandardTaskItemCell>
    </StandardTaskItemContainer>
  );
};

export default QuickAddSubatask;
