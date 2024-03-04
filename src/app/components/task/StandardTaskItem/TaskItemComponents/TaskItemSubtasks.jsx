import React from 'react';
import SubtaskIcon from 'img/SubtaskIcon';
import ParentTaskIcon from 'img/ParentTaskIcon';
import {
  // AddPlaceholder,
  // AddSubtaskButton,
  SubtasksCellContentButton,
  SubtasksCellText,
} from '../../styled';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

const TaskItemSubtasks = ({
  isSubtask,
  subtaskQuickAddOpen,
  subtasksDisabled,
  subTasksCount,
  isOpen,
  isNestedTask,
  onSubtaskLabelClick,
  // taskIdentifier,
  // openQuickAddSubtask,
  // dispatch,
  // readOnly,
}) => {
  // const onClickAddSubtask = useCallback(
  //   () => dispatch(openQuickAddSubtask(taskIdentifier)),
  //   [dispatch, openQuickAddSubtask, taskIdentifier],
  // );
  return !isSubtask &&
    !subtaskQuickAddOpen &&
    !subtasksDisabled &&
    !subTasksCount ? (
    <>
      {/* {!readOnly && (
        <AddSubtaskButton type="button" onClick={onClickAddSubtask}>
          <AddPlaceholder>+ Add</AddPlaceholder>
        </AddSubtaskButton>
      )} */}
    </>
  ) : (
    <>
      {(subTasksCount || isSubtask) && (
        <Tooltip placement="top" title={isOpen ? '' : 'Add Subtask'}>
          <SubtasksCellContentButton
            isOpen={isOpen}
            disabled={isNestedTask}
            isGreyedOut={subtasksDisabled}
            onClick={onSubtaskLabelClick}
          >
            {!isSubtask ? (
              <>
                <SubtasksCellText>{subTasksCount}</SubtasksCellText>
                <ParentTaskIcon />
              </>
            ) : (
              <SubtaskIcon />
            )}
          </SubtasksCellContentButton>
        </Tooltip>
      )}
    </>
  );
};

export default TaskItemSubtasks;
