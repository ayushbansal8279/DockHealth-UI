/* eslint-disable import/extensions */
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import Spacing from 'components/common/Spacing';
import React, { useEffect, useRef, useState } from 'react';
import {
  AddTaskInputWrapper,
  MentionsEditorContainer,
  ErrorLabel,
  QuickAddHint,
} from './styled';

const QuickAddTaskInput = React.forwardRef(
  (
    {
      autofocus,
      quickAddTask,
      onFocus,
      onBlur,
      validator,
      taskListIdentifier = null,
      disableMentions = false,
      small,
      disabled = false,
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const [
      newTaskDescription,
      setNewTaskDescription,
    ] = useMentionsEditorState();
    const [hasInputValue, setHasInputValue] = useState(false);
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const quickAddTaskInputReference = useRef(null);

    useEffect(() => {
      if (autofocus) {
        // eslint-disable-next-line no-unused-expressions
        (quickAddTaskInputReference || reference)?.current?.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function resetInput() {
      setNewTaskDescription();
      setHasInputValue(false);
      setError(null);
    }

    const handleInputEnterDown = () => {
      let validatorError = null;

      const {
        rawText,
        tokenizedText,
        mentions,
      } = convertFromEditorStateToOutput(newTaskDescription, false);

      // look for first patient mention to assign to created task
      const { identifier: patientIdentifier } =
        mentions?.find(({ type }) => type === '#mention') || {};

      if (validator) {
        validatorError = validator(rawText);
        setError(validatorError);
      }

      if (rawText && !validatorError) {
        quickAddTask({ description: tokenizedText, patientIdentifier });
        resetInput();

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
      if (!disabled) {
        setNewTaskDescription(state);
        setHasInputValue(
          !!convertFromEditorStateToOutput(state, false).rawText,
        );
      }
    };

    return (
      <>
        <AddTaskInputWrapper hasError={!!error} disabled={disabled}>
          <MentionsEditorContainer>
            <TextEditor
              ref={reference || quickAddTaskInputReference}
              taskListIdentifier={taskListIdentifier}
              disableMentions={disableMentions}
              placeholder={
                small
                  ? 'Add a task'
                  : 'Add a task and press enter on your keyboard'
              }
              onFocus={() => {
                setIsFocused(true);
                if (typeof onFocus === 'function') onFocus();
              }}
              onBlur={() => {
                const { tokenizedText } = convertFromEditorStateToOutput(
                  newTaskDescription,
                  false,
                );
                setIsFocused(false);
                if (typeof onBlur === 'function') onBlur(tokenizedText);
              }}
              state={newTaskDescription}
              onChange={handleOnChange}
              keyBindingFn={event => {
                if (event.keyCode === 13) {
                  return 'enter-command';
                }
                if (event.keyCode === 27) {
                  return 'escape-command';
                }

                return undefined;
              }}
              handleKeyCommand={command => {
                if (command === 'enter-command') {
                  handleInputEnterDown();
                  return 'handled';
                }

                if (command === 'escape-command') {
                  resetInput();
                  // eslint-disable-next-line no-unused-expressions
                  (reference || quickAddTaskInputReference)?.current?.blur();
                  return 'handled';
                }

                return 'not-handled';
              }}
            />
          </MentionsEditorContainer>
          {!small && hasInputValue && isFocused && (
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
