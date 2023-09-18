import React, { useCallback, useState, useEffect } from 'react';
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

  useEffect(() => {
    setDetails(selectedTask?.tokenizedDetails);
  }, [selectedTask]);

  const handleAutoSave = debounce((value) => {
    if (value !== (selectedTask?.tokenizedDetails || '')) {
      dispatch(
        updateTaskDetails(selectedTask, {
          tokenizedDetails: value || '',
        }),
      );
    }
    // eslint-disable-next-line unicorn/numeric-separators-style
  }, 10000);

  const handleChange = (value) => {
    setDetails(value);
    handleAutoSave.cancel();
    handleAutoSave(value);
  };

  const handleBlur = useCallback(
    (value) => {
      if (selectedTask?.tokenizedDetails !== value) {
        dispatch(
          updateTaskDetails(selectedTask, {
            tokenizedDetails: value || '',
          }),
        );
        handleAutoSave.cancel();
      }
    },
    [dispatch, handleAutoSave, selectedTask],
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
          taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
          mentions={selectedTask?.taskMentions}
        />
      </CustomTextEditor>
    </DetailsContainer>
  );
};

export default TaskDetails;
