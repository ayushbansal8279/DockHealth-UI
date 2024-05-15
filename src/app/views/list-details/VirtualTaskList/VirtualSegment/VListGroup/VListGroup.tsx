import React, { ForwardedRef, forwardRef, useCallback } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import { reorderTaskListGroups } from 'actions/list-details-actions';
import { useDispatch, useSelector } from 'react-redux';
import * as Sc from './styled';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import { hasFiltersAppliedSelector } from '@/app/selectors/mega-filter-selectors';
import { searchTermSelector } from '@/app/selectors/list-details-selectors';

export interface Props extends Segment {
  name: string;
  count: number;
  taskGroupIdentifier: string;
  bgColor: boolean;
  groupTaskCounts: boolean;
  tasksCount: boolean;
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
  }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();

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

  return (
    <Sc.VListGroup ref={ref} {...register} bgColor={bgColor}>
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
        origin={TaskOrigin.LIST}
        bgColor={bgColor}
      >
        {() => null}
      </TasksGroup>
    </Sc.VListGroup>
  );
}

export default forwardRef(VListGroup);
