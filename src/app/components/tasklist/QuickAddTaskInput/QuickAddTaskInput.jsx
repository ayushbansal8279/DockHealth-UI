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

    // useEffect(() => {
    //   if (autofocus) {
    //     // eslint-disable-next-line no-unused-expressions
    //     (quickAddTaskInputReference || reference)?.current?.focus();
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // function resetInput() {
    //   setNewTaskDescription();
    //   setHasInputValue(false);
    //   setError(null);
    // }

    // const handleInputEnterDown = () => {
    //   let validatorError = null;

    //   const { rawText, tokenizedText, mentions } =
    //     convertFromEditorStateToOutput(newTaskDescription, false);

    //   // look for first patient mention to assign to created task
    //   const { identifier: patientIdentifier } =
    //     mentions?.find(({ type }) => type === '#mention') || {};

    //   if (validator) {
    //     validatorError = validator(rawText);
    //     setError(validatorError);
    //   }

    //   if (rawText && !validatorError) {
    //     quickAddTask({ description: tokenizedText, patientIdentifier });
    //     resetInput();

    //     // to reset cursor position inside input
    //     setTimeout(() => {
    //       // eslint-disable-next-line no-unused-expressions
    //       (reference || quickAddTaskInputReference)?.current?.focus();
    //     }, 0);
    //   }
    // };

    // const handleOnChange = (state) => {
    //   if (error) {
    //     setError(null);
    //   }
    //   setNewTaskDescription(state);
    //   setHasInputValue(!!convertFromEditorStateToOutput(state, false).rawText);
    // };

    if (taskListRestrictions?.createTask === DISABLED) {
      return null;
    }

    const handleTextEditorChange = (value) => {
      if (error) {
        setError(null);
      }
      // setDescription(value);
    };


    const handleTextEditorKeyEnter = (value) => {
      quickAddTask({ description: value, taskListIdentifier });
      setDescription('');
    };

    return (
      <>
        <AddTaskInputWrapper hasError={!!error} iconColor={iconColorActive}>
          <div style={{ marginTop: '8px' }}>
            <RichTextEditor
              ref={reference || quickAddTaskInputReference}
              value={description}
              onChange={handleTextEditorChange}
              onKeyEnter={handleTextEditorKeyEnter}
              showToolbar={false}
              multiline={false}
              initOnClick
            />
          </div>
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
