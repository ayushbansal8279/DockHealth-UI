import React, {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import * as Sc from './styled';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import { useSelector } from 'react-redux';
import { taskLookupSelector } from '@/app/selectors/task-details-selectors';
import QuickAddSubtask from '@/app/components/task/StandardTaskItem/QuickAddSubtask';

export interface Props extends Segment {
  isTaskTemplate: boolean;
  isLastChild: boolean;
}

function VTask(
  { metadata, register, isTaskTemplate, isLastChild, ...record }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-unused-vars
  ref: ForwardedRef<HTMLDivElement>,
) {
  const parentTaskReference = useRef(null);
  const [subtaskQuickAddOpen, setSubtaskQuickAddOpen] = useState(false);

  const pulledTask = useSelector((state) => {
    // @ts-ignore
    return taskLookupSelector(state, origin, metadata.id);
  });

  const task = pulledTask;
  const [subTasksCount, setsubTasksCount] = useState(task.subTasksCount);

  useEffect(() => {
    setSubtaskQuickAddOpen(task?.subtaskQuickAddOpen);
    setsubTasksCount(task.subtasks.length);
  }, [task]);

  const handleQuickAddOnFocus = () => {
    setTimeout(() => {
      parentTaskReference.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      window.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }, 500);
  };

  return (
    <Draggable
      draggableId={metadata.id}
      index={metadata.index}
      key={metadata.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <>
          <Sc.VTask
            {...register}
            ref={parentTaskReference}
            $subitem={metadata.level > 1}
            // @ts-ignore
            $workflow={record.task?.itemType === 'BUNDLE'}
            $template={isTaskTemplate && isLastChild}
            isTaskTemplate={isTaskTemplate}
          >
            <StandardTaskItem
              // @ts-ignore
              taskIdentifier={metadata.id}
              draggableProvided={provided}
              isDraggable
              isDragging={snapshot.isDragging}
              isTaskTemplate={isTaskTemplate}
              isLastChild={isLastChild || false}
              origin={TaskOrigin.LIST}
            />
          </Sc.VTask>
          {subtaskQuickAddOpen && subTasksCount === 0 && (
            <Sc.QuickAddContainer>
              <QuickAddSubtask
                taskListIdentifier={task.taskList.taskListIdentifier}
                parentTaskIdentifier={metadata.id}
                onFocus={handleQuickAddOnFocus}
                // origin={origin}
              />
            </Sc.QuickAddContainer>
          )}
        </>
      )}
    </Draggable>
  );
}

export default forwardRef(VTask);
