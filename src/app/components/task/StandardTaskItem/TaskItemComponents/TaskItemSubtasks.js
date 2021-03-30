import React, { useCallback } from 'react';
import SubtaskIcon from 'img/SubtaskIcon';
import ParentTaskIcon from 'img/ParentTaskIcon';
import {
  AddPlaceholder,
  AddSubtaskButton,
  StandardTaskItemCell,
  SubtasksCellContentButton,
  SubtasksCellText,
} from '../../styled';

const TaskItemSubtasks = ({
  isSubtask,
  subtaskQuickAddOpen,
  subtasksDisabled,
  subTasksCount,
  isHovered,
  isOpen,
  isNestedTask,
  onSubtaskLabelClick,
  taskIdentifier,
  openQuickAddSubtask,
  dispatch,
}) => {
  const onClickAddSubtask = useCallback(
    () => dispatch(openQuickAddSubtask(taskIdentifier)),
    [dispatch, openQuickAddSubtask, taskIdentifier],
  );
  return (
    <StandardTaskItemCell
      width="60px"
      justify="center"
      paddingLeft="tiny"
      paddingRight="tiny"
    >
      {!isSubtask &&
      !subtaskQuickAddOpen &&
      !subtasksDisabled &&
      !subTasksCount ? (
        <AddSubtaskButton type="button" onClick={onClickAddSubtask}>
          {isHovered && <AddPlaceholder>+ Add</AddPlaceholder>}
        </AddSubtaskButton>
      ) : (
        <>
          {(subTasksCount || isSubtask) && (
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
          )}
        </>
      )}
    </StandardTaskItemCell>
  );
};

export default TaskItemSubtasks;
