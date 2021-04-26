import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Circle from 'img/circle';
import { validateNewSubtask } from 'helpers/validation-helper';
import { onSubtaskAdded } from 'helpers/ga-event-helper';
import { convertFromEditorStateToOutput } from 'components/common/MentionsEditor/helpers';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import { useMentionsEditorState } from 'components/common/MentionsEditor/use-mentions-editor-state';
import { addSubtask, closeQuickAddSubtask } from 'actions/task-actions';
import {
  StandardTaskItemContainer,
  MainStandardTaskItemCell,
  StandardTaskItemCell,
  CircleIcon,
} from '../styled';

const QuickAddSubatask = ({
  patientVisible,
  listNameVisible,
  parentTaskIdentifier,
  taskListIdentifier = null,
  multipleAssigneesContext,
  onFocus,
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
            if (!hasInputValue)
              dispatch(closeQuickAddSubtask(parentTaskIdentifier));
          }}
          onFocus={onFocus}
          state={newTaskDescription}
          onChange={handleOnChange}
          keyBindingFn={event => {
            if (event.key === 'Enter') {
              return 'enter-command';
            }
            if (event.key === 'Escape') {
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
              editorReference.current.blur();
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
      <StandardTaskItemCell width={`${multipleAssigneesContext ? 90 : 60}px`} />
      {listNameVisible && <StandardTaskItemCell width="168px" />}
    </StandardTaskItemContainer>
  );
};

export default QuickAddSubatask;
