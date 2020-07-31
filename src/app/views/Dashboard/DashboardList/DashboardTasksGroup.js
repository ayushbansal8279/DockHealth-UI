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
  AssignedBox,
} from './styled';

const GRID_CONFIG = {
  primary: {
    description: {
      sm: 6,
      md: 7,
      lg: 9,
    },
    dueDate: {
      sm: 2,
      md: 2,
      lg: 1,
    },
    listName: {
      sm: 4,
      md: 3,
      lg: 2,
    },
  },
  secondary: {
    description: {
      sm: 3,
      md: 4,
      lg: 7,
    },
    dueDate: {
      sm: 3,
      md: 2,
      lg: 1,
    },
    assignedPerson: {
      sm: 3,
      md: 3,
      lg: 2,
    },
    listName: {
      sm: 3,
      md: 3,
      lg: 2,
    },
  },
};

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
  onClickAssignedSort,
  onClickListNameSort,
  showClearSortFiltersModal,
  isSortApplied,
  isAllTasksTab,
}) => {
  const { groupName, groupType, tasks: dashboardTasks } = dashboardTasksGroup;
  const [tasks, setNewTasks] = useState([]);
  const [groupIsOpen, setGroupIsOpen] = useState(true);

  useEffect(() => {
    setNewTasks(dashboardTasks);
  }, [dashboardTasks]);

  const gridConfig = isAllTasksTab
    ? GRID_CONFIG.secondary
    : GRID_CONFIG.primary;

  return (
    <DashboardTasksGroupContainer>
      <DashboardTasksGroupLabel>
        <Grid container>
          <Grid item {...gridConfig.description}>
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
          <Grid item {...gridConfig.dueDate}>
            {groupIsOpen && (
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
              >
                <span>Due</span>
              </Arrow>
            )}
          </Grid>
          {isAllTasksTab && (
            <Grid item {...gridConfig.assignedPerson}>
              {groupIsOpen && (
                <AssignedBox>
                  <Arrow
                    isOpen={currentSortType === 'ASSIGNED_ASC'}
                    setOpen={onClickAssignedSort}
                    showDefaultArrow={
                      currentSortType !== 'ASSIGNED_ASC' &&
                      currentSortType !== 'ASSIGNED_DSC'
                    }
                    justifyContent="flex-start"
                    paddingLeft="0"
                    arrowType="secondary"
                    isDisabled={!groupIsOpen}
                  >
                    <span>Assigned</span>
                  </Arrow>
                </AssignedBox>
              )}
            </Grid>
          )}
          <Grid item {...gridConfig.listName}>
            {groupIsOpen && (
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
              >
                <span>List</span>
              </Arrow>
            )}
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
                        isDragDisabled={
                          isTaskDrawerOpen || tasks?.length < 2 || isAllTasksTab
                        }
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
                                !isTaskDrawerOpen &&
                                tasks?.length > 1 &&
                                !isAllTasksTab
                              }
                              openDrawer={openDrawer}
                              isSelected={
                                selectedTaskIdentifier === task?.taskIdentifier
                              }
                              showAssignedPerson={isAllTasksTab}
                              gridConfig={gridConfig}
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
