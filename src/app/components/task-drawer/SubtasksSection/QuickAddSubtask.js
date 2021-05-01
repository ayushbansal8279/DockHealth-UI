import React, { useRef, useState } from 'react';
import { convertFromEditorStateToOutput } from 'components/common/MentionsEditor/helpers';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import Spacing from 'components/common/Spacing';
import { validateNewSubtask } from 'helpers/validation-helper';
import {
  AddSubtaskInputWrapper,
  ErrorLabel,
  MentionsEditorContainer,
  QuickAddHint,
} from './styled';

const QuickAddSubtask = ({
  onQuickAddSubtask,
  onFocus,
  onBlur,
  taskListIdentifier = null,
}) => {
  const editorReference = useRef(null);
  const [newTaskDescription, setNewTaskDescription] = useMentionsEditorState();
  const [hasInputValue, setHasInputValue] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

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
    );

    validatorError = validateNewSubtask(rawText);
    setError(validatorError);

    if (rawText && !validatorError) {
      onQuickAddSubtask({
        description: tokenizedText,
      })
        .then(resetInputState)
        .catch(resetInputState);
    }
  };

  const handleOnChange = state => {
    if (error) {
      setError(null);
    }
    setNewTaskDescription(state);
    setHasInputValue(!!convertFromEditorStateToOutput(state).rawText);
  };

  return (
    <AddSubtaskInputWrapper hidePlaceholder={hasInputValue}>
      <MentionsEditorContainer>
        <MentionsEditor
          ref={editorReference}
          taskListIdentifier={taskListIdentifier}
          disabled={isDisabled}
          onFocus={() => {
            setIsFocused(true);
            if (typeof onFocus === 'function') onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);
            if (typeof onBlur === 'function') onBlur();
          }}
          state={newTaskDescription}
          onChange={handleOnChange}
          keyBindingFn={event => {
            if (event.keyCode === 13) {
              return 'enter-command';
            }
            return undefined;
          }}
          handleKeyCommand={command => {
            if (command === 'enter-command') {
              handleInputEnterDown();
              return 'handled';
            }

            return 'not-handled';
          }}
          isDrawerEditor
        />
      </MentionsEditorContainer>
      {hasInputValue && isFocused && !error && (
        <>
          <Spacing horizontal={4} />
          <QuickAddHint>Hit enter to save</QuickAddHint>
        </>
      )}
      {error && <ErrorLabel>{error}</ErrorLabel>}
    </AddSubtaskInputWrapper>
  );
};

export default QuickAddSubtask;
