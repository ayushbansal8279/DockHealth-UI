import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { updateTaskDetails } from 'actions/task-actions';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import debounce from 'lodash.debounce';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { DetailsContainer } from './styled';

const TaskDetails = ({ readOnly }) => {
  const selectedTask = useSelector(selectedTaskSelector);
  const dispatch = useDispatch();
  const [isFocused] = useBoolean();

  const [details, setDetails] = useState(selectedTask?.tokenizedDetails);

  const handleChange = debounce((value) => {
    setDetails(value);
    if (value !== details) {
      dispatch(
        updateTaskDetails(selectedTask, {
          tokenizedDetails: value || '',
        }),
      );
    }
  }, 3000);

  const handleBlur = useCallback(
    (value) => {
      if (selectedTask?.tokenizedDetails !== value) {
        dispatch(
          updateTaskDetails(selectedTask, {
            tokenizedDetails: value || '',
          }),
        );
      }
    },
    [dispatch, selectedTask],
  );

  return (
    <DetailsContainer>
      <CustomTextEditor
        key={selectedTask?.identifier}
        empty={!details || details?.length === 0}
        focused={isFocused}
        label="Details"
        richTextEnabled
      >
        <RichTextEditor
          readonly={readOnly}
          value={details}
          onChange={handleChange}
          onBlur={handleBlur}
          initOnClick
          showCharCount
        />
      </CustomTextEditor>
    </DetailsContainer>
  );
};

export default TaskDetails;
