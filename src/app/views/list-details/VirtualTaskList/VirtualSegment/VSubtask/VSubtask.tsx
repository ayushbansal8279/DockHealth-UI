import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import { getSubtaskStylingLink } from 'components/task/StandardTaskItem/helpers';
import QuickAddSubtask from '@/app/components/task/StandardTaskItem/QuickAddSubtask';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import * as Sc from './styled';
import { useDispatch, useSelector } from 'react-redux';
import { taskLookupSelector } from '@/app/selectors/task-details-selectors';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import {
  searchTermSelector,
  taskDetailsSortSelector,
} from '@/app/selectors/list-details-selectors';
import * as TaskActions from 'actions/task-actions';
import { megaFilterSelector } from '@/app/selectors/mega-filter-selectors';
import palette from '@/app/styles/palette';
import { QuickAddInputWrapper } from '@/app/components/task-template/TaskTemplateGroup/styled';
import QuickAddTaskInput from '@/app/components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { CollapseContext } from '../../VirtualTaskList';
import { useVirtualTaskListScrollContext } from '../../VirtualTaskListScrollContext';

export interface Props extends Segment {
  task: any;
  bgColor: boolean;
  isLastTaskOfGroup: boolean;
  isLastGroupOfList: boolean;
  isLastSubtaskParentTask: boolean;
  isNextVirtualTaskItemTypeBundle: boolean;
}

