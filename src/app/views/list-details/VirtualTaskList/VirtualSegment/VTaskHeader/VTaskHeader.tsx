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
import palette from '@/app/styles/palette';
import { TaskOrigin } from '@/app/helpers/task-helpers';

export interface Props extends Segment {
  isTaskTemplate: boolean;
  bgColor: boolean;
  groupWithZeroTask: boolean;
}

function VTaskHeader(
  { metadata, register, isTaskTemplate, groupWithZeroTask, bgColor }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();
  const sort = useSelector(taskDetailsSortSelector);
  const onSortChange = compose(
    dispatch,
    ListDetailsActions.sortListDetailsTasks,
  );
  // @ts-ignore
  const { bulkEditEnabled } = useContext(BulkEditContext);
  const isGroupSelected = useSelector(
    isTaskItemsSelectedSelector(metadata.parent?.children),
  );
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
        width: '100%',
        paddingBottom: groupWithZeroTask ? '20px' : '0px',
        background: bgColor ? palette.aliceBlue : '',
      }}
    >
      <Sc.VTaskHeader
        ref={ref}
        {...register}
        $subitem={metadata.level > 1}
        $template={isTaskTemplate}
        bgColor={bgColor}
        groupWithZeroTask={groupWithZeroTask}
      >
        {/* @ts-ignore */}
        {metadata.parent?.children.length === 0 ? (
          <></>
        ) : (
          <TasksHeader
            bulkEditEnabled={bulkEditEnabled}
            sort={sort}
            onSortChange={onSortChange}
            // @ts-ignore
            groupHasMultipleAssignees={groupHasMultipleAssignees}
            isGroupSelected={isGroupSelected}
            onGroupSelect={handleGroupSelect}
            pageBackground={bgColor ? palette.aliceBlue : ''}
            origin={TaskOrigin.LIST}
          />
        )}
      </Sc.VTaskHeader>
    </div>
  );
}

export default forwardRef(VTaskHeader);
