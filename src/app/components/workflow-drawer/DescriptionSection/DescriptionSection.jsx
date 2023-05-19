import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import usePrevious from 'hooks/use-previous';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import {
  convertFromEditorStateToOutput,
  convertToEditorState,
  isEditorStateEmpty,
} from 'components/common/TextEditor/helpers';
import debounce from 'lodash.debounce';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import TextEditor from "ui-toolkit/Form/TextEditor/TextEditor";

const DescriptionSection = ({ readOnly }) => {
  const DEBOUNCE_TIME = 10000;
  const selectedWorkflow = useSelector(workflowSelector);
  const dispatch = useDispatch();
  const [isFocused] = useBoolean();
  const [detailsState] = useMentionsEditorState(
    convertToEditorState({
      rawText: selectedWorkflow?.description,
      tokenizedText: selectedWorkflow?.tokenizedDescription,
      mentions: selectedWorkflow?.taskMentions,
      handleRichText: true,
    }),
  );

  const isEmptyDetailsState = useMemo(
    () => isEditorStateEmpty(detailsState),
    [detailsState],
  );

  const previousIsFocused = usePrevious(isFocused);

  const updateDetails = useCallback(
    (state) => {
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
    debounce((newState) => {
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

  const [description, setDescription] = useState(selectedWorkflow?.description)

  const handleTextEditorChange = debounce((_, { value }) => {
    setDescription(value)
    if (value !== description) {
      dispatch(
        updatePartialWorkflow(selectedWorkflow?.identifier, {
          description: value,
          descriptionCleared: !value,
        }),
      );
    }
  }, 3000);

  const handleTextEditorBlur = (_, { value }) => {
    if (value !== description) {
      dispatch(
        updatePartialWorkflow(selectedWorkflow?.identifier, {
          description: description,
          descriptionCleared: !description.length,
        }),
      );
    }
  };

  return (
    <CustomTextEditor
      empty={isEmptyDetailsState}
      focused={isFocused}
      label="description"
      richTextEnabled
    >
      <TextEditor
        type="textarea"
        readonly={readOnly}
        value={description}
        onChange={handleTextEditorChange}
        onBlur={handleTextEditorBlur}
      />
    </CustomTextEditor>
  );
};

export default DescriptionSection;
