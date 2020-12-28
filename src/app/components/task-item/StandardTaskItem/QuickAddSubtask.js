import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Circle from 'img/circle';
import { validateNewSubtask } from 'helpers/validation-helper';
import { convertFromEditorStateToOutput } from 'components/common/MentionsEditor/helpers';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { saveTask } from 'actions/task-actions';
import {
  StandardTaskItemContainer,
  MainStandardTaskItemCell,
  StandardTaskItemCell,
  CircleIcon,
} from '../styled';

const QuickAddSubatask = ({
  setQuickAddOpen,
  patientVisible,
  listNameVisible,
  parentTaskIdentifier,
  taskListIdentifier = null,
}) => {
  const editorReference = useRef(null);
  const [newTaskDescription, setNewTaskDescription] = useMentionsEditorState();
  const [hasInputValue, setHasInputValue] = useState(false);
  const [error, setError] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      editorReference.current.focus();
    }, []);
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
    );

    validatorError = validateNewSubtask(rawText);
    setError(validatorError);

    if (rawText && !validatorError) {
      saveTask({
        description: tokenizedText,
        taskListIdentifier,
        parentTaskIdentifier,
      })(dispatch)
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
    <StandardTaskItemContainer>
      <MainStandardTaskItemCell
        bolded
        position="static"
        alignItems="flex-start"
        paddingLeft="huge"
        paddingRight="small"
      >
        <CircleIcon src={Circle} />
        <MentionsEditor
          ref={editorReference}
          taskListIdentifier={taskListIdentifier}
          disabled={isDisabled}
          onBlur={() => {
            if (!hasInputValue) setQuickAddOpen(false);
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
        />
      </MainStandardTaskItemCell>
      <StandardTaskItemCell width="60px" />
      {patientVisible && <StandardTaskItemCell width="164px" />}
      <StandardTaskItemCell width="120px" />
      <StandardTaskItemCell width="150px" />
      <StandardTaskItemCell width="60px" />
      <StandardTaskItemCell width="60px" />
      {listNameVisible && <StandardTaskItemCell width="168px" />}
    </StandardTaskItemContainer>
  );
};

export default QuickAddSubatask;
