import React, { useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Virtuoso } from 'react-virtuoso';
import { useDispatch } from 'react-redux';
import {
  reassignTasksToAnotherGroup,
  reorderTasksInGroup,
} from 'actions/list-details-actions';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import { reorderSubtasks } from 'actions/task-actions';
import { reorderWorkflowTasks } from 'actions/workflow-actions';
import VSegment from './VSegment';
import { FlatNode, Node } from './types';

export interface Props {
  nodes?: Node[];
  tasksMap: Record<string, any>;
  context?: any;
  showClearSortFiltersModal?: any;
  showCompletedWorkflowIdentifiers?: any;
  showIncompleteWorkflowIdentifiers?: any;
  currentTaskListTasksStatus?: any;
}

function Virtualized({
  nodes = [],
  tasksMap,
  context,
  showClearSortFiltersModal,
  showCompletedWorkflowIdentifiers,
  showIncompleteWorkflowIdentifiers,
  currentTaskListTasksStatus,
  ...props
}: Props) {
  const dispatch = useDispatch();

  const flatNodes = useMemo(() => walk(nodes), [nodes]);

  const handleDragEnd = useCallback(
    (drop: DropResult) => {
      if (drop.destination && drop.source) {
        const destination = flatNodes.find(
          (node) => node.index === drop.destination?.index,
        )!;
        const source = flatNodes.find(
          (node) => node.index === drop.source?.index,
        )!;
        const destinationParentFirstChild = flatNodes.find(
          (node) => node.id === destination.parent?.children[0],
        );
        const sourceParentFirstChild = flatNodes.find(
          (node) => node.id === source.parent?.children[0],
        );
        // const destinationOffsetIndex =
        //   (destination.index as number) -
        //   (destinationParentFirstChild?.index as number);
        // const sourceOffsetIndex =
        //   (source.index as number) - (sourceParentFirstChild?.index as number);

        // For Indexing Task
        const destinationOffsetIndexTask =
          (destination.taskIndex as number) -
          (destinationParentFirstChild?.taskIndex as number);
        const sourceOffsetIndexTask =
          (source.taskIndex as number) -
          (sourceParentFirstChild?.taskIndex as number);

        // For Indexing Subtask
        const destinationOffsetIndexSubtask =
          (destination.subtaskIndex as number) -
          (destinationParentFirstChild?.subtaskIndex as number);
        const sourceOffsetIndexSubtask =
          (source.subtaskIndex as number) -
          (sourceParentFirstChild?.subtaskIndex as number);

        // For Indexing TaskOfBundle
        const destinationOffsetIndexTaskOfBundle =
          (destination.taskOfBundleIndex as number) -
          (destinationParentFirstChild?.taskOfBundleIndex as number);
        const sourceOffsetIndexTaskOfBundle =
          (source.taskOfBundleIndex as number) -
          (sourceParentFirstChild?.taskOfBundleIndex as number);

        // eslint-disable-next-line default-case
        switch (source.kind) {
          case 'Task': {
            if (destination?.parent?.id !== source?.parent?.id) {
              dispatch(
                reassignTasksToAnotherGroup({
                  destination: {
                    index: destinationOffsetIndexTask,
                    droppableId: destination?.parent?.id,
                  },
                  source: {
                    index: sourceOffsetIndexTask,
                    droppableId: source?.parent?.id,
                  },
                }),
              );
            }
            dispatch(
              reorderTasksInGroup({
                destination: {
                  index: destinationOffsetIndexTask,
                  droppableId: destination?.parent?.id,
                },
                source: {
                  index: sourceOffsetIndexTask,
                },
              }),
            );
            break;
          }
          case 'Subtask': {
            dispatch(
              reorderSubtasks({
                source: { index: sourceOffsetIndexSubtask },
                destination: { index: destinationOffsetIndexSubtask },
                parentTask: tasksMap[source?.parent?.id!],
              }),
            );
            break;
          }
          case 'TaskOfBundle': {
            dispatch(
              reorderWorkflowTasks({
                source: { index: sourceOffsetIndexTaskOfBundle },
                destination: { index: destinationOffsetIndexTaskOfBundle },
                workflow: tasksMap[destination.parent?.id!],
                completedTasksShown:
                  ['COMPLETE', ''].includes(currentTaskListTasksStatus) ||
                  showCompletedWorkflowIdentifiers?.some(
                    (id: any) => id === destination.parent?.id,
                  ),
                incompleteTasksShown:
                  ['INCOMPLETE', ''].includes(currentTaskListTasksStatus) ||
                  (showIncompleteWorkflowIdentifiers ?? []).some(
                    (id: any) => id === destination.parent?.id,
                  ),
              }),
            );
            break;
          }
        }
      }
    },
    [flatNodes, dispatch, tasksMap],
  );

  return (
    <DragDropContext
      onBeforeDragStart={showClearSortFiltersModal}
      onDragEnd={handleDragEnd}
    >
      <Droppable
        mode="virtual"
        droppableId={'nodes[0].id'}
        renderClone={(provided, snapshot, rubric) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Placeholder id={rubric.draggableId} />
          </div>
        )}
      >
        {(provided) => (
          <Virtuoso
            // @ts-ignore
            scrollerRef={provided.innerRef}
            style={{ height: '100%' }}
            data={flatNodes}
            context={context}
            components={{
              Item: VSegment,
            }}
            {...props}
          />
        )}
      </Droppable>
    </DragDropContext>
  );
}

const walk = (
  nodes: Node[],
  parent: FlatNode | null = null,
  level: number = 0,
  state: { index: number } = { index: 0 },
  taskIndex: { index: number } = { index: 0 },
  taskOfBundleIndex: { index: number } = { index: 0 },
  subTaskState: { index: number } = { index: 0 },
): FlatNode[] => {
  return nodes.flatMap((node, index) => {
    const { id, phantom, type, kind, collapsed, data, handlers } = node;
    const isTask = !phantom && kind === 'Task';
    const isSubtask = !phantom && kind === 'Subtask';
    const isTaskOfBundle = !phantom && kind === 'TaskOfBundle';

    const flattened: FlatNode = {
      id,
      phantom,
      type,
      kind,
      index: phantom ? null : state.index,
      taskIndex: isTask ? taskIndex.index : null,
      subtaskIndex: isSubtask ? subTaskState.index : null,
      taskOfBundleIndex: isTaskOfBundle ? taskOfBundleIndex.index : null,
      sameLevelIndex: index,
      level,
      parent,
      collapsed,
      data,
      children: node.children
        .filter((child) => !child.phantom)
        .map((child) => child.id),
      handlers,
    };

    if (!phantom) {
      state.index = state.index + 1;

      if (isTask) taskIndex.index = taskIndex.index + 1;
      if (isSubtask) subTaskState.index = subTaskState.index + 1;
      if (isTaskOfBundle) taskOfBundleIndex.index = taskOfBundleIndex.index + 1;
    }

    return [
      flattened,
      ...walk(collapsed ? [] : node.children, flattened, level + 1, state),
    ];
  });
};

const Placeholder = ({ id }: any) => {
  return (
    // @ts-ignore
    <StandardTaskItem taskIdentifier={id} />
  );
};

export default Virtualized;
