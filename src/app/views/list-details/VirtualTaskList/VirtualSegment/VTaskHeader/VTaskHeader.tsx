import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
} from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import { useDispatch, useSelector } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
// @ts-ignore
import { compose } from 'ramda';
import * as ListDetailsActions from 'actions/list-details-actions';
import { isTaskItemsSelectedSelector } from 'selectors/task-items-selectors';
import * as Sc from './styled';
import { taskDetailsSortSelector } from 'selectors/list-details-selectors';
import { patientTasksSortSelector } from 'selectors/patient-details-selectors';
import palette from '@/app/styles/palette';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import { useVirtualTaskListScrollContext } from '../../VirtualTaskListScrollContext';
import TasksSkeletonLoader from '@/app/components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import { originConfig } from '@/app/components/task/StandardTaskItem/helpers';

export interface Props extends Segment {
  isTaskTemplate: boolean;
  bgColor: boolean;
  groupWithZeroTask: boolean;
  isLastGroupOfList: boolean;
  isLoadingGroup: boolean;
  origin: string;
  sort?: any;
  onSortChange?: (key: string, order: string) => void;
}

function VTaskHeader(
  {
    metadata,
    register,
    isTaskTemplate,
    groupWithZeroTask,
    isLastGroupOfList,
    bgColor,
    isLoadingGroup,
    origin,
    sort: sortProp,
    onSortChange: onSortChangeProp,
  }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();
  const listSort = useSelector(taskDetailsSortSelector);
  const patientSort = useSelector(patientTasksSortSelector);
  const listOnSortChange = compose(
    dispatch,
    ListDetailsActions.sortListDetailsTasks,
  );

  const sort =
    sortProp ?? (origin === TaskOrigin.PATIENT ? patientSort : listSort);
  const onSortChange = onSortChangeProp ?? listOnSortChange;
  // @ts-ignore
  const { bulkEditEnabled } = useContext(BulkEditContext);
  const isGroupSelected = useSelector(
    isTaskItemsSelectedSelector(metadata.parent?.children),
  );
  const { visibleWidth, droppableHeaderWidth } =
    useVirtualTaskListScrollContext();
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const percentage = ((droppableHeaderWidth ?? 0) / screenWidth) * 100;
  const groupHasMultipleAssignees = false;

  const handleGroupSelect = useCallback(() => {
    const taskIdentifiers = metadata.parent?.children;
    dispatch(
      // @ts-ignore
      TaskActions.changeTasksSelectedState(!isGroupSelected, taskIdentifiers),
    );
  }, [dispatch, isGroupSelected, metadata.parent?.children]);

  return (
    <div
      style={{
        width: percentage > 90 ? `${(droppableHeaderWidth ?? 0) + 70}` : '100%',
        paddingBottom:
          isLastGroupOfList && groupWithZeroTask && !bgColor ? '20px' : '0px',
        background: bgColor ? palette.aliceBlue : '',
      }}
    >
      {isLoadingGroup ? (
        <TasksSkeletonLoader rows={4} />
      ) : (
        // @ts-ignore - styled component type issues
        <Sc.VTaskHeader
          ref={ref}
          {...register}
          $subitem={metadata.level > 1}
          $template={isTaskTemplate}
          bgColor={bgColor}
          groupWithZeroTask={groupWithZeroTask}
          disableLeftOffset={
            originConfig[origin as keyof typeof originConfig]
              ?.disableLeftOffset ?? false
          }
          disableRightOffset={
            originConfig[origin as keyof typeof originConfig]
              ?.disableRightOffset ?? false
          }
        >
          {groupWithZeroTask ? (
            <></>
          ) : (
            // @ts-ignore - TasksHeader props type issues
            <TasksHeader
              bulkEditEnabled={bulkEditEnabled}
              sort={sort}
              onSortChange={onSortChange}
              // @ts-ignore
              groupHasMultipleAssignees={groupHasMultipleAssignees}
              isGroupSelected={isGroupSelected}
              onGroupSelect={handleGroupSelect}
              pageBackground={bgColor ? palette.aliceBlue : ''}
              origin={
                (origin === TaskOrigin.PATIENT
                  ? TaskOrigin.PATIENT
                  : TaskOrigin.LIST) as any
              }
              listPageGroupHeader
              isWidthGreaterThanHundredPercent={percentage > 90}
            />
          )}
        </Sc.VTaskHeader>
      )}
    </div>
  );
}

export default forwardRef(VTaskHeader);
