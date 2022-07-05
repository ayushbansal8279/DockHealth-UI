import { Box } from '@material-ui/core';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import BoardColumnTask from './BoardColumnTask';
import { BoardColumnTasksContainer } from './styled';

const BoardTasksList = ({
  column,
  getTaskContextMenuOptionsArray,
  isDropDisabled = false,
}) => {
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
            {dropProvided.placeholder}
          </BoardColumnTasksContainer>
        </Box>
      )}
    </Droppable>
  );
};

export default BoardTasksList;
