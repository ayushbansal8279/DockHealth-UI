import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState } from 'draft-js';
import { useBoolean } from 'hooks/useBoolean';
import { updateTaskDetails } from 'actions/task-actions';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import CustomTextEditor from 'components/task-drawer/CustomTextEditor/CustomTextEditor';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
  isEditorStateEmpty,
} from 'components/common/TextEditor/helpers';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import debounce from 'lodash.debounce';
import { DetailsContainer } from './styled';

const TaskDetails = () => {
  const DEBOUNCE_TIME = 3000;
  const selectedTask = useSelector(selectedTaskSelector);
  const { taskList, taskIdentifier } = selectedTask || {};
  const { taskListIdentifier } = taskList || {};
  const dispatch = useDispatch();
  const detailsReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean();
  const [detailsState, setDetailsState] = useMentionsEditorState(
    convertToEditorState({
      rawText: selectedTask?.details,
      tokenizedText: selectedTask?.tokenizedDetails,
      mentions: selectedTask?.taskMentions,
      handleRichText: true,
    }),
  );
  const isTemplateTask = checkIfTemplateTask(selectedTask);

  const isEmptyDetailsState = useMemo(() => isEditorStateEmpty(detailsState), [
    detailsState,
  ]);

  useLayoutEffect(() => {
    if (selectedTask) {
      if (selectedTask.details) {
        const newContent = createMentionEntities(
          selectedTask.tokenizedDetails,
          selectedTask.details,
          selectedTask.taskMentions,
          true,
        );
        setDetailsState(EditorState.push(detailsState, newContent));
      } else {
        setDetailsState();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIdentifier]);

  const updateDetails = useCallback(
    state => {
      if (selectedTask) {
        const {
          tokenizedText,
          rawText,
          mentions,
        } = convertFromEditorStateToOutput(state, true);

        dispatch(
          updateTaskDetails(selectedTask, {
            tokenizedDetails: tokenizedText || '',
            details: rawText || '',
            taskMentions: [
              ...(selectedTask.taskMentions || []),
              ...(mentions || []),
            ],
          }),
        );
      }
    },
    [dispatch, selectedTask],
  );

  const onDebouncedChange = useCallback(
    debounce(newState => {
      updateDetails(newState);
    }, DEBOUNCE_TIME),
    [updateDetails],
  );

  const onChangeDetailsEditor = useCallback(
    state => {
      setDetailsState(state);
      onDebouncedChange(state);
    },
    [onDebouncedChange, setDetailsState],
  );

  return (
    <DetailsContainer>
      <CustomTextEditor
        empty={isEmptyDetailsState}
        focused={isFocused}
        label="details"
        richTextEnabled
      >
        <TextEditor
          minHeight={100}
          ref={detailsReference}
          taskListIdentifier={taskListIdentifier}
          disableMentions={isTemplateTask}
          showToolbar
          onFocus={setFocused}
          onBlur={unsetFocused}
          state={detailsState}
          onChange={onChangeDetailsEditor}
          keyBindingFn={event => {
            if (event.keyCode === 13 && !event.nativeEvent.shiftKey) {
              return 'enter-command';
            }
            return undefined;
          }}
          handleKeyCommand={command => {
            if (command === 'enter-command') {
              detailsReference.current.blur();
              return 'handled';
            }

            return 'not-handled';
          }}
        />
      </CustomTextEditor>
    </DetailsContainer>
  );
};

export default TaskDetails;
