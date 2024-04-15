import React, { ForwardedRef, forwardRef, useCallback, useMemo } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Sc from './styled';
import { createTask } from '@/app/sagas/list-details-saga';
import { taskCountersSelector } from 'selectors/list-details-selectors';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import { applyTaskTemplate } from 'actions/list-details-actions';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import { useVirtualTaskListScrollContext } from '../../VirtualTastListScrollContext';

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
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const { visibleWidth, droppableHeaderWidth } =
    useVirtualTaskListScrollContext();

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

  const iconColorActiveItem = useMemo(
    () =>
      currentOrganization?.themeSettings?.find(
        ({ name }: any) => name === 'icon.active.color',
      ) || {},
    [currentOrganization?.themeSettings],
  );

  const applyTemplate = useCallback(
    (template) =>
      dispatch(
        applyTaskTemplate({
          taskTemplateIdentifier: template?.identifier,
          taskListIdentifier,
          taskGroupIdentifier,
        }),
      ),
    [dispatch, taskListIdentifier],
  );

  return (
    <Sc.VQuickAddTaskContainer
      $width={droppableHeaderWidth ? `${droppableHeaderWidth}px` : '100%'}
    >
      <Sc.VQuickAddTask
        ref={ref}
        {...register}
        $width={visibleWidth ? `${visibleWidth - 60}px` : '100%'}
      >
        <QuickAddTaskInput
          // @ts-ignore
          taskListIdentifier={taskListIdentifier}
          quickAddTask={onQuickAddTask}
          validator={quickTaskInputValidator}
          iconColorActive={iconColorActiveItem?.value}
        />
        <Sc.TaskTemplateApplicatorContainer>
          <TaskTemplateApplicator
            onTemplateSelect={applyTemplate}
            bulkApply={false}
            isWorkflowSearch
            origin={TaskOrigin.LIST}
          />
        </Sc.TaskTemplateApplicatorContainer>
      </Sc.VQuickAddTask>
    </Sc.VQuickAddTaskContainer>
  );
}

export default forwardRef(VQuickAddTask);
