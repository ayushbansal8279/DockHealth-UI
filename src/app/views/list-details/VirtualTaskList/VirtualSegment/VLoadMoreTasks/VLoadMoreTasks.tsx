import StickyContainer from '@/app/components/common/HorizontalScroll/StickyContainer';
import LoadMoreButton, {
  LoadMoreSection,
} from '@/app/components/common/LoadMoreButton/LoadMoreButton';
import TasksSkeletonLoader from '@/app/components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import { taskDetailsSortSelector } from '@/app/selectors/list-details-selectors';
import React, { ForwardedRef, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ListDetailsActions from 'actions/list-details-actions';
import { Segment } from 'views/list-details/modules/Virtualized';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import * as Sc from './styled';

export interface Props extends Segment {}

function VLoadMoreTasks(
  { metadata, register, listTaskGroup, bgColor }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();
  const sort = useSelector(taskDetailsSortSelector);
  const { isLoadingGroup, isFetchingMoreTasks } = listTaskGroup ?? {};

  const loadTasksForTaskGroup = useCallback(
    ({ taskGroupIdentifier, startPosition, viewMode, refresh }) => {
      const payload = {
        taskGroupIdentifier,
        status: 'INCOMPLETE',
        startPosition,
        sort,
        viewMode,
        refresh,
      };
      dispatch(ListDetailsActions.getTasksForTaskGroups(payload));
    },
    [dispatch, sort],
  );

  return (
    <Sc.VLoadMoreTasks bgColor={bgColor}>
      {(isLoadingGroup || isFetchingMoreTasks) && (
        <TasksSkeletonLoader rows={3} />
      )}
      {!isLoadingGroup && listTaskGroup?.hasMore && (
        <StickyContainer left={24} decreaseWidth={2 * 24}>
          <LoadMoreSection origin={TaskOrigin.LIST} bgColor={bgColor}>
            {listTaskGroup?.moreTasksIndex &&
              listTaskGroup?.moreTasksIndex !== 0 &&
              !isFetchingMoreTasks && (
                <LoadMoreButton
                  onClick={() => {
                    loadTasksForTaskGroup({
                      taskGroupIdentifier: listTaskGroup?.groupIdentifier,
                      startPosition: listTaskGroup?.moreTasksIndex || 0,
                      refresh: false,
                    });
                  }}
                />
              )}
            {(!listTaskGroup?.moreTasksIndex ||
              listTaskGroup?.moreTasksIndex === 0) && (
              <span>Limiting results. Please refine filter.</span>
            )}
          </LoadMoreSection>
        </StickyContainer>
      )}
    </Sc.VLoadMoreTasks>
  );
}

export default forwardRef(VLoadMoreTasks);
