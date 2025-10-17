/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import isEmpty from 'ramda/src/isEmpty';
import { openModal as openModalAction } from 'modal/actions';
import { onTaskOrderChanged } from 'helpers/ga-event-helper';
import * as ListDetailsActions from 'actions/list-details-actions';
import {
  taskCountersSelector,
  taskDetailsSortSelector,
  groupTasksSelector,
  isFetchingGroupsSelector,
  areGroupsInitialized as areGroupsInitializedSelector,
  listDetailsGroupsSelector,
  searchTermSelector,
} from 'selectors/list-details-selectors';
import compose from 'ramda/src/compose';
import {
  applyTaskTemplate,
  reorderTaskListGroups,
  reorderTasksInGroup,
  reassignTasksToAnotherGroup,
} from 'actions/list-details-actions';
import { createTask } from 'sagas/list-details-saga';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupNameSection from 'components/tasklist/GroupNameSection/GroupNameSection';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import { TaskStatus, TaskOrigin } from 'helpers/task-helpers';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import { useParams } from 'react-router-dom';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import {
  userProfileSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { isMemberAdmin } from 'helpers/list-members-helper';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import VirtualTaskList from 'views/list-details/VirtualTaskList/VirtualTaskList';
import { Typography } from '@mui/material';
import messages from '@/app/components/tasklist/list-toolbar-buttons/AddGroupNameButton/messages';
import { ListPageContext } from '../ListDetailsView';
import {
  TaskGroupsContainer,
  DroppablePlaceholder,
} from '../ListDetailsTableView/styled';
import { useIsVirtualizedList } from '@/app/hooks/use-is-virtualized-list';

const ListDetailsTasks = ({
  viewSetup,
  onTaskUpdate,
  updateWorkflowStatus,
  loadTasksForTaskGroup,
  setClearSearch,
}) => {
  window.disabledVirtualTaskList = false;
  const isVirtualizedList = useIsVirtualizedList();

  const groupedTasks = useSelector(groupTasksSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const groupList = useSelector(listDetailsGroupsSelector);
  const areGroupsInitialized = useSelector(areGroupsInitializedSelector);
  const isFetchingGroups = useSelector(isFetchingGroupsSelector);
  const searchValue = useSelector(searchTermSelector);
  const isFetchingData = isFetchingGroups && !areGroupsInitialized;
  const isSearchApplied = !!searchValue;

  const [draggedId, setDraggableId] = useState(null);
  const dispatch = useDispatch();
  const { taskListIdentifier, tabName } = useParams();
  const listUniqueKey = taskListIdentifier;
  const isCompletedView = tabName?.toUpperCase() === TaskStatus.COMPLETE;

  const currentUser = useSelector(userProfileSelector);
  const taskCounters = useSelector(taskCountersSelector);

  const createTaskGroupList = useCallback(
    (groupName) => {
      dispatch(ListDetailsActions?.createTaskListGroup(groupName));
    },
    [dispatch],
  );

  const quickAddTask = useCallback(
    (task) => {
      if (task?.description) {
        const payload = {
          ...task,
          autoOpenDrawer: taskCounters?.incomplete === 0,
        };

        dispatch(createTask(payload));
      }
    },
    [dispatch, taskCounters],
  );

  const sort = useSelector(taskDetailsSortSelector);
  const onSortChange = compose(
    dispatch,
    ListDetailsActions.sortListDetailsTasks,
  );
  const resetSort = useCallback(() => {
    dispatch(ListDetailsActions.sortListDetailsTasks(null, null));
  }, [dispatch]);

  const restrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

  const taskList = useSelector(currentTaskListSelector);
  const { restrictCustomization } = taskList || {};
  const currentUserMember = taskList?.listUsers.find(
    (u) => u.identifier === currentUser?.identifier,
  );
  const isListAdmin = isMemberAdmin(currentUserMember);
  const restrictCustomizationFeatures = restrictCustomization && !isListAdmin;

  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  const iconColorActiveItem = useMemo(
    () =>
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === 'icon.active.color',
      ) || {},
    [currentOrganization?.themeSettings],
  );
  const defaultGroupNameItem = useMemo(
    () =>
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === 'content.label.default.group',
      ) || {},
    [currentOrganization?.themeSettings],
  );
  const userSortingSupportEnabledItem = useMemo(
    () =>
      currentOrganization?.themeSettings?.find(
        ({ name }) => name === 'list.tasks.user.sort.enabled',
      ) || {},
    [currentOrganization?.themeSettings],
  );
  const userSortingSupportEnabled =
    userSortingSupportEnabledItem?.value !== 'false';

  useEffect(() => {
    return () => {
      dispatch(ListDetailsActions.showhideWorkflowTasksReset());
    };
  }, [dispatch, taskListIdentifier]);

  const areGroupsLoading = useMemo(() => {
    return groupedTasks?.some(({ isLoadingGroup }) => isLoadingGroup === true);
  }, [groupedTasks]);

  const renderEmptyState = () => {
    if (isSearchApplied) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (quickAddTask) {
      return (
        <EmptyListView
          title="This list has no tasks"
          description="Be the first to add a task to this list!"
        />
      );
    }
  };

  const onDragEnd = useCallback(
    ({ destination, source }) => {
      setDraggableId(null);
      onTaskOrderChanged();

      if (!destination) return;

      if (source?.droppableId === destination?.droppableId) {
        dispatch(reorderTasksInGroup({ destination, source }));
      } else {
        dispatch(reassignTasksToAnotherGroup({ destination, source }));
      }
    },
    [dispatch],
  );

  const onBeforeCapture = useCallback(({ draggableId }) => {
    setDraggableId(draggableId);
  }, []);

  const onGroupNameClick = useCallback(
    (groupName) => createTaskGroupList(groupName),
    [createTaskGroupList],
  );

  const hasAnyTask = useMemo(() => {
    return groupedTasks?.some(({ tasks }) => tasks?.length > 0) || false;
  }, [groupedTasks]);

  const { bulkEditIsActive } = useContext(BulkEditContext);
  const { handleScroll, workflowPopoverOpen, patientPopoverOpen } =
    useContext(ListPageContext);
  const dragAndDropDisabled = bulkEditIsActive || !userSortingSupportEnabled;

  const isSortApplied = !!sort?.key && !!sort?.order;

  const showClearSortFiltersModal = useCallback(() => {
    if (isSortApplied || isSearchApplied || areFiltersApplied) {
      setDraggableId(null);
      dispatch(
        openModalAction('ClearSortFilters', {
          confirm: () => {
            if (isSortApplied) resetSort();
            if (isSearchApplied) setClearSearch(true);
          },
          closeOnConfirm: true,
        }),
      );
    }
  }, [
    areFiltersApplied,
    dispatch,
    isSearchApplied,
    isSortApplied,
    resetSort,
    setClearSearch,
  ]);

  const applyTemplate = useCallback(
    ({ taskTemplateIdentifier, taskGroupIdentifier }) =>
      dispatch(
        applyTaskTemplate({
          taskTemplateIdentifier,
          taskListIdentifier,
          taskGroupIdentifier,
        }),
      ),
    [dispatch, taskListIdentifier],
  );

  const tasksToMap = useMemo(
    () =>
      groupList?.filter(
        ({ taskGroupIdentifier }) =>
          (!isSearchApplied && !areFiltersApplied) ||
          groupedTasks?.find((g) => g.groupIdentifier === taskGroupIdentifier)
            ?.tasks?.length > 0,
      ),
    [areFiltersApplied, groupList, groupedTasks, isSearchApplied],
  );

  const moveGroup = useCallback(
    (index, direction) => {
      const factor = direction === 'up' ? -1 : 1;
      dispatch(reorderTaskListGroups(index, index + factor));
    },
    [dispatch],
  );

  const renderVirtualizedTasks = () => {
    return (
      <div
        onScrollCapture={
          !(workflowPopoverOpen || patientPopoverOpen) ? handleScroll : () => {}
        }
      >
        <VirtualTaskList
          showClearSortFiltersModal={showClearSortFiltersModal}
          groupedTasks={groupedTasks}
        />
      </div>
    );
  };

  const renderTasks = useCallback(
    () =>
      tasksToMap.map(
        ({ groupName, taskGroupIdentifier, metricValue }, index) => {
          const group = groupedTasks?.find(
            (g) => g.groupIdentifier === taskGroupIdentifier,
          );
          const isLoadingGroup = group?.isLoadingGroup;

          return (
            <TasksGroup
              isCompletedGroup={isCompletedView}
              key={taskGroupIdentifier}
              isDefaultGroup={groupName === 'DEFAULT'}
              groupName={
                groupName === 'DEFAULT'
                  ? defaultGroupNameItem?.value || 'New tasks'
                  : groupName
              }
              groupTaskCounts={metricValue}
              quickAddTask={quickAddTask}
              moveGroupUp={() => moveGroup(index, 'up')}
              moveGroupDown={() => moveGroup(index, 'down')}
              onTaskGroupRefresh={() => {
                loadTasksForTaskGroup({
                  taskGroupIdentifier,
                  startPosition: 0,
                  refresh: true,
                });
              }}
              isFirstGroup={index === 0}
              isLastGroup={index === groupList?.length - 1}
              tasks={group?.tasks || []}
              isLoadingGroup={isLoadingGroup}
              isFetchingMoreTasks={group?.isFetchingMoreTasks || false}
              taskGroupIdentifier={taskGroupIdentifier}
              onTaskUpdate={onTaskUpdate}
              draggedId={draggedId}
              updateWorkflowStatus={updateWorkflowStatus}
              isSearchApplied={isSearchApplied}
              listUniqueKey={listUniqueKey}
              areFiltersApplied={areFiltersApplied}
              groupPagination
              hasMoreTasks={group?.hasMore || false}
              showMoreTasks={() => {
                loadTasksForTaskGroup({
                  taskGroupIdentifier,
                  startPosition: group?.moreTasksIndex || 0,
                  refresh: false,
                });
              }}
              onTaskGroupViewModeChange={(viewMode) => {
                loadTasksForTaskGroup({
                  taskGroupIdentifier,
                  startPosition: 0,
                  viewMode,
                  refresh: true,
                });
              }}
              taskListIdentifier={taskListIdentifier}
              sort={sort}
              onSortChange={onSortChange}
              applyTemplate={applyTemplate}
              iconColorActive={iconColorActiveItem?.value}
              restrictCustomizationFeatures={restrictCustomizationFeatures}
            >
              {({
                isFetchingMoreTasks,
                isCompletedGroup,
                isFullView,
                tasks,
                addingNewSubtaskParentId,
                groupHasMultipleAssignees,
                isListFlattened,
                highlightedTasksParentIdentifier,
                highlightTasksOfTheSameParent,
                groupPagination,
                hasMoreTasks,
                showMoreTasks,
              }) => (
                <>
                  {(!isLoadingGroup || isFetchingMoreTasks) && (
                    <Droppable
                      droppableId={taskGroupIdentifier}
                      isDropDisabled={isCompletedGroup || isSortApplied}
                    >
                      {(providedDroppable, snapshot) => {
                        return (
                          <DroppablePlaceholder
                            isDraggingOverGroup={snapshot?.isDraggingOver}
                            ref={providedDroppable.innerRef}
                            {...providedDroppable.droppableProps}
                          >
                            {
                              // eslint-disable-next-line no-shadow
                              tasks?.map((taskIdentifier, index) => (
                                <Draggable
                                  key={taskIdentifier}
                                  draggableId={taskIdentifier}
                                  index={index}
                                  isDragDisabled={
                                    isCompletedGroup ||
                                    dragAndDropDisabled ||
                                    restrictions?.createGroup === DISABLED
                                  }
                                >
                                  {(draggableProvided, { isDragging }) => (
                                    <StandardTaskItem
                                      key={taskIdentifier}
                                      isFullView={isFullView}
                                      isDragging={isDragging}
                                      isStartedDnD={
                                        draggedId === taskIdentifier
                                      }
                                      taskIdentifier={taskIdentifier}
                                      taskGroupIdentifier={taskGroupIdentifier}
                                      draggableProvided={draggableProvided}
                                      isCompletedGroup={isCompletedGroup}
                                      onTaskUpdate={onTaskUpdate}
                                      updateWorkflowStatus={
                                        updateWorkflowStatus
                                      }
                                      dragAndDropDisabled={
                                        isCompletedGroup || dragAndDropDisabled
                                      }
                                      isDraggable
                                      addingNewSubtask={
                                        addingNewSubtaskParentId ===
                                        taskIdentifier
                                      }
                                      subtasksDisabled={isListFlattened}
                                      areFiltersApplied={areFiltersApplied}
                                      isSearchApplied={isSearchApplied}
                                      shouldShowBlockModalOnDrag={isSortApplied}
                                      showClearSortFiltersModal={
                                        showClearSortFiltersModal
                                      }
                                      multipleAssigneesContext={
                                        groupHasMultipleAssignees
                                      }
                                      highlightedTasksParentIdentifier={
                                        highlightedTasksParentIdentifier
                                      }
                                      highlightTasksOfTheSameParent={
                                        highlightTasksOfTheSameParent
                                      }
                                      iconColorActive={
                                        iconColorActiveItem?.value
                                      }
                                      origin={TaskOrigin.LIST}
                                      viewSetup={viewSetup}
                                    />
                                  )}
                                </Draggable>
                              ))
                            }
                            {providedDroppable.placeholder}
                          </DroppablePlaceholder>
                        );
                      }}
                    </Droppable>
                  )}
                  {(isLoadingGroup || isFetchingMoreTasks) && (
                    <TasksSkeletonLoader rows={4} />
                  )}
                  {groupPagination && hasMoreTasks && !areFiltersApplied && (
                    <StickyContainer left={24} decreaseWidth={2 * 24}>
                      <LoadMoreSection>
                        {group?.moreTasksIndex &&
                          group?.moreTasksIndex !== 0 &&
                          !isLoadingGroup && (
                            <LoadMoreButton onClick={showMoreTasks} />
                          )}
                      </LoadMoreSection>
                    </StickyContainer>
                  )}
                  {groupPagination && hasMoreTasks && areFiltersApplied && (
                    <StickyContainer left={24} decreaseWidth={2 * 24}>
                      <LoadMoreSection>
                        {(!group?.moreTasksIndex ||
                          group?.moreTasksIndex === 0) && (
                          <span>Limiting results. Please refine filter.</span>
                        )}
                      </LoadMoreSection>
                    </StickyContainer>
                  )}
                </>
              )}
            </TasksGroup>
          );
        },
      ),
    [
      tasksToMap,
      groupedTasks,
      isCompletedView,
      defaultGroupNameItem?.value,
      quickAddTask,
      groupList?.length,
      onTaskUpdate,
      draggedId,
      updateWorkflowStatus,
      isSearchApplied,
      listUniqueKey,
      areFiltersApplied,
      taskListIdentifier,
      sort,
      onSortChange,
      applyTemplate,
      iconColorActiveItem?.value,
      restrictCustomizationFeatures,
      moveGroup,
      loadTasksForTaskGroup,
      isSortApplied,
      dragAndDropDisabled,
      restrictions?.createGroup,
      DISABLED,
      showClearSortFiltersModal,
      viewSetup,
    ],
  );

  if (isFetchingData) {
    return <GroupedListSkeletonLoader />;
  }

  if (isEmpty(groupList)) {
    return <Typography sx={{ m: 3 }}>Loading ...</Typography>;
  }

  return (
    <TaskGroupsContainer>
      {(isSearchApplied || areFiltersApplied) &&
      !hasAnyTask &&
      !areGroupsLoading ? (
        renderEmptyState()
      ) : (
        <>
          <DragDropContext
            onBeforeDragStart={showClearSortFiltersModal}
            onBeforeCapture={onBeforeCapture}
            onDragEnd={isSortApplied ? () => {} : onDragEnd}
          >
            {isVirtualizedList ? renderVirtualizedTasks() : renderTasks()}
            {!isVirtualizedList &&
              !!createTaskGroupList &&
              !isSearchApplied &&
              !areFiltersApplied && (
                <StickyContainer left={24} decreaseWidth={2 * 24}>
                  <GroupNameSection
                    onEnterClick={
                      restrictions?.createGroup !== DISABLED &&
                      !restrictCustomizationFeatures
                        ? onGroupNameClick
                        : () => {}
                    }
                    placeholder={messages.placeholder}
                    closeOnEnter
                  />
                </StickyContainer>
              )}
          </DragDropContext>
        </>
      )}
    </TaskGroupsContainer>
  );
};

export default ListDetailsTasks;
