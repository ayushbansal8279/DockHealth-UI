import { Box } from '@material-ui/core';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import React, { useCallback } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import BoardColumnTask from './BoardColumnTask';
import { BoardColumnTasksContainer } from './styled';
import { quickTaskInputValidator } from './helpers';

const BoardTasksList = ({
  column,
  getTaskContextMenuOptionsArray,
  isDropDisabled = false,
  isAddTaskFieldVisible,
  hideAddTaskField,
  taskList,
  onAddTask,
}) => {
  const handleBlur = useCallback(
    text => {
      if (text.length === 0) hideAddTaskField();
    },
    [hideAddTaskField],
  );

  return (
    <Droppable
      droppableId={column.identifier}
      type="TASK_LIST"
      isDropDisabled={isDropDisabled}
      isCombineEnabled
    >
      {(dropProvided, dropSnapshot) => (
        <Box
          flex="1"
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <BoardColumnTasksContainer ref={dropProvided.innerRef}>
            {column?.tasks?.map((t, index) => {
              return (
                <BoardColumnTask
                  taskContextMenuOptions={getTaskContextMenuOptionsArray(t)}
                  task={t}
                  key={t.identifier}
                  column={column}
                  index={index}
                />
              );
            })}
            {isAddTaskFieldVisible && (
              <Box mt="20px">
                <QuickAddTaskInput
                  autofocus
                  onBlur={handleBlur}
                  small
                  taskListIdentifier={taskList?.taskListIdentifier}
                  quickAddTask={onAddTask}
                  validator={quickTaskInputValidator}
                />
              </Box>
            )}
            {dropProvided.placeholder}
          </BoardColumnTasksContainer>
        </Box>
      )}
    </Droppable>
  );
};

export default BoardTasksList;
