import { convertFromEditorStateToOutput } from 'components/common/MentionsEditor/helpers';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import Spacing from 'components/common/Spacing';
import React, { useRef, useState } from 'react';
import {
  AddTaskInputWrapper,
  MentionsEditorContainer,
  ErrorLabel,
  QuickAddHint,
} from './styled';

const QuickAddTaskInput = React.forwardRef(
  (
    {
      quickAddTask,
      onFocus,
      validator,
      taskListIdentifier = null,
      disableMentions = false,
    },
    reference,
  ) => {
    const [
      newTaskDescription,
      setNewTaskDescription,
    ] = useMentionsEditorState();
    const [hasInputValue, setHasInputValue] = useState(false);
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const quickAddTaskInputReference = useRef(null);

    const handleInputEnterDown = () => {
      let validatorError = null;

      const {
        rawText,
        tokenizedText,
        mentions,
      } = convertFromEditorStateToOutput(newTaskDescription);

      // look for first patient mention to assign to created task
      const { identifier: patientIdentifier } =
        mentions?.find(({ type }) => type === '#mention') || {};

      if (validator) {
        validatorError = validator(rawText);
        setError(validatorError);
      }

      if (rawText && !validatorError) {
        quickAddTask({ description: tokenizedText, patientIdentifier });
        setNewTaskDescription();
        setHasInputValue(false);

        if (validator) {
          setError(null);
        }

        // to reset cursor position inside input
        setTimeout(() => {
          // eslint-disable-next-line no-unused-expressions
          (reference || quickAddTaskInputReference)?.current?.focus();
        }, 0);
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
      <>
        <AddTaskInputWrapper hasError={!!error}>
          <MentionsEditorContainer>
            <MentionsEditor
              ref={reference || quickAddTaskInputReference}
              taskListIdentifier={taskListIdentifier}
              disableMentions={disableMentions}
              placeholder="Add a task and press enter on your keyboard"
              onFocus={() => {
                setIsFocused(true);
                if (typeof onFocus === 'function') onFocus();
              }}
              onBlur={() => setIsFocused(false)}
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
            />
          </MentionsEditorContainer>
          {hasInputValue && isFocused && (
            <>
              <Spacing horizontal={4} />
              <QuickAddHint>Press enter to save this task</QuickAddHint>
            </>
          )}
        </AddTaskInputWrapper>
        {error && <ErrorLabel>{error}</ErrorLabel>}
      </>
    );
  },
);

export default QuickAddTaskInput;
