import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useBoolean } from 'hooks/useBoolean';
import BoardColumnHeader from './BoardColumnHeader';
import BoardTasksList from './BoardTasksList';
import { BoardColumnContainer } from './styled';

const BoardColumn = ({
  taskList,
  column,
  getTaskContextMenuOptionsArray,
  getColumnContextMenuOptionsArray,
  index,
  onAddTask,
  onAddWorkflow,
  iconColorActive,
}) => {
  const [isAddTaskFieldVisible, showAddTaskField, hideAddTaskField] =
    useBoolean(false);

  const handleAddTask = useCallback(
    ({ description }) => {
      onAddTask(column, description);
      hideAddTaskField();
    },
    [column, hideAddTaskField, onAddTask],
  );

  return (
    <Draggable draggableId={column.identifier} index={index}>
      {(provided, snapshot) => (
        <BoardColumnContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Box isDragging={snapshot.isDragging} {...provided.dragHandleProps}>
            <BoardColumnHeader
              columnContextMenuOptions={getColumnContextMenuOptionsArray(
                column,
              )}
              tasksLength={column?.tasks?.length}
              name={column.name}
              onAddTaskOption={showAddTaskField}
              onAddWorkflow={() => onAddWorkflow(column)}
            />
          </Box>
          <BoardTasksList
            isAddTaskFieldVisible={isAddTaskFieldVisible}
            getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
            column={column}
            taskList={taskList}
            onAddTask={handleAddTask}
            hideAddTaskField={hideAddTaskField}
            iconColorActive={iconColorActive}
          />
        </BoardColumnContainer>
      )}
    </Draggable>
  );
};

export default BoardColumn;
