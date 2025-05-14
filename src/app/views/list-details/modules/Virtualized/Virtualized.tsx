import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';

export interface Props {
  nodes?: Node[];
  tasksMap: Record<string, any>;
  context?: any;
  showClearSortFiltersModal?: any;
  showCompletedWorkflowIdentifiers?: any;
  showIncompleteWorkflowIdentifiers?: any;
  currentTaskListTasksStatus?: any;
}
export const DropDirectionContext = createContext(null);

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
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const dropDirectionRef = useRef(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event?.active?.id);
  };

  const handleDragEnd = useCallback(
    (drop: DragEndEvent) => {
      if (drop?.over && drop?.active) {
        const destination = flatNodes.find(
          (node) => node?.id === drop?.over?.id,
        )!;

        const source = flatNodes.find((node) => node?.id === drop?.active?.id)!;

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
                    index:
                      destination?.kind === 'QuickAddTask'
                        ? 0
                        : dropDirectionRef?.current === 'top'
                        ? 0
                        : destinationOffsetIndexTask + 1,
                    droppableId: destination?.parent?.id,
                  },
                  source: {
                    index: sourceOffsetIndexTask,
                    droppableId: source?.parent?.id,
                  },
                }),
              );
            } else {
              dispatch(
                reorderTasksInGroup({
                  destination: {
                    index:
                      dropDirectionRef?.current === 'top'
                        ? 0
                        : sourceOffsetIndexTask <= destinationOffsetIndexTask
                        ? destinationOffsetIndexTask
                        : destinationOffsetIndexTask + 1,

                    droppableId: destination?.parent?.id,
                  },
                  source: {
                    index: sourceOffsetIndexTask,
                  },
                }),
              );
            }
            break;
          }
          case 'Subtask': {
            dispatch(
              reorderSubtasks({
                source: { index: sourceOffsetIndexSubtask },
                destination: {
                  index:
                    dropDirectionRef?.current === 'top'
                      ? 0
                      : sourceOffsetIndexSubtask <=
                        destinationOffsetIndexSubtask
                      ? destinationOffsetIndexSubtask
                      : destinationOffsetIndexSubtask + 1,
                },
                parentTask: tasksMap[source?.parent?.id!],
              }),
            );
            break;
          }
          case 'TaskOfBundle': {
            dispatch(
              reorderWorkflowTasks({
                source: { index: sourceOffsetIndexTaskOfBundle },
                destination: {
                  index:
                    dropDirectionRef?.current === 'top'
                      ? 0
                      : sourceOffsetIndexTaskOfBundle <=
                        destinationOffsetIndexTaskOfBundle
                      ? destinationOffsetIndexTaskOfBundle
                      : destinationOffsetIndexTaskOfBundle + 1,
                },
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
      setActiveId(null);
    },
    [flatNodes, dispatch, tasksMap],
  );

  return (
    <>
      <DropDirectionContext.Provider value={dropDirectionRef}>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={useSensors(
            useSensor(PointerSensor, {
              activationConstraint: {
                distance: 3,
              },
            }),
          )}
        >
          <Virtuoso
            // @ts-ignore
            // scrollerRef={provided.innerRef}
            style={{ height: '100%' }}
            data={flatNodes}
            context={context}
            components={{
              Item: VSegment,
            }}
            {...props}
          />
          <DragOverlay>
            {activeId ? <Placeholder id={activeId} /> : null}
          </DragOverlay>
        </DndContext>
      </DropDirectionContext.Provider>
    </>
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
    const { id, phantom, type, kind, collapsed, data, handlers, children } =
      node;
    const isTask = !phantom && kind === 'Task';
    const isSubtask = !phantom && kind === 'Subtask';
    const isTaskOfBundle = !phantom && kind === 'TaskOfBundle';

    const shouldIndex = [
      'QuickAddTask',
      'Task',
      'Subtask',
      'TaskOfBundle',
    ].includes(kind);

    const flattened: FlatNode = {
      id,
      phantom,
      type,
      kind,
      index: shouldIndex ? state.index++ : null,
      taskIndex: isTask ? taskIndex.index : null,
      subtaskIndex: isSubtask ? subTaskState.index : null,
      taskOfBundleIndex: isTaskOfBundle ? taskOfBundleIndex.index : null,
      sameLevelIndex: index,
      level,
      parent,
      collapsed,
      data,
      children: children
        .filter((child) => !child.phantom)
        .map((child) => child.id),
      handlers,
    };

    if (!phantom) {
      if (isTask) taskIndex.index = taskIndex.index + 1;
      if (isSubtask) subTaskState.index = subTaskState.index + 1;
      if (isTaskOfBundle) taskOfBundleIndex.index = taskOfBundleIndex.index + 1;
    }

    return [
      flattened,
      ...walk(collapsed ? [] : children, flattened, level + 1, state),
    ];
  });
};

const Placeholder = ({ id }: any) => {
  return (
    // @ts-ignore
    <StandardTaskItem taskIdentifier={id} isDragPreview />
  );
};

export default Virtualized;
