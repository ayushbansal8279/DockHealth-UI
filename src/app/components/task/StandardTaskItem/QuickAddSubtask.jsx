/* eslint-disable import/extensions */
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Circle from 'img/circle.svg';
// import { validateNewSubtask } from 'helpers/validation-helper';
import { onSubtaskAdded } from 'helpers/ga-event-helper';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { addSubtask, closeQuickAddSubtask } from 'actions/task-actions';
import {
  StandardTaskItemContainer,
  MainStandardTaskItemCell,
  CircleIcon,
} from '../styled';

const QuickAddSubtask = ({
  parentTaskIdentifier,
  taskListIdentifier = null,
  onFocus,
  iconColorActive,
  origin,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const editorReference = useRef(null);
  const [currentValue, setCurrentValue] = useState('');
  const [hasInputValue, setHasInputValue] = useState(false);
  const [error, setError] = useState(null);
  const [isDisabled, setDisabled] = useState(false);
  const [isValueReset, setValueReset] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editorReference.current) editorReference.current.focus();
  }, []);

  const resetInputState = () => {
    setDisabled(false);
    setHasInputValue(false);

    // setCurrentValue('');
    setValueReset(true);
    editorReference.current?.focus();
  };

  const onBlurTextEditor = () => {
    if (!hasInputValue) dispatch(closeQuickAddSubtask(parentTaskIdentifier));
  };

  const handleTextEditorChange = (value) => {
    if (error) {
      setError(null);
    }
    setCurrentValue(value);
  };

  const handleTextEditorKeyEnter = (value) => {
    onSubtaskAdded('Quick add input');
    dispatch(
      addSubtask(parentTaskIdentifier, {
        description: value,
        taskListIdentifier,
      }),
    )
      .then(resetInputState)
      .catch(resetInputState);
  };

  return (
    <StandardTaskItemContainer
      isAddingTask
      iconColorActive={iconColorActive}
      origin={origin}
    >
      <MainStandardTaskItemCell
        bolded
        position="static"
        alignItems="flex-start"
        paddingLeft="huge"
        paddingRight="small"
      >
        <CircleIcon src={Circle} />
        <Box flex={1} overflow="hidden">
          <RichTextEditor
            placeholder="Subtask description"
            ref={editorReference}
            value={currentValue}
            reset={isValueReset}
            onBlur={onBlurTextEditor}
            onChange={handleTextEditorChange}
            onKeyEnter={handleTextEditorKeyEnter}
            onFocus={onFocus}
            showToolbar={false}
            multiline={false}
            disableToolbar
            showToolbarInline
            initOnClick
          />
        </Box>
      </MainStandardTaskItemCell>
    </StandardTaskItemContainer>
  );
};

export default QuickAddSubtask;
