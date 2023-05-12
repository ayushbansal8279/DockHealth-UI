import React, {
  useCallback,
  useEffect,
  // useMemo,
  // useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import usePrevious from 'hooks/use-previous';
import { updateTaskDetails } from 'actions/task-actions';
// import { checkIfTemplateTask } from 'helpers/task-helpers';
// import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import {
  // convertFromEditorStateToOutput,
  convertToEditorState,
  // isEditorStateEmpty,
} from 'components/common/TextEditor/helpers';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import debounce from 'lodash.debounce';
import TextArea from 'ui-toolkit/Form/TextArea/TextArea';
import { DetailsContainer } from './styled';

const TaskDetails = ({ readOnly, disableMentions }) => {
  // const DEBOUNCE_TIME = 10000;
  const selectedTask = useSelector(selectedTaskSelector);
  // const { taskList } = selectedTask || {};
  // const { taskListIdentifier } = taskList || {};
  const dispatch = useDispatch();
  // const detailsReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean();
  const [detailsState, setDetailsState] = useState(
    convertToEditorState({
      rawText: selectedTask?.details,
      tokenizedText: selectedTask?.tokenizedDetails,
      mentions: selectedTask?.taskMentions,
      handleRichText: true,
    }),
  );
  const [rawTextState, setRawTextState] = useState(
    selectedTask?.tokenizedDetails,
  );
  // const isTemplateTask = checkIfTemplateTask(selectedTask);

  // const isEmptyDetailsState = useMemo(
  //   () => isEditorStateEmpty(detailsState),
  //   [detailsState],
  // );

  const previousIsFocused = usePrevious(isFocused);

  const updateDetails = useCallback(
    (state) => {
      if (selectedTask) {
        //   console.log(4)
        // const { tokenizedText, rawText, mentions } =
        //   convertFromEditorStateToOutput(state, true);
        // const isChangedText = tokenizedText?.trim() !== rawTextState?.trim();
        // if (!rawTextState && tokenizedText.length === 0) return;
        // if (isChangedText) {
        //   setRawTextState(tokenizedText);
        dispatch(
          updateTaskDetails(selectedTask, {
            tokenizedDetails: state || '',
          }),
        );
        // }
      }
    },
    [dispatch, selectedTask],
  );

  const onDebouncedChange = useCallback(
    (newState) => {
      updateDetails(newState);
    },
    [updateDetails],
  );

  useEffect(() => {
    if (previousIsFocused && !isFocused) {
      onDebouncedChange.cancel();
      updateDetails(detailsState);
    }
  }, [
    detailsState,
    isFocused,
    onDebouncedChange,
    previousIsFocused,
    updateDetails,
  ]);

  // const onChangeDetailsEditor = useCallback(
  //   (state, { value }) => {
  //     setDetailsState(value);
  //     onDebouncedChange(value);
  //   },
  //   [onDebouncedChange, setDetailsState],
  // );

  const handleTextAreaChange = debounce((_, { value }) => {
    dispatch(
      updateTaskDetails(selectedTask, {
        tokenizedDetails: value || '',
      }),
    );
  }, 5000);

  const handleTextAreaBlur = (_, { value }) => {
    dispatch(
      updateTaskDetails(selectedTask, {
        tokenizedDetails: value || '',
      }),
    );
  };

  return (
    <DetailsContainer>
      <TextArea
        value={rawTextState}
        placeholder="Task details"
        onChange={handleTextAreaChange}
        onBlur={handleTextAreaBlur}
        mentions={selectedTask?.taskMentions}
        enabled={{
          mentions: true,
        }}
      />
      {/*<RichTextEditor onChange={onChangeDetailsEditor} value={rawTextState} textArea isToolbarActive />*/}
      {/*<CustomTextEditor*/}
      {/*  key={selectedTask?.identifier}*/}
      {/*  empty={isEmptyDetailsState}*/}
      {/*  focused={isFocused}*/}
      {/*  label="details2"*/}
      {/*  richTextEnabled*/}
      {/*>*/}
      {/*  <TextEditor*/}
      {/*    readOnly={readOnly}*/}
      {/*    minHeight={100}*/}
      {/*    ref={detailsReference}*/}
      {/*    taskListIdentifier={taskListIdentifier}*/}
      {/*    disableMentions={disableMentions || isTemplateTask}*/}
      {/*    showToolbar*/}
      {/*    onFocus={setFocused}*/}
      {/*    onBlur={unsetFocused}*/}
      {/*    state={detailsState}*/}
      {/*    onChange={onChangeDetailsEditor}*/}
      {/*  />*/}
      {/*</CustomTextEditor>*/}
    </DetailsContainer>
  );
};

export default TaskDetails;
