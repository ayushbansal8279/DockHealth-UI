import React, { ForwardedRef, forwardRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ListDetailsActions from 'actions/list-details-actions';
import { Segment } from 'views/list-details/modules/Virtualized';
import StickyContainer from '@/app/components/common/HorizontalScroll/StickyContainer';
import LoadMoreButton, {
  LoadMoreSection,
} from '@/app/components/common/LoadMoreButton/LoadMoreButton';
import TasksSkeletonLoader from '@/app/components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import { taskDetailsSortSelector } from '@/app/selectors/list-details-selectors';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import * as Sc from './styled';
import { useVirtualTaskListScrollContext } from '../../VirtualTaskListScrollContext';
import { userPreferenceStatusSelector } from '@/app/selectors/user-preference-selectors';

export interface Props extends Segment {}

function VLoadMoreTasks(
  { metadata, register, listTaskGroup, bgColor }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();
  const sort = useSelector(taskDetailsSortSelector);
  const { isLoadingGroup, isFetchingMoreTasks } = listTaskGroup ?? {};
  const { visibleWidth, droppableHeaderWidth } =
    useVirtualTaskListScrollContext();
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const number = droppableHeaderWidth;
  const percentage = ((!!number ? number : 0) / screenWidth) * 100;
  const currentStatus = useSelector(userPreferenceStatusSelector);

  const loadTasksForTaskGroup = useCallback(
    ({ taskGroupIdentifier, startPosition, viewMode, refresh }) => {
      const payload = {
        taskGroupIdentifier,
        status: currentStatus,
        startPosition,
        sort,
        viewMode,
        refresh,
      };
      dispatch(ListDetailsActions.getTasksForTaskGroups(payload));
    },
    [currentStatus, dispatch, sort],
  );

  return (
    <Sc.VLoadMoreTasks
      bgColor={bgColor}
      $width={percentage > 100 ? `${droppableHeaderWidth + 70}px` : '100%'}
    >
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
