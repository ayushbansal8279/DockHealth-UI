import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BoardColumn from './BoardColumn';
import { BoardContainer } from './styled';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import BoardColumnTask from './BoardColumnTask';

const Board = ({
  taskList,
  columns,
  getColumnContextMenuOptionsArray,
  getTaskContextMenuOptionsArray,
  onReorderColumns,
  onReorderTasks,
  onAddTask,
  onAddWorkflow,
  iconColorActive,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor),
  );
  const [taskColumnMap, setTaskColumnMap] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);

  const columnIds = useMemo(
    () => columns?.map((column) => column?.identifier),
    [columns],
  );

  useEffect(() => {
    if (!columns) return;

    const newTaskMap = columns.flatMap((column) =>
      (column?.tasks ?? []).map((taskId, index) => ({
        taskId,
        columnId: column.identifier,
        taskIndex: index,
      })),
    );

    setTaskColumnMap(newTaskMap);
  }, [columns]);

  const findColumnAndIndexByTaskId = (taskId) => {
    for (const column of columns) {
      const index = column?.tasks?.indexOf(taskId);
      if (index !== -1 && index !== undefined) {
        return {
          columnId: column?.identifier,
          taskIndex: index,
        };
      }
    }
    return null; // not found
  };

  const handleDragStart = ({ active }) => {
    if (active?.data?.current?.type === 'COLUMN') {
      setActiveColumn(active?.data?.current?.column);
      return;
    }
    if (active?.data?.current?.type === 'TASK_LIST') {
      setActiveTask(active?.data?.current?.task);
      setActiveTaskIndex(active?.data?.current?.taskIndex);
    }
  };

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      setActiveColumn(null);
      setActiveTask(null);
      setActiveTaskIndex(null);
      if (!over) return;
      const type =
        active?.data?.current?.type === 'COLUMN' &&
        over?.data?.current?.type === 'COLUMN'
          ? 'COLUMN'
          : 'TASK_LIST';
      if (active?.id === over?.id && type === 'COLUMN') return;
      switch (type) {
        case 'COLUMN':
          onReorderColumns(
            active?.data?.current?.sortable?.index,
            over?.data?.current?.sortable?.index,
          );
          break;

        case 'TASK_LIST':
          const sourceResult = findColumnAndIndexByTaskId(active.id);
          const { columnId: sourceColId, taskIndex: sourceTaskIndex } =
            sourceResult;
          const source = {
            droppableId: sourceColId,
            index: sourceTaskIndex,
          };
          const destination = {
            droppableId: over?.data?.current?.task?.columnId,
            index: over?.data?.current?.sortable?.index,
          };
          onReorderTasks(source, destination);
          break;

        default:
          break;
      }
    },
    [onReorderColumns, onReorderTasks],
  );

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active?.id;
    const overId = over?.id;
    const activeType = active?.data?.current?.type;
    const overType = over?.data?.current?.type;

    const isActiveATask = activeType === 'TASK_LIST';
    const isOverATask = overType === 'TASK_LIST';
    const isOverAColumn = overType === 'COLUMN';

    if (!isActiveATask) return;
    if (isOverATask) {
      // In Dropping a Task over Another Column Task
      setTaskColumnMap((tasks) => {
        const activeIndex = tasks?.findIndex((t) => t.taskId === activeId);
        const overIndex = tasks?.findIndex((t) => t.taskId === overId);
        const destinationIndex = over?.data?.current?.sortable?.index;
        if (activeIndex === -1 || overIndex === -1) return tasks;
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        tasks[activeIndex].taskIndex = destinationIndex;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // In Dropping a Task over Another Column
    if (isActiveATask && isOverAColumn) {
      setTaskColumnMap((tasks) => {
        const activeIndex = tasks?.findIndex((t) => t.taskId === activeId);
        if (activeIndex === -1) return tasks;
        tasks[activeIndex].columnId = overId;
        // tasks[activeIndex].taskIndex = 0;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          id="columns"
          strategy={horizontalListSortingStrategy}
          items={columnIds}
        >
          <BoardContainer>
            {columns?.map((column, index) => (
              <BoardColumn
                onAddTask={onAddTask}
                onAddWorkflow={onAddWorkflow}
                taskList={taskList}
                getColumnContextMenuOptionsArray={
                  getColumnContextMenuOptionsArray
                }
                getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
                column={column}
                key={column.identifier}
                index={index}
                iconColorActive={iconColorActive}
                columnTasks={taskColumnMap?.filter(
                  (task) => task?.columnId === column?.identifier,
                )}
              />
            ))}
          </BoardContainer>
        </SortableContext>
        <DragOverlay>
          {activeColumn && (
            <BoardColumn
              getColumnContextMenuOptionsArray={
                getColumnContextMenuOptionsArray
              }
              getTaskContextMenuOptionsArray={getTaskContextMenuOptionsArray}
              column={activeColumn}
              key={activeColumn?.identifier}
              iconColorActive={iconColorActive}
              columnTasks={taskColumnMap?.filter(
                (task) => task?.columnId === activeColumn?.identifier,
              )}
            />
          )}
          {activeTask && (
            <BoardColumnTask
              task={activeTask}
              isDragPreview
              index={activeTaskIndex}
            />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Board;
