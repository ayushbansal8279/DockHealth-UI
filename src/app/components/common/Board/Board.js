import React, { useCallback } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BoardColumn from './BoardColumn';
import { BoardContainer } from './styled';

const Board = ({
  taskList,
  columns,
  getColumnContextMenuOptionsArray,
  getTaskContextMenuOptionsArray,
  onReorderColumns,
  onReorderTasks,
  onAddTask,
  onAddWorkflow,
  iconColorActive,
}) => {
  const handleDragEnd = useCallback(
    ({ type, source, destination }) => {
      if (!destination) return;
      switch (type) {
        case 'COLUMN':
          onReorderColumns(source.index, destination.index);
          break;

        case 'TASK_LIST':
          onReorderTasks(source, destination);
          break;

        default:
          break;
      }
    },
    [onReorderColumns, onReorderTasks],
  );

  return (
    <>
      <DragDropContext onDragEnd={data => handleDragEnd(data)}>
        <Droppable
          droppableId="board"
          type="COLUMN"
          direction="horizontal"
          isCombineEnabled
        >
          {provided => (
            <BoardContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columns?.map((column, index) => (
                <BoardColumn
                  onAddTask={onAddTask}
                  onAddWorkflow={onAddWorkflow}
                  taskList={taskList}
                  getColumnContextMenuOptionsArray={
                    getColumnContextMenuOptionsArray
                  }
                  getTaskContextMenuOptionsArray={
                    getTaskContextMenuOptionsArray
                  }
                  column={column}
                  key={column.identifier}
                  index={index}
                  iconColorActive={iconColorActive}
                />
              ))}
              {provided.placeholder}
            </BoardContainer>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default Board;
