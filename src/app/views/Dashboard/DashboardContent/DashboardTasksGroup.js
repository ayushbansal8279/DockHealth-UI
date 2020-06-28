import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SlimTaskItem from 'components/task-item/SlimTaskItem/SlimTaskItem';
import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupList,
  DroppableBox,
} from './styled';

const DashboardTasksGroup = ({
  dashboardTasksGroup,
  toggleDashboardTaskComplete,
  redirectToParentTask,
  storeAsCurrentTask,
  sortDashboardTasks,
}) => {
  const { groupName, groupType, tasks: dashboardTasks } = dashboardTasksGroup;
  const [tasks, setNewTasks] = useState([]);

  useEffect(() => {
    setNewTasks(dashboardTasks);
  }, [dashboardTasks]);

  return (
    <DashboardTasksGroupContainer>
      <DashboardTasksGroupLabel>
        {groupName} ({tasks.length})
      </DashboardTasksGroupLabel>
      <DashboardTasksGroupList>
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            const { index: destinationIndex } = destination;
            const { index: sourceIndex } = source;
            const newTasks = [...tasks];
            newTasks.splice(
              destinationIndex,
              0,
              newTasks.splice(sourceIndex, 1)[0],
            );

            setNewTasks(newTasks);

            const newTasksOrder = newTasks.map(
              ({ taskIdentifier }) => taskIdentifier,
            );
            sortDashboardTasks(groupType, newTasksOrder);
          }}
        >
          <Droppable droppableId={groupName}>
            {providedDroppable => {
              return (
                <DroppableBox
                  ref={providedDroppable.innerRef}
                  {...providedDroppable.droppableProps}
                >
                  {tasks?.map((task, index) => (
                    <Draggable
                      key={task.taskIdentifier}
                      draggableId={String(task.taskIdentifier)}
                      index={index}
                    >
                      {(draggableProvided, { isDragging }) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                        >
                          <SlimTaskItem
                            {...task}
                            toggleTaskComplete={() =>
                              toggleDashboardTaskComplete(task)
                            }
                            redirectToParentTask={redirectToParentTask}
                            storeAsCurrentTask={storeAsCurrentTask}
                            isDragging={isDragging}
                            dragHandleProps={draggableProvided.dragHandleProps}
                            isDraggable
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {providedDroppable.placeholder}
                </DroppableBox>
              );
            }}
          </Droppable>
        </DragDropContext>
      </DashboardTasksGroupList>
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
