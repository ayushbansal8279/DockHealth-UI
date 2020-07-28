import React, { useState, useEffect } from 'react';
import { Grid, Collapse } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SlimTaskItem from 'components/task-item/SlimTaskItem/SlimTaskItem';
import Arrow from 'components/common/Arrow/Arrow';

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
  openDrawer,
  isTaskDrawerOpen,
  selectedTaskIdentifier,
  currentSortMethod,
  currentSortType,
  onClickDueDateSort,
  onClickListNameSort,
  showClearSortFiltersModal,
  isSortApplied,
}) => {
  const { groupName, groupType, tasks: dashboardTasks } = dashboardTasksGroup;
  const [tasks, setNewTasks] = useState([]);
  const [groupIsOpen, setGroupIsOpen] = useState(true);

  useEffect(() => {
    setNewTasks(dashboardTasks);
  }, [dashboardTasks]);

  return (
    <DashboardTasksGroupContainer>
      <DashboardTasksGroupLabel>
        <Grid container>
          <Grid item sm={6} md={7} lg={8}>
            <Arrow
              isOpen={groupIsOpen}
              setOpen={() => setGroupIsOpen(!groupIsOpen)}
              justifyContent="flex-start"
              paddingLeft="0"
              arrowType="triangle"
              arrowPlacement="left"
            >
              <span>
                {groupName} ({tasks.length})
              </span>
            </Arrow>
          </Grid>
          <Grid item sm={2} md={2} lg={2}>
            <Arrow
              isOpen={currentSortType === 'DUE_DATE_ASC'}
              setOpen={onClickDueDateSort}
              showDefaultArrow={
                currentSortType !== 'DUE_DATE_ASC' &&
                currentSortType !== 'DUE_DATE_DSC'
              }
              justifyContent="flex-start"
              paddingLeft="0"
              arrowType="secondary"
              isDisabled={!groupIsOpen}
              showArrow={groupIsOpen}
            >
              <span>Due</span>
            </Arrow>
          </Grid>
          <Grid item sm={4} md={3} lg={2}>
            <Arrow
              isOpen={currentSortType === 'LIST_NAME_ASC'}
              setOpen={onClickListNameSort}
              showDefaultArrow={
                currentSortType !== 'LIST_NAME_ASC' &&
                currentSortType !== 'LIST_NAME_DSC'
              }
              justifyContent="flex-start"
              paddingLeft="0"
              arrowType="secondary"
              isDisabled={!groupIsOpen}
              showArrow={groupIsOpen}
            >
              <span>List</span>
            </Arrow>
          </Grid>
        </Grid>
      </DashboardTasksGroupLabel>
      <Collapse timeout={500} in={groupIsOpen}>
        <DashboardTasksGroupList>
          <DragDropContext
            onBeforeDragStart={showClearSortFiltersModal}
            onDragEnd={({ destination, source }) => {
              if (!isSortApplied) {
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
              }
            }}
          >
            <Droppable droppableId={groupName}>
              {providedDroppable => {
                return (
                  <DroppableBox
                    ref={providedDroppable.innerRef}
                    {...providedDroppable.droppableProps}
                  >
                    {currentSortMethod(tasks)?.map((task, index) => (
                      <Draggable
                        key={task.taskIdentifier}
                        draggableId={String(task.taskIdentifier)}
                        index={index}
                        isDragDisabled={isTaskDrawerOpen || tasks?.length < 2}
                      >
                        {(draggableProvided, { isDragging }) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                          >
                            <SlimTaskItem
                              task={task}
                              toggleTaskComplete={() =>
                                toggleDashboardTaskComplete(task)
                              }
                              redirectToParentTask={redirectToParentTask}
                              storeAsCurrentTask={storeAsCurrentTask}
                              isDragging={isDragging}
                              dragHandleProps={
                                draggableProvided.dragHandleProps
                              }
                              isDraggable={
                                !isTaskDrawerOpen && tasks?.length > 1
                              }
                              openDrawer={openDrawer}
                              isSelected={
                                selectedTaskIdentifier === task?.taskIdentifier
                              }
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
      </Collapse>
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
