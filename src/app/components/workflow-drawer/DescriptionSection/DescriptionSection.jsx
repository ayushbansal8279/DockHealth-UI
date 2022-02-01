import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import usePrevious from 'hooks/use-previous';
import { checkIfTemplateTask } from 'helpers/task-helpers';
import CustomTextEditor from 'components/task-drawer/CustomTextEditor/CustomTextEditor';
import TextEditor from 'components/common/TextEditor/TextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import {
  convertFromEditorStateToOutput,
  isEditorStateEmpty,
} from 'components/common/TextEditor/helpers';
import debounce from 'lodash.debounce';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { createMentionEntities } from 'components/common/TextEditor/create-mention-entities';
import { EditorState } from 'draft-js';

const DescriptionSection = () => {
  const DEBOUNCE_TIME = 3000;
  const selectedWorkflow = useSelector(workflowSelector);
  const { taskList } = selectedWorkflow || {};
  const { taskListIdentifier } = taskList || {};
  const dispatch = useDispatch();
  const detailsReference = useRef(null);
  const [isFocused, setFocused, unsetFocused] = useBoolean();
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);

  const [detailsState, setDetailsState] = useMentionsEditorState();
  const isDescriptionInitialized = useRef(false);

  useEffect(() => {
    if (selectedWorkflow?.tokenizedDescription) {
      // setRawTextState(selectedWorkflow.description);
      const newContent = createMentionEntities(
        selectedWorkflow.tokenizedDescription,
        selectedWorkflow.description,
        selectedWorkflow.taskMentions || [],
        true,
      );
      isDescriptionInitialized.current = true;
      setDetailsState(EditorState.push(detailsState, newContent));
    } else {
      isDescriptionInitialized.current = true;
      setDetailsState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkflow?.tokenizedDescription]);

  const isTemplateWorkflow = checkIfTemplateTask(selectedWorkflow);

  const isEmptyDetailsState = useMemo(() => isEditorStateEmpty(detailsState), [
    detailsState,
  ]);

  const previousIsFocused = usePrevious(isFocused);

  useEffect(() => {
    if (
      detailsReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.DESCRIPTION
    ) {
      detailsReference.current.focus();
    }
  }, [autoFocusFieldName]);

  const updateDetails = useCallback(
    state => {
      const { tokenizedText } = convertFromEditorStateToOutput(state, true);

      if (!isDescriptionInitialized.current) {
        dispatch(
          updatePartialWorkflow(selectedWorkflow?.identifier, {
            description: tokenizedText || '',
            descriptionCleared: !(tokenizedText && tokenizedText !== ''),
          }),
        );
      } else {
        isDescriptionInitialized.current = false;
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
