import React, { ForwardedRef, forwardRef, useCallback, useContext } from "react";
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import * as Sc from './styled';
import TasksHeader from "components/tasklist/TasksHeader/TasksHeader";
import { BulkEditContext } from "components/tasklist/BulkEditSection/BulkEditSection";
import { useDispatch, useSelector } from "react-redux";
import { isTaskItemsSelectedSelector } from "../../../../../selectors/task-items-selectors";
import * as TaskActions from "actions/task-actions";
import { taskDetailsSortSelector } from "../../../../../selectors/list-details-selectors";
// @ts-ignore
import { compose } from "ramda";
import * as ListDetailsActions from "actions/list-details-actions";

export interface Props extends Segment {
  isTaskTemplate: boolean;
}

function VTaskHeader({ metadata, register, isTaskTemplate, ...record }: Props, ref: ForwardedRef<HTMLDivElement>) {
  const dispatch = useDispatch();
  const sort = useSelector(taskDetailsSortSelector);
  const onSortChange = compose(
    dispatch,
    ListDetailsActions.sortListDetailsTasks,
  );
  // @ts-ignore
  const { bulkEditEnabled } = useContext(BulkEditContext);
  const isGroupSelected = useSelector(isTaskItemsSelectedSelector(metadata.children));
  const groupHasMultipleAssignees = false;
  const handleGroupSelect = useCallback(() => {
    const taskIdentifiers = metadata.children;
    dispatch(
      // @ts-ignore
      TaskActions.changeTasksSelectedState(!isGroupSelected, taskIdentifiers),
    );
  }, [dispatch, isGroupSelected, metadata.children]);
  return (
    <Sc.VTaskHeader
      ref={ref}
      {...register}
      $subitem={metadata.level > 1}
      $template={isTaskTemplate}
    >
      {/* @ts-ignore */}
      <TasksHeader
        bulkEditEnabled={bulkEditEnabled}
        sort={sort}
        onSortChange={onSortChange}
        // @ts-ignore
        groupHasMultipleAssignees={groupHasMultipleAssignees}
        isGroupSelected={isGroupSelected}
        onGroupSelect={handleGroupSelect}
      />
    </Sc.VTaskHeader>
  );
}

export default forwardRef(VTaskHeader);