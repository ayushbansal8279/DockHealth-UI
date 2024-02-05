import React, { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import * as Sc from './styled';
import { createTask } from '../../../../../sagas/list-details-saga';
import { taskCountersSelector } from '../../../../../selectors/list-details-selectors';
import { selectedUserOrganizationSelector } from '../../../../../selectors/user-selectors';

export interface Props extends Segment {
  taskGroupIdentifier: string;
}

function VQuickAddTask(
  { taskGroupIdentifier, register }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations
  ref: ForwardedRef<HTMLDivElement>,
) {
  const dispatch = useDispatch();
  const taskCounters = useSelector(taskCountersSelector);
  const { taskListIdentifier } = useParams();
  const { columns } = useTaskListColumnsConfig();
  const quickTaskInputValidator = (value: string) => {
    if ([...value]?.filter((char) => char !== ' ').length < 2)
      return 'The task description is too short (min. 2 characters)';
    return null;
  };
  const quickAddTask = useCallback(
    (task: any) => {
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
  const onQuickAddTask = useCallback(
    (task: any) => {
      quickAddTask({
        ...task,
        taskGroupIdentifier,
      });
    },
    [taskGroupIdentifier, quickAddTask],
  );
  const currentOrganization = useSelector(selectedUserOrganizationSelector);

  const iconColorActiveItem = useMemo(
    () =>
      currentOrganization?.themeSettings?.find(
        ({ name }: any) => name === 'icon.active.color',
      ) || {},
    [currentOrganization?.themeSettings],
  );

  return (
    <Sc.VQuickAddTask
      ref={ref}
      {...register}
      $width={
        // @ts-ignore
        !window.disabledVirtualTaskList
          ? columns
              // @ts-ignore
              .filter((f) => f.isChecked)
              // @ts-ignore
              .reduce(
                (accumulator, column) => accumulator + column.columnWidth,
                0,
              )
          : null
      }
    >
      <QuickAddTaskInput
        // @ts-ignore
        taskListIdentifier={taskListIdentifier}
        quickAddTask={onQuickAddTask}
        validator={quickTaskInputValidator}
        iconColorActive={iconColorActiveItem?.value}
      />
    </Sc.VQuickAddTask>
  );
}

export default forwardRef(VQuickAddTask);
