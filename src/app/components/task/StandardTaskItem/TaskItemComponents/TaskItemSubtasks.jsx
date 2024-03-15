import React, { useCallback } from 'react';
import SubtaskIcon from 'img/SubtaskIcon';
import ParentTaskIcon from 'img/ParentTaskIcon';
import {
  AddPlaceholder,
  AddSubtaskButton,
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
  // onClickAddSubtask,
  taskIdentifier,
  openQuickAddSubtask,
  dispatch,
  origin,
  // readOnly,
}) => {
  const onClickAddSubtask = useCallback(
    (event) => {
      event.stopPropagation();
      dispatch(openQuickAddSubtask(taskIdentifier));
    },
    [dispatch, openQuickAddSubtask, taskIdentifier],
  );

  return !isSubtask &&
    !subtaskQuickAddOpen &&
    !subtasksDisabled &&
    !subTasksCount ? (
    <>
      {
        <AddSubtaskButton type="button">
          <AddPlaceholder>
            <SubtasksCellContentButton
              // isOpen={isOpen}
              // disabled={isNestedTask}
              // isGreyedOut={subtasksDisabled}
              // onClick={onSubtaskLabelClick}
              // subtasksDisabled={subtasksDisabled}
              subTasksCount={subTasksCount}
            >
              <>
                <Tooltip placement="top" title="Add Subtask">
                  <SubtasksCellText onClick={onClickAddSubtask}>
                    +
                  </SubtasksCellText>
                </Tooltip>
                <ParentTaskIcon />
              </>
            </SubtasksCellContentButton>
          </AddPlaceholder>
        </AddSubtaskButton>
      }
    </>
  ) : (
    <>
      {(subTasksCount || isSubtask) && (
        <Tooltip
          placement="top"
          title={subtasksDisabled ? '' : isOpen ? '' : 'Show Subtasks'}
        >
          <SubtasksCellContentButton
            isOpen={isOpen}
            disabled={origin === 'LIST' ? !isNestedTask : isNestedTask}
            isGreyedOut={subtasksDisabled}
            onClick={onSubtaskLabelClick}
            subtasksDisabled={subtasksDisabled}
            subTasksCount={subTasksCount}
          >
            {!isSubtask ? (
              <>
                {isOpen ? (
                  <Tooltip placement="top" title="Add Subtask">
                    <SubtasksCellText onClick={onClickAddSubtask}>
                      +
                    </SubtasksCellText>
                  </Tooltip>
                ) : (
                  <SubtasksCellText>{subTasksCount}</SubtasksCellText>
                )}
                {/* <SubtasksCellText>
                  {isOpen ? '+' : subTasksCount}
                </SubtasksCellText> */}
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