function VSubtask(
  {
    metadata,
    register,
    task,
    bgColor,
    isLastTaskOfGroup,
    isLastGroupOfList,
    isLastSubtaskParentTask,
    isNextVirtualTaskItemTypeBundle,
    isWorkflowSubTask,
    ...record
  }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations
  ref: ForwardedRef<HTMLDivElement>,
) {
  const isLast = () => {
    const xs = metadata.parent?.children ?? [];
    const i = xs.indexOf(metadata.id);
    if (i !== -1) {
      return xs.length - 1 === i;
    }
    return false;
  };
  const { visibleWidth, droppableHeaderWidth } =
    useVirtualTaskListScrollContext();
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const percentage =
    ((!!droppableHeaderWidth ? droppableHeaderWidth : 0) / screenWidth) * 100;
  const [subtaskQuickAddOpen, setSubtaskQuickAddOpen] = useState(false);
  const dispatch = useDispatch();
  const pulledTask = useSelector((state) => {
    // @ts-ignore
    return taskLookupSelector(state, origin, metadata.parent.id);
  });
  const [addWorkflowTask, setAddWorkflowTask] = useState(false);
  const parentTask = pulledTask;
  const { taskList, taskGroups, identifier } = parentTask;
  const { workflowIdentifierMap, handleRemoveWorkflowIdentifier } =
    useContext(CollapseContext);

  const taskGroup = !!taskGroups
    ? taskGroups.filter((taskGroup) =>
        taskGroup?.groupType === 'TASK_BUNDLE' ? taskGroup : '',
      )
    : '';

  useEffect(() => {
    setSubtaskQuickAddOpen(parentTask?.subtaskQuickAddOpen);
    workflowIdentifierMap.some(
      (identifier) => identifier === taskGroup[0]?.taskGroupIdentifier,
    )
      ? setAddWorkflowTask(true)
      : setAddWorkflowTask(false);
  }, [parentTask, workflowIdentifierMap]);

  // @ts-ignore
  const noOfSubtask = metadata.parent?.children.length - 1;

  const searchValue = useSelector(searchTermSelector);
  const megaFilter = useSelector(megaFilterSelector);
  const sort = useSelector(taskDetailsSortSelector);
  const { selectedFilters } = megaFilter || {};

  const handleAddBundleTask = useCallback(
    (workflowTask) => {
      const taskData = {
        ...workflowTask,
        taskGroupIdentifier: taskGroup[0]?.taskGroupIdentifier,
        taskListIdentifier: taskList?.taskListIdentifier,
      };
      dispatch(TaskActions.saveTask(taskData));
    },
    [
      dispatch,
      // identifier,
      taskGroup,
      taskList?.taskListIdentifier,
    ],
  );

  return (
    <Draggable
      draggableId={metadata.id}
      index={metadata.index}
      key={metadata.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <>
          <div
            style={{
              background: bgColor ? palette.aliceBlue : '',
              paddingBottom:
                isLastTaskOfGroup &&
                !subtaskQuickAddOpen &&
                !addWorkflowTask &&
                !isNextVirtualTaskItemTypeBundle
                  ? isLastSubtaskParentTask
                    ? bgColor
                      ? '24px'
                      : isLastGroupOfList
                      ? '24px'
                      : '0px'
                    : '0px'
                  : isLastSubtaskParentTask &&
                    !addWorkflowTask &&
                    !subtaskQuickAddOpen &&
                    !isNextVirtualTaskItemTypeBundle
                  ? isWorkflowSubTask
                    ? '10px'
                    : '2px'
                  : '',
            }}
          >
            <Sc.VSubtask
              ref={ref}
              {...register}
              $subitem={metadata.level > 1}
              isWorkflowSubtask={isWorkflowSubTask}
              searchValue={!!searchValue}
              isFilterApply={
                !!selectedFilters
                  ? Object.keys(selectedFilters).length > 0
                  : !!selectedFilters
              }
              isSortApplied={!!sort.key}
              bgColor={bgColor}
            >
              <div
                style={{
                  position: 'sticky',
                  left: '92.2px',
                  zIndex: '12',
                }}
              >
                {!!searchValue ||
                  (!!selectedFilters
                    ? Object.keys(selectedFilters).length > 0
                    : !!selectedFilters) ||
                  !!sort.key ||
                  getSubtaskStylingLink(isLast())}
              </div>
              <StandardTaskItem
                // @ts-ignore
                taskIdentifier={metadata.id}
                draggableProvided={provided}
                isDraggable
                isDragging={snapshot.isDragging}
                isWorkflowSubtask={isWorkflowSubTask}
                isSubtask
                origin={TaskOrigin.LIST}
                pageBackground={bgColor ? palette.aliceBlue : ''}
                isVirtualTask
                isVirtualSubtask
                $width={percentage < 90}
              />
            </Sc.VSubtask>
          </div>
          {metadata.sameLevelIndex === noOfSubtask && subtaskQuickAddOpen && (
            <div
              style={{
                width:
                  percentage > 90 ? `${droppableHeaderWidth + 70}` : '100%',
                paddingRight: percentage > 90 ? '17px' : '13px',
                background: bgColor ? palette.aliceBlue : '',
                paddingBottom:
                  isLastTaskOfGroup &&
                  !addWorkflowTask &&
                  !isNextVirtualTaskItemTypeBundle
                    ? isLastSubtaskParentTask
                      ? bgColor
                        ? '24px'
                        : isLastGroupOfList
                        ? '24px'
                        : '0px'
                      : '0px'
                    : isLastSubtaskParentTask &&
                      !addWorkflowTask &&
                      !isNextVirtualTaskItemTypeBundle
                    ? isWorkflowSubTask
                      ? '10px'
                      : '2px'
                    : '',
              }}
            >
              <Sc.QuickAddContainer
                $width={
                  percentage > 90
                    ? visibleWidth
                      ? `${visibleWidth - 100}px`
                      : '100%'
                    : `${visibleWidth - 120}px`
                }
              >
                <QuickAddSubtask
                  taskListIdentifier={parentTask.taskList.taskListIdentifier}
                  parentTaskIdentifier={parentTask.identifier}
                />
              </Sc.QuickAddContainer>
            </div>
          )}
          {isLastSubtaskParentTask && addWorkflowTask && (
            <div
              style={{
                width:
                  percentage > 90 ? `${droppableHeaderWidth + 70}` : '100%',
                paddingRight: percentage > 90 ? '16px' : '13px',
                background: bgColor ? palette.aliceBlue : '',
                paddingBottom:
                  isLastTaskOfGroup && !isNextVirtualTaskItemTypeBundle
                    ? isLastSubtaskParentTask
                      ? bgColor
                        ? '24px'
                        : isLastGroupOfList
                        ? '24px'
                        : '0px'
                      : '0px'
                    : isLastSubtaskParentTask &&
                      !isNextVirtualTaskItemTypeBundle
                    ? '10px'
                    : '',
              }}
            >
              <Sc.WorkflowQuickAddTaskContainer
                $width={
                  percentage > 90
                    ? visibleWidth
                      ? `${visibleWidth - 70}px`
                      : '100%'
                    : `${visibleWidth - 85}px`
                }
                subtaskQuickAddOpen={subtaskQuickAddOpen}
              >
                <QuickAddInputWrapper>
                  <QuickAddTaskInput
                    disableMentions
                    quickAddTask={handleAddBundleTask}
                    onBlur={() => {
                      handleRemoveWorkflowIdentifier(
                        taskGroup[0]?.taskGroupIdentifier,
                      );
                    }}
                    validator={(value) => {
                      if ([...value]?.filter((char) => char !== ' ').length < 2)
                        return 'The task description is too short (min. 2 characters)';

                      return null;
                    }}
                    origin={TaskOrigin.LIST}
                    // iconColorActive={iconColorActive}
                  />
                </QuickAddInputWrapper>
              </Sc.WorkflowQuickAddTaskContainer>
            </div>
          )}
        </>
      )}
    </Draggable>
  );
}

export default forwardRef(VSubtask);
