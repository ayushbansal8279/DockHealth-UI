import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import usePrevious from 'hooks/use-previous';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
  isEditorStateEmpty,
} from 'components/common/TextEditor/helpers';
import debounce from 'lodash.debounce';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import { updatePartialWorkflow } from 'actions/task-template-actions';

const DescriptionSection = () => {
  const DEBOUNCE_TIME = 3000;
  const selectedWorkflow = useSelector(workflowSelector);
  const { taskList } = selectedWorkflow || {};
  const { taskListIdentifier } = taskList || {};
  const dispatch = useDispatch();
  const detailsReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean();
  const [detailsState, setDetailsState] = useMentionsEditorState(
    convertToEditorState({
      rawText: selectedWorkflow?.description,
      tokenizedText: selectedWorkflow?.tokenizedDescription,
      mentions: selectedWorkflow?.taskMentions,
      handleRichText: true,
    }),
  );

  const isTemplateWorkflow = checkIfTemplateTask(selectedWorkflow);

  const isEmptyDetailsState = useMemo(() => isEditorStateEmpty(detailsState), [
    detailsState,
  ]);

  const previousIsFocused = usePrevious(isFocused);

  const updateDetails = useCallback(
    state => {
      const { tokenizedText } = convertFromEditorStateToOutput(state, true);
      if (
        selectedWorkflow &&
        selectedWorkflow?.identifier &&
        selectedWorkflow?.description !== tokenizedText &&
        (selectedWorkflow?.description || tokenizedText !== '')
      ) {
        dispatch(
          updatePartialWorkflow(selectedWorkflow?.identifier, {
            description: tokenizedText || '',
            descriptionCleared: !(tokenizedText && tokenizedText !== ''),
          }),
        );
      }
    },
    [dispatch, selectedWorkflow],
  );

  const onDebouncedChange = useCallback(
    debounce(newState => {
      updateDetails(newState);
    }, DEBOUNCE_TIME),
    [updateDetails],
  );

  useEffect(() => {
    if (previousIsFocused && !isFocused) {
      onDebouncedChange.cancel();
      updateDetails(detailsState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onChangeDetailsEditor = useCallback(
    state => {
      setDetailsState(state);
      onDebouncedChange(state);
    },
    [onDebouncedChange, setDetailsState],
  );

  return (
    <CustomTextEditor
      key={selectedWorkflow?.identifier}
      empty={isEmptyDetailsState}
      focused={isFocused}
      label="description"
      richTextEnabled
    >
      <TextEditor
        minHeight={100}
        ref={detailsReference}
        taskListIdentifier={taskListIdentifier}
        disableMentions={isTemplateWorkflow}
        showToolbar
        onFocus={setFocused}
        onBlur={unsetFocused}
        state={detailsState}
        onChange={onChangeDetailsEditor}
      />
    </CustomTextEditor>
  );
};

export default DescriptionSection;
