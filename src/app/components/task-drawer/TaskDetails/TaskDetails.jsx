import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState } from 'draft-js';
import { useBoolean } from 'hooks/useBoolean';
import usePrevious from 'hooks/use-previous';
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
import { DetailsContainer } from './styled';

const TaskDetails = () => {
  const selectedTask = useSelector(selectedTaskSelector);
  const { taskList } = selectedTask || {};
  const { taskListIdentifier } = taskList || {};

  const dispatch = useDispatch();
  const detailsReference = useRef(null);
  const firstRender = useRef(true);
  const [isFocused, setFocused, unsetFocused] = useBoolean();
  const previousIsFocused = usePrevious(isFocused);
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
    if (!firstRender.current && selectedTask) {
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

    if (firstRender) firstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTask]);

  useEffect(() => {
    if (!isFocused && previousIsFocused === true) {
      const {
        tokenizedText,
        rawText,
        mentions,
      } = convertFromEditorStateToOutput(detailsState, true);

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
  }, [detailsState, dispatch, isFocused, previousIsFocused, selectedTask]);

  const onChangeDetailsEditor = useCallback(
    state => {
      setDetailsState(state);
    },
    [setDetailsState],
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
