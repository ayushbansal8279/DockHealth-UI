/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicated-branches */
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Collapse } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SlimTaskItem from 'components/task-item/SlimTaskItem/SlimTaskItem';
import Arrow from 'components/common/Arrow/Arrow';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import DashboardSingleSkeletonLoader from '../DashboardSkeletonLoader/DashboardSingleSkeletonLoader';
import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupList,
  DroppableBox,
} from './styled';
import DashboardColumnSortHeader from '../DashboardColumnSortHeader/DashboardColumnSortHeader';
import { DashboardColumnKey } from '../config';

const GRID_CONFIG = {
  primary: {
    description: {
      PATIENT: {
        sm: 5,
        md: 6,
        lg: 8,
      },
      DUE_DATE: {
        sm: 5,
        md: 6,
        lg: 8,
      },
      STATUS: {
        sm: 5,
        md: 6,
        lg: 8,
      },
    },
    dynamicColumn: {
      PATIENT: {
        sm: 3,
        md: 3,
        lg: 2,
      },
      DUE_DATE: {
        sm: 3,
        md: 3,
        lg: 2,
      },
      STATUS: {
        sm: 3,
        md: 3,
        lg: 2,
      },
    },
    listName: {
      sm: 4,
      md: 3,
      lg: 2,
    },
  },
  secondary: {
    description: {
      PATIENT: {
        sm: 3,
        md: 4,
        lg: 6,
      },
      DUE_DATE: {
        sm: 3,
        md: 4,
        lg: 6,
      },
      STATUS: {
        sm: 3,
        md: 4,
        lg: 6,
      },
    },
    dynamicColumn: {
      PATIENT: {
        sm: 3,
        md: 2,
        lg: 2,
      },
      DUE_DATE: {
        sm: 3,
        md: 2,
        lg: 2,
      },
      STATUS: {
        sm: 3,
        md: 2,
        lg: 2,
      },
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

const getDynamicColumnLabel = dynamicColumnType => {
  switch (dynamicColumnType) {
    case DashboardColumnKey.DUE_DATE: {
      return {
        id: DashboardColumnKey.DUE_DATE,
        label: 'Due',
      };
    }
    case DashboardColumnKey.PATIENT: {
      return {
        id: DashboardColumnKey.PATIENT,
        label: 'Patient',
      };
    }
    case DashboardColumnKey.STATUS: {
      return {
        id: DashboardColumnKey.STATUS,
        label: 'Status',
      };
    }
    default: {
      return {
        id: DashboardColumnKey.DUE_DATE,
        label: 'Due',
      };
    }
  }
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
  currentSort,
  onSortChange,
  showClearSortFiltersModal,
  isSortApplied,
  isAllTasksTab,
  dynamicColumnType,
  updateDueDate,
  currentUser,
  reassignDashboardTask,
  areFiltersApplied,
  updateWorkflowStatus,
  fetchImplicitGroup,
  isSearching,
}) => {
  const {
    groupName,
    groupType,
    metricValue,
    defaultOpen,
    isLoadingGroup,
    isLoadingMore,
    tasks: dashboardTasks,
  } = dashboardTasksGroup;

  const [tasks, setNewTasks] = useState(dashboardTasks);
  const [groupIsOpen, setGroupIsOpen] = useState(defaultOpen);

  const onSwitchGroup = useCallback(() => {
    if (!groupIsOpen && dashboardTasks?.length === 0 && !isSearching) {
      fetchImplicitGroup(dashboardTasksGroup);
    }
    setGroupIsOpen(!groupIsOpen);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTasksGroup, fetchImplicitGroup, groupIsOpen, isSearching]);

  useEffect(() => {
    setNewTasks(dashboardTasks);

    if (dashboardTasks?.length === 0) {
      setGroupIsOpen(false);
    }
  }, [dashboardTasks]);

  const gridConfig = isAllTasksTab
    ? GRID_CONFIG.secondary
    : GRID_CONFIG.primary;

  const dynamicColumn = getDynamicColumnLabel(dynamicColumnType);

  return (
    <DashboardTasksGroupContainer>
      <DashboardTasksGroupLabel>
        <Grid container>
          <Grid item {...gridConfig.description[dynamicColumnType]}>
            <Arrow
              isOpen={groupIsOpen}
              setOpen={onSwitchGroup}
              justifyContent="flex-start"
              paddingLeft="0"
              arrowType="triangle"
              arrowPlacement="left"
            >
              <span>
                {groupName} ({metricValue})
              </span>
            </Arrow>
          </Grid>
          <Grid item {...gridConfig.dynamicColumn[dynamicColumnType]}>
            {groupIsOpen && (
              <DashboardColumnSortHeader
                id={dynamicColumn.id}
                label={dynamicColumn.label}
                sort={currentSort}
                onSortChange={onSortChange}
              />
            )}
          </Grid>
          {isAllTasksTab && (
            <Grid item {...gridConfig.assignedPerson}>
              {groupIsOpen && (
                <DashboardColumnSortHeader
                  id="ASSIGNED"
                  label="Assigned To"
                  sort={currentSort}
                  onSortChange={onSortChange}
                />
              )}
            </Grid>
          )}

          <Grid item {...gridConfig.listName}>
            {groupIsOpen && (
              <DashboardColumnSortHeader
                id="LIST_NAME"
                label="List"
                sort={currentSort}
                onSortChange={onSortChange}
              />
            )}
          </Grid>
        </Grid>
      </DashboardTasksGroupLabel>
      {isLoadingGroup && <DashboardSingleSkeletonLoader rows={4} />}
      {!isLoadingGroup && (
        <Collapse timeout={500} in={groupIsOpen}>
          <DashboardTasksGroupList>
            <DragDropContext
              onBeforeDragStart={showClearSortFiltersModal}
              onDragEnd={({ destination, source }) => {
                if (!isSortApplied && !areFiltersApplied) {
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
                                  selectedTaskIdentifier ===
                                  task?.taskIdentifier
                                }
                                showAssignedPerson={isAllTasksTab}
                                gridConfig={gridConfig}
                                dynamicColumnType={dynamicColumnType}
                                updateDueDate={updateDueDate}
                                currentUser={currentUser}
                                reassignTask={(
                                  { taskIdentifier },
                                  { userId },
                                ) =>
                                  reassignDashboardTask(taskIdentifier, userId)
                                }
                                updateWorkflowStatus={updateWorkflowStatus}
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
            {!isLoadingMore && dashboardTasksGroup?.hasMore && (
              <LoadMoreSection>
                <LoadMoreButton
                  onClick={() => fetchImplicitGroup(dashboardTasksGroup, true)}
                />
              </LoadMoreSection>
            )}
            {isLoadingMore && <DashboardSingleSkeletonLoader rows={3} />}
          </DashboardTasksGroupList>
        </Collapse>
      )}
    </DashboardTasksGroupContainer>
  );
};

export default DashboardTasksGroup;
