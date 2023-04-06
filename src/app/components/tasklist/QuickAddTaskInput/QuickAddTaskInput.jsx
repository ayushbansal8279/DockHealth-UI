/* eslint-disable import/extensions */
import { convertFromEditorStateToOutput } from 'components/common/TextEditor/helpers';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import Spacing from 'components/common/Spacing';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  TASK_LIST_RESTRICTIONS_PROFILES,
  TASK_LIST_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import {
  AddTaskInputWrapper,
  MentionsEditorContainer,
  ErrorLabel,
  QuickAddHint,
} from './styled';
import RichTextEditor from "components/RichTextEditorV2/RichTextEditor";
import TextEditor from "../../../../ui-toolkit/Form/TextEditor/TextEditor";

const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

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
      iconColorActive,
    },
    reference,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const [newTaskDescription, setNewTaskDescription] =
      useMentionsEditorState();
    const [hasInputValue, setHasInputValue] = useState(false);
    const [error, setError] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const quickAddTaskInputReference = useRef(null);

    const currentUser = useSelector(userProfileSelector);
    const taskListRestrictions =
      TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];

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

      const { rawText, tokenizedText, mentions } =
        convertFromEditorStateToOutput(newTaskDescription, false);

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

    const handleOnChange = (state) => {
      if (error) {
        setError(null);
      }
      setNewTaskDescription(state);
      setHasInputValue(!!convertFromEditorStateToOutput(state, false).rawText);
    };

    if (taskListRestrictions?.createTask === DISABLED) {
      return null;
    }

    const [description, setDescription] = useState("")

    const handleTextEditorChange = (_, { value }) => {
      setDescription(value)
    }

    const handleTextEditorBlur = (editor, {  value }) => {
      quickAddTask({ description: value, taskListIdentifier })
      setDescription("")
      setTimeout(() => {
        editor.blur()
      }, 250)
    }

    const handleTextEditorKeyDown = (_, { key, value }) => {
      if (key === "Enter") {
        quickAddTask({ description: value, taskListIdentifier })
        setDescription("")
      }
    }

    return (
      <>
        <AddTaskInputWrapper hasError={!!error} iconColor={iconColorActive}>
          <TextEditor
            type="input"
            value={description}
            onChange={handleTextEditorChange}
            onBlur={handleTextEditorBlur}
            onKeyDown={handleTextEditorKeyDown}
          />
          {/*<RichTextEditor noStyle value={description} onChange={setDescription} onSubmit={(description) => {*/}
          {/*  setDescription("")*/}
          {/*  quickAddTask({ description: description.trim(), taskListIdentifier: taskListIdentifier })*/}
          {/*}} isSingleLine/>*/}
          {/*<MentionsEditorContainer>*/}
          {/*  <TextEditor*/}
          {/*    ref={reference || quickAddTaskInputReference}*/}
          {/*    taskListIdentifier={taskListIdentifier}*/}
          {/*    disableMentions={disableMentions}*/}
          {/*    placeholder={*/}
          {/*      small*/}
          {/*        ? 'Add a task'*/}
          {/*        : 'Add a task and press enter on your keyboard'*/}
          {/*    }*/}
          {/*    onFocus={() => {*/}
          {/*      setIsFocused(true);*/}
          {/*      if (typeof onFocus === 'function') onFocus();*/}
          {/*    }}*/}
          {/*    onBlur={() => {*/}
          {/*      const { tokenizedText } = convertFromEditorStateToOutput(*/}
          {/*        newTaskDescription,*/}
          {/*        false,*/}
          {/*      );*/}
          {/*      setIsFocused(false);*/}
          {/*      if (typeof onBlur === 'function') onBlur(tokenizedText);*/}
          {/*    }}*/}
          {/*    state={newTaskDescription}*/}
          {/*    onChange={handleOnChange}*/}
          {/*    keyBindingFn={(event) => {*/}
          {/*      if (event.keyCode === 13) {*/}
          {/*        return 'enter-command';*/}
          {/*      }*/}
          {/*      if (event.keyCode === 27) {*/}
          {/*        return 'escape-command';*/}
          {/*      }*/}
          {/*    }}*/}
          {/*    handleKeyCommand={(command) => {*/}
          {/*      if (command === 'enter-command') {*/}
          {/*        handleInputEnterDown();*/}
          {/*        return 'handled';*/}
          {/*      }*/}

          {/*      if (command === 'escape-command') {*/}
          {/*        resetInput();*/}
          {/*        // eslint-disable-next-line no-unused-expressions*/}
          {/*        (reference || quickAddTaskInputReference)?.current?.blur();*/}
          {/*        return 'handled';*/}
          {/*      }*/}

          {/*      return 'not-handled';*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</MentionsEditorContainer>*/}
          {/*{!small && hasInputValue && isFocused && (*/}
          {/*  <>*/}
          {/*    <Spacing horizontal={4} />*/}
          {/*    <QuickAddHint>Press enter to save this task</QuickAddHint>*/}
          {/*  </>*/}
          {/*)}*/}
        </AddTaskInputWrapper>
        {error && <ErrorLabel>{error}</ErrorLabel>}
      </>
    );
  },
);

export default QuickAddTaskInput;
