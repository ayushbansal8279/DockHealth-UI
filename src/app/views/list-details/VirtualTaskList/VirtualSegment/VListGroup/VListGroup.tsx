import React, { ForwardedRef, forwardRef, useCallback } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import {
  reorderTaskListGroups,
  getTasksForTaskGroups,
} from 'actions/list-details-actions';
import { useDispatch, useSelector } from 'react-redux';
import { ViewType } from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import * as Sc from './styled';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import { hasFiltersAppliedSelector } from '@/app/selectors/mega-filter-selectors';
import { searchTermSelector } from '@/app/selectors/list-details-selectors';
import { currentTaskListTasksStatusSelector } from '@/app/selectors/task-list-selectors';
import { originConfig } from '@/app/components/task/StandardTaskItem/helpers';

export interface Props extends Segment {
  name: string;
  count: number;
  taskGroupIdentifier: string;
  bgColor: boolean;
  groupTaskCounts: boolean;
  tasksCount: boolean;
  origin: string;
}

function VListGroup(
  {
    name,
    count,
    taskGroupIdentifier,
    metadata,
    bgColor,
    groupTaskCounts,
    tasksCount,
    register,
    origin,
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();

  const taskListStatus = useSelector(currentTaskListTasksStatusSelector);

  const moveGroup = useCallback(
    // @ts-ignore
    (index, direction) => {
      const factor = direction === 'up' ? -1 : 1;
      dispatch(reorderTaskListGroups(index, index + factor));
    },
    [dispatch],
  );
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const searchValue = useSelector(searchTermSelector);
  const enableTaskGroup = originConfig[origin]?.enableTaskGroup ?? false;

  const loadTasksForTaskGroup = useCallback(() => {
    const payload = {
      taskGroupIdentifier,
      status: taskListStatus ?? 'INCOMPLETE',
      startPosition: 0,
      sort: {},
      viewMode: ViewType.SLIM_VIEW,
      refresh: true,
    };
    dispatch(getTasksForTaskGroups(payload));
  }, [dispatch, taskGroupIdentifier, taskListStatus]);

  return (
    <Sc.VListGroup
      ref={ref}
      {...register}
      bgColor={bgColor}
      enableTaskGroup={enableTaskGroup}
    >
      {enableTaskGroup && (
        <>
          {/* @ts-ignore */}
          <TasksGroup
            isDefaultGroup={name === 'DEFAULT'}
            taskGroupIdentifier={taskGroupIdentifier}
            groupName={name}
            groupTaskCounts={groupTaskCounts}
            tasksCount={tasksCount}
            areFiltersApplied={areFiltersApplied}
            isSearchApplied={searchValue}
            moveGroupUp={() => moveGroup(metadata.sameLevelIndex, 'up')}
            moveGroupDown={() => moveGroup(metadata.sameLevelIndex, 'down')}
            onTaskGroupRefresh={loadTasksForTaskGroup}
            origin={origin}
            bgColor={bgColor}
          >
            {() => null}
          </TasksGroup>
        </>
      )}
    </Sc.VListGroup>
  );
}

export default forwardRef(VListGroup);
