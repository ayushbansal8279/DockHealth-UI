import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';

const moveItemInArrayFromIndexToIndex = (array, fromIndex, toIndex) => {
  if (fromIndex === toIndex) return array;

  const newArray = [...array];

  const target = newArray[fromIndex];
  const inc = toIndex < fromIndex ? -1 : 1;

  for (let i = fromIndex; i !== toIndex; i += inc) {
    newArray[i] = newArray[i + inc];
  }

  newArray[toIndex] = target;

  return newArray;
};

export const onDragEndTask = ({
  eventBundle,
  groupList,
  tasks,
  reorderTasksInGroup,
  reassignTasksToAnotherGroup,
  updateTaskGroups,
  setDraggableId,
  taskListIdentifier,
}) => {
  setDraggableId(null);

  const { destination, source } = eventBundle;

  const sourceGroup = groupList?.find(
    ({ taskGroupIdentifier, groupType }) =>
      source.droppableId === taskGroupIdentifier ||
      source.droppableId === groupType,
  );

  const sourceGroupKey =
    sourceGroup.groupType === TASKGROUP_DEFAULT_TYPE
      ? sourceGroup.groupType
      : sourceGroup.taskGroupIdentifier;

  const sourceTasks = tasks[sourceGroupKey];

  const sourceTasksOrder = sourceTasks?.map(
    ({ taskIdentifier }) => taskIdentifier,
  );

  const newSourceTasksOrder = [...sourceTasksOrder];

  if (destination) {
    if (
      destination?.droppableId === source?.droppableId &&
      destination?.index !== source?.index
    ) {
      newSourceTasksOrder.splice(
        destination.index,
        0,
        newSourceTasksOrder.splice(source.index, 1)[0],
      );

      const { taskGroupIdentifier } = sourceGroup;

      const reorderedTasks = newSourceTasksOrder?.map(identifier =>
        sourceTasks?.find(
          ({ taskIdentifier }) => taskIdentifier === identifier,
        ),
      );

      updateTaskGroups({
        ...tasks,
        [sourceGroupKey]: reorderedTasks,
      });

      reorderTasksInGroup({
        orderedTaskIds: newSourceTasksOrder,
        taskGroupIdentifier,
        taskListIdentifier,
      });
    }

    if (destination?.droppableId !== source?.droppableId) {
      const destinationGroup = groupList?.find(
        ({ taskGroupIdentifier, groupType }) =>
          destination.droppableId === taskGroupIdentifier ||
          destination.droppableId === groupType,
      );

      const destinationGroupKey =
        destinationGroup.groupType === TASKGROUP_DEFAULT_TYPE
          ? destinationGroup.groupType
          : destinationGroup.taskGroupIdentifier;

      const destinationTasks = tasks[destinationGroupKey] || [];

      const destinationTasksOrder = destinationTasks?.map(
        ({ taskIdentifier }) => taskIdentifier,
      );

      const newDestinationTasksOrder = [...destinationTasksOrder];

      newDestinationTasksOrder.splice(
        destination.index,
        0,
        sourceTasksOrder[source.index],
      );

      newSourceTasksOrder.splice(source.index, 1);

      const { taskGroupIdentifier } = destinationGroup;
      const sourceTask = sourceTasks[source.index];
      const { taskIdentifier: sourceTaskIdentifier } = sourceTask;

      // eslint-disable-next-line sonarjs/no-identical-functions
      const reorderedSourceTasks = newSourceTasksOrder?.map(identifier =>
        sourceTasks?.find(
          ({ taskIdentifier }) => taskIdentifier === identifier,
        ),
      );

      const newDestinationTasks = [...destinationTasks, sourceTask];

      const reorderedDestinationTasks = newDestinationTasksOrder?.map(
        identifier =>
          newDestinationTasks?.find(
            ({ taskIdentifier }) => taskIdentifier === identifier,
          ),
      );

      updateTaskGroups({
        ...tasks,
        [sourceGroupKey]: reorderedSourceTasks,
        [destinationGroupKey]: reorderedDestinationTasks,
      });

      reassignTasksToAnotherGroup({
        taskIdentifiers: [sourceTaskIdentifier],
        taskGroupIdentifier,
      });
    }
  }
};

export const onDragEndSubtask = ({
  eventBundle,
  subtasksOrder,
  reorderSubtasksForTask,
  groupId,
  parentTaskId,
  orderedSubtasks,
  reorderSubtasksInState,
  setDraggableId,
}) => {
  const { destination, source } = eventBundle;
  setDraggableId(null);

  if (destination && destination?.index !== source?.index) {
    const newSubtasksOrder = moveItemInArrayFromIndexToIndex(
      subtasksOrder,
      source.index,
      destination.index,
    );

    const reorderedTasks = newSubtasksOrder.map(taskId =>
      orderedSubtasks.find(({ taskIdentifier }) => taskIdentifier === taskId),
    );

    reorderSubtasksInState(reorderedTasks);

    reorderSubtasksForTask({
      orderedSubtaskIds: newSubtasksOrder,
      taskGroupIdentifier: groupId,
      parentTaskIdentifier: parentTaskId,
    });
  }
};
