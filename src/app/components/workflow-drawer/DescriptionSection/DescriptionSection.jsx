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

  const handleChange = debounce((value) => {
    setDescription(value);
    if (value !== description) {
      dispatch(
        updatePartialWorkflow(selectedWorkflow?.identifier, {
          description: value,
          descriptionCleared: !value,
        }),
      );
    }
  }, 3000);

  const handleBlur = useCallback(
    (value) => {
      if (value !== description) {
        dispatch(
          updatePartialWorkflow(selectedWorkflow?.identifier, {
            description,
            descriptionCleared: description.length === 0,
          }),
        );
      }
    },
    [dispatch, selectedWorkflow, description],
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
