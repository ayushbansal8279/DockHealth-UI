import { Box } from '@mui/material';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import React, { useCallback, useMemo } from 'react';
import BoardColumnTask from './BoardColumnTask';
import { BoardColumnTasksContainer } from './styled';
import { quickTaskInputValidator } from './helpers';
import { SortableContext } from '@dnd-kit/sortable';

const BoardTasksList = ({
  column,
  getTaskContextMenuOptionsArray,
  isDropDisabled = false,
  isAddTaskFieldVisible,
  hideAddTaskField,
  taskList,
  onAddTask,
  iconColorActive,
  columnTasks,
}) => {
  const handleBlur = useCallback(
    (text) => {
      if (text.length === 0) hideAddTaskField();
    },
    [hideAddTaskField],
  );

  const taskIds = useMemo(() => {
    return (columnTasks ?? []).map((task) => task?.taskId);
  }, [columnTasks]);

  return (
    <Box flex="1" isDropDisabled={isDropDisabled}>
      <BoardColumnTasksContainer>
        {isAddTaskFieldVisible && (
          <Box mt="20px">
            <QuickAddTaskInput
              autofocus
              onBlur={handleBlur}
              small
              taskListIdentifier={taskList?.taskListIdentifier}
              quickAddTask={onAddTask}
              validator={quickTaskInputValidator}
              iconColorActive={iconColorActive}
            />
          </Box>
        )}
        <SortableContext key={column?.identifier} items={taskIds ?? []}>
          {(columnTasks ?? [])?.map((t, index) => {
            return (
              <BoardColumnTask
                taskContextMenuOptions={getTaskContextMenuOptionsArray(t)}
                task={t}
                key={t?.taskId}
                column={column}
                index={index}
              />
            );
          })}
        </SortableContext>
      </BoardColumnTasksContainer>
    </Box>
  );
};

export default BoardTasksList;
