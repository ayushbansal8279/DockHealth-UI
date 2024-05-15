import React, { useCallback } from 'react';
import SubtaskIcon from 'img/SubtaskIcon';
import ParentTaskIcon from 'img/ParentTaskIcon';
import {
  AddPlaceholder,
  AddSubtaskButton,
  SubtasksCellContentButton,
  SubtasksCellText,
  SubtasksCountText,
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
  isHover,
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
      {isHover && (
        <AddSubtaskButton type="button">
          {/* <AddPlaceholder> */}
          <SubtasksCellContentButton
            // isOpen={isOpen}
            // disabled={isNestedTask}
            // isGreyedOut={subtasksDisabled}
            // onClick={onSubtaskLabelClick}
            // subtasksDisabled={subtasksDisabled}
            subTasksCount={subTasksCount}
            onClick={onClickAddSubtask}
          >
            <>
              <SubtasksCellText>
                <div style={{ marginBottom: '3px' }}>+</div>
              </SubtasksCellText>
              <Tooltip placement="top" title="Add Subtask">
                <span>
                  <ParentTaskIcon />
                </span>
              </Tooltip>
            </>
          </SubtasksCellContentButton>
          {/* </AddPlaceholder> */}
        </AddSubtaskButton>
      )}
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
                      <div style={{ marginBottom: '3px' }}>+</div>
                    </SubtasksCellText>
                  </Tooltip>
                ) : (
                  <SubtasksCountText>
                    <div style={{ marginBottom: '3px' }}>{subTasksCount}</div>
                  </SubtasksCountText>
                )}
                {/* <SubtasksCellText>
                  {isOpen ? '+' : subTasksCount}
                </SubtasksCellText> */}
                <Tooltip
                  placement="top"
                  title={subtasksDisabled ? '' : isOpen ? 'Hide Subtasks' : ''}
                >
                  <span>
                    <ParentTaskIcon />
                  </span>
                </Tooltip>
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
