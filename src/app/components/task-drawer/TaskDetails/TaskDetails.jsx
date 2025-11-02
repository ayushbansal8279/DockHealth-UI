import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { updateTaskDetails } from 'actions/task-actions';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import debounce from 'lodash.debounce';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { DetailsContainer } from './styled';

const TaskDetails = ({
  readOnly,
  addTaskDrawer,
  taskDetail,
  setTaskDetail,
}) => {
  const selectedTask = useSelector(selectedTaskSelector);
  const dispatch = useDispatch();
  const [isFocused] = useBoolean();

  const [details, setDetails] = useState(selectedTask?.tokenizedDetails);

  useEffect(() => {
    setDetails(selectedTask?.tokenizedDetails);
  }, [selectedTask]);

  const handleAutoSave = debounce((value) => {
    if (addTaskDrawer && value !== (selectedTask?.tokenizedDetails || '')) {
      dispatch(
        updateTaskDetails(selectedTask, {
          tokenizedDetails: value || '',
        }),
      );
    }
    // eslint-disable-next-line unicorn/numeric-separators-style
  }, 10000);

  const handleChange = (value) => {
    if (!addTaskDrawer) {
      setDetails(value);
      handleAutoSave.cancel();
      handleAutoSave(value);
    } else {
      setTaskDetail(value);
    }
  };

  const handleBlur = useCallback(
    (value) => {
      if (selectedTask?.tokenizedDetails !== value && !addTaskDrawer) {
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
      Details
      <CustomTextEditor
        key={selectedTask?.identifier}
        empty={!details || details?.length === 0}
        focused={isFocused}
        richTextEnabled
        addExtraPaddingOnTop
      >
        <RichTextEditor
          readonly={readOnly}
          value={addTaskDrawer ? taskDetail : details}
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
