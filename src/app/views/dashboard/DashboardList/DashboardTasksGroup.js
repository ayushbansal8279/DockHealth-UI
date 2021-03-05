/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicated-branches */
import React, { useState, useEffect, useCallback } from 'react';
import { Collapse } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SlimTaskItem from 'components/task/SlimTaskItem/SlimTaskItem';
import Arrow from 'components/common/Arrow/Arrow';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import DashboardSingleSkeletonLoader from '../DashboardSkeletonLoader/DashboardSingleSkeletonLoader';
import {
  DashboardTasksGroupContainer,
  DashboardTasksGroupLabel,
  DashboardTasksGroupLabelName,
  DashboardTasksGroupList,
  DroppableBox,
  DashboardSortBar,
  DashboardSortBarLabelName,
} from './styled';
import DashboardColumnSortHeader from '../DashboardColumnSortHeader/DashboardColumnSortHeader';
import { DashboardColumnKey } from '../config';

const GRID_CONFIG = {
  primary: {
    description: {
      [DashboardColumnKey.PATIENT]: {
        width: '150px',
      },
      [DashboardColumnKey.DUE_DATE]: {
        width: '100px',
        justify: 'center',
      },
      [DashboardColumnKey.WORKFLOW_STATUS]: {
        width: '120px',
        padding: '0 0',
        paddingLeft: 'none',
      },
    },
    dynamicColumn: {
      [DashboardColumnKey.PATIENT]: {
        width: '150px',
      },
      [DashboardColumnKey.DUE_DATE]: {
        width: '100px',
        justify: 'center',
      },
      [DashboardColumnKey.WORKFLOW_STATUS]: {
        width: '120px',
        padding: '0 0',
        paddingLeft: 'none',
      },
    },
    listName: {
      width: '180px',
    },
  },
  secondary: {
    description: {
      [DashboardColumnKey.PATIENT]: {
        width: '150px',
      },
      [DashboardColumnKey.DUE_DATE]: {
        width: '100px',
        justify: 'center',
      },
      [DashboardColumnKey.WORKFLOW_STATUS]: {
        width: '120px',
        padding: '0 0',
        paddingLeft: 'none',
      },
    },
    dynamicColumn: {
      [DashboardColumnKey.PATIENT]: {
        width: '150px',
      },
      [DashboardColumnKey.DUE_DATE]: {
        width: '100px',
        justify: 'center',
      },
      [DashboardColumnKey.WORKFLOW_STATUS]: {
        width: '120px',
        padding: '0 0',
        paddingLeft: 'none',
      },
    },
    assignedPerson: {
      width: '90px',
      justify: 'center',
    },
    listName: {
      width: '180px',
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
    case DashboardColumnKey.WORKFLOW_STATUS: {
      return {
        id: DashboardColumnKey.WORKFLOW_STATUS,
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
  onTaskUpdate,
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
        <DashboardTasksGroupLabelName>
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
        </DashboardTasksGroupLabelName>
      </DashboardTasksGroupLabel>
      {isLoadingGroup && <DashboardSingleSkeletonLoader rows={4} />}
      {!isLoadingGroup && (
        <Collapse timeout={500} in={groupIsOpen}>
          <DashboardTasksGroupList>
            <DashboardSortBar>
              <DashboardSortBarLabelName>
                <div>Tasks</div>
              </DashboardSortBarLabelName>
              <DashboardSortBarLabelName
                {...gridConfig.dynamicColumn[dynamicColumnType]}
              >
                {groupIsOpen && (
                  <DashboardColumnSortHeader
                    id={dynamicColumn.id}
                    label={dynamicColumn.label}
                    sort={currentSort}
                    onSortChange={onSortChange}
                  />
                )}
              </DashboardSortBarLabelName>
              {isAllTasksTab && (
                <DashboardSortBarLabelName {...gridConfig.assignedPerson}>
                  {groupIsOpen && (
                    <DashboardColumnSortHeader
                      id="ASSIGNED"
                      label="Assign"
                      sort={currentSort}
                      onSortChange={onSortChange}
                    />
                  )}
                </DashboardSortBarLabelName>
              )}
              <DashboardSortBarLabelName {...gridConfig.listName}>
                {groupIsOpen && (
                  <DashboardColumnSortHeader
                    id="LIST_NAME"
                    label="List"
                    sort={currentSort}
                    onSortChange={onSortChange}
                  />
                )}
              </DashboardSortBarLabelName>
            </DashboardSortBar>
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
                                  selectedTaskIdentifier ===
                                  task?.taskIdentifier
                                }
                                showAssignedPerson={isAllTasksTab}
                                gridConfig={gridConfig}
                                dynamicColumnType={dynamicColumnType}
                                updateDueDate={updateDueDate}
                                currentUser={currentUser}
                                onTaskUpdate={onTaskUpdate}
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
