import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { useBoolean } from 'hooks/useBoolean';
import BoardColumnHeader from './BoardColumnHeader';
import BoardTasksList from './BoardTasksList';
import { BoardColumnContainer } from './styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BoardColumn = ({
  taskList,
  column,
  getTaskContextMenuOptionsArray,
  getColumnContextMenuOptionsArray,
  index,
  onAddTask,
  onAddWorkflow,
  iconColorActive,
  columnTasks,
}) => {
  const [isAddTaskFieldVisible, showAddTaskField, hideAddTaskField] =
    useBoolean(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column?.identifier,
    data: {
      type: 'COLUMN',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform?.toString(transform),
    zIndex: isDragging ? 9999 : 'auto',
    cursor: isDragging ? 'grabbing' : 'auto',
  };

  const handleAddTask = useCallback(
    ({ description }) => {
      onAddTask(column, description);
      hideAddTaskField();
    },
    [column, hideAddTaskField, onAddTask],
  );

  if (isDragging) {
    return (
      <BoardColumnContainer ref={setNodeRef} style={{ ...style, opacity: 0 }}>
        <Box>
          <BoardColumnHeader
            columnContextMenuOptions={getColumnContextMenuOptionsArray(column)}
            tasksLength={column?.tasks?.length}
            name={column.name}
            onAddTaskOption={showAddTaskField}
            onAddWorkflow={() => onAddWorkflow(column)}
            isDragging={isDragging}
          />
        </Box>
        <div style={{ paddingBottom: columnTasks?.length === 1 ? 100 : 0 }}>
          <BoardTasksList
            isAddTaskFieldVisible={isAddTaskFieldVisible}
            getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
            column={column}
            taskList={taskList}
            onAddTask={handleAddTask}
            hideAddTaskField={hideAddTaskField}
            iconColorActive={iconColorActive}
            columnTasks={columnTasks}
          />
        </div>
      </BoardColumnContainer>
    );
  }
  return (
    <BoardColumnContainer ref={setNodeRef} style={style}>
      <Box isDragging={isDragging} {...attributes} {...listeners}>
        <BoardColumnHeader
          columnContextMenuOptions={getColumnContextMenuOptionsArray(column)}
          tasksLength={column?.tasks?.length}
          name={column.name}
          onAddTaskOption={showAddTaskField}
          onAddWorkflow={() => onAddWorkflow(column)}
          isDragging={isDragging}
        />
      </Box>
      <div style={{ paddingBottom: columnTasks?.length === 1 ? 100 : 0 }}>
        <BoardTasksList
          isAddTaskFieldVisible={isAddTaskFieldVisible}
          getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
          column={column}
          taskList={taskList}
          onAddTask={handleAddTask}
          hideAddTaskField={hideAddTaskField}
          iconColorActive={iconColorActive}
          columnTasks={columnTasks}
        />
      </div>
    </BoardColumnContainer>
  );
};

export default BoardColumn;
