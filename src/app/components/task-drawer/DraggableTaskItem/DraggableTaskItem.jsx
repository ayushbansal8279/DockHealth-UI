import React, { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DrawerTask from '../../drawer-common/DrawerTask/DrawerTask';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { DragPreviewText, DragPreviewWrapper } from '../../task/styled';

const DraggableTaskItem = ({
  task,
  taskRestrictions,
  taskListRestrictions,
  currentUser,
  isDragDisabled,
  isDragPreview,
  index,
  dropDirectionRef,
}) => {
  const [hoverBorder, setHoverBorder] = useState(null);
  const elementRef = useRef(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task?.taskIdentifier,
    data: {
      index,
      task,
    },
  });

  const {
    setNodeRef: setDroppableRef,
    isOver,
    active,
    over,
  } = useDroppable({
    id: task?.taskIdentifier,
    data: {
      index,
      task,
    },
  });

  useEffect(() => {
    const isFirstTaskOrSubtask = index === 0;

    if (!isFirstTaskOrSubtask || !active || !isOver) {
      setHoverBorder(null);
      if (dropDirectionRef) {
        dropDirectionRef.current = null;
      }
      return;
    }

    const handlePointerMove = (e) => {
      const rect = elementRef?.current?.getBoundingClientRect();
      if (!rect) return;

      const isTop = e?.clientY < rect?.top + rect?.height / 2;
      const direction = isTop ? 'top' : 'bottom';
      if (dropDirectionRef) {
        dropDirectionRef.current = direction;
      }
      setHoverBorder(direction);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [active?.id, over?.id, index]);

  if (isDragPreview) {
    return (
      <DragPreviewWrapper style={{ marginLeft: '-80px' }}>
        <DragPreviewText>{task?.description}</DragPreviewText>
      </DragPreviewWrapper>
    );
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
        elementRef.current = node;
      }}
    >
      <DrawerTask
        key={task.taskIdentifier}
        task={task}
        taskRestrictions={taskRestrictions}
        taskListRestrictions={taskListRestrictions}
        currentUser={currentUser}
        dragListeners={listeners}
        dragAttributes={attributes}
        isDraggable={!isDragDisabled}
        isDragging={isDragging}
        isDragActive={!!active && active?.id === task.taskIdentifier}
        isDraggedOver={isOver && active?.id !== task.taskIdentifier}
        hoverBorder={hoverBorder === 'top'}
      />
    </div>
  );
};

export default DraggableTaskItem;
