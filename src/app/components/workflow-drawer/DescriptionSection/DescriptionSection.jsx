import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import debounce from 'lodash.debounce';
import { workflowSelector } from 'selectors/workflow-drawer-selectors';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';

const DescriptionSection = ({ readOnly }) => {
  const selectedWorkflow = useSelector(workflowSelector);
  const dispatch = useDispatch();
  const [isFocused] = useBoolean();

  const [description, setDescription] = useState(
    selectedWorkflow?.tokenizedDescription,
  );

  const handleAutoSave = debounce((value) => {
    if (value !== selectedWorkflow?.tokenizedDescription || '') {
      dispatch(
        updatePartialWorkflow(selectedWorkflow?.identifier, {
          description: value,
          descriptionCleared: !value,
        }),
      );
    }
    // eslint-disable-next-line unicorn/numeric-separators-style
  }, 10000);

  const handleChange = (value) => {
    setDescription(value);
    handleAutoSave.cancel();
    handleAutoSave(value);
  };

  const handleBlur = useCallback(
    (value) => {
      if (value !== selectedWorkflow?.tokenizedDescription || '') {
        dispatch(
          updatePartialWorkflow(selectedWorkflow?.identifier, {
            description: value,
            descriptionCleared: !value,
          }),
        );
        handleAutoSave.cancel();
      }
    },
    [dispatch, handleAutoSave, selectedWorkflow],
  );

  return (
    <CustomTextEditor
      key={selectedWorkflow?.identifier}
      empty={!description || description?.length === 0}
      focused={isFocused}
      label="description"
      richTextEnabled
    >
      <RichTextEditor
        readonly={readOnly}
        value={description}
        onChange={handleChange}
        onBlur={handleBlur}
        initOnClick
        showCharCount
      />
    </CustomTextEditor>
  );
};

export default DescriptionSection;
