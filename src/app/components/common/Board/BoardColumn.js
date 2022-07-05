import { Box } from '@material-ui/core';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import BoardColumnHeader from './BoardColumnHeader';
import BoardTasksList from './BoardTasksList';
import { BoardColumnContainer } from './styled';

const BoardColumn = ({
  column,
  getTaskContextMenuOptionsArray,
  getColumnContextMenuOptionsArray,
  index,
}) => {
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
            />
          </Box>
          <BoardTasksList
            getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
            column={column}
          />
        </BoardColumnContainer>
      )}
    </Draggable>
  );
};

export default BoardColumn;
