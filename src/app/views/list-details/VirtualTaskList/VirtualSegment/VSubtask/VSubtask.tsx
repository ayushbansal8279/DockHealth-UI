import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
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
import { useSelector } from 'react-redux';
import { taskLookupSelector } from '@/app/selectors/task-details-selectors';

export interface Props extends Segment {
  task: any;
}

function VSubtask(
  { metadata, register, task, ...record }: Props,
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

  const [subtaskQuickAddOpen, setSubtaskQuickAddOpen] = useState(false);

  const pulledTask = useSelector((state) => {
    // @ts-ignore
    return taskLookupSelector(state, origin, metadata.parent.id);
  });

  const parentTask = pulledTask;

  useEffect(() => {
    setSubtaskQuickAddOpen(parentTask?.subtaskQuickAddOpen);
  }, [parentTask]);

  // @ts-ignore
  const noOfSubtask = metadata.parent?.children.length - 1;

  return (
    <Draggable
      draggableId={metadata.id}
      index={metadata.index}
      key={metadata.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <>
          <Sc.VSubtask
            ref={ref}
            {...register}
            $subitem={metadata.level > 1}
            isWorkflowSubtask={!!task}
          >
            {getSubtaskStylingLink(isLast())}
            <StandardTaskItem
              // @ts-ignore
              taskIdentifier={metadata.id}
              draggableProvided={provided}
              isDraggable
              isDragging={snapshot.isDragging}
              isWorkflowSubtask={!!task}
              isSubtask
            />
          </Sc.VSubtask>
          {metadata.sameLevelIndex === noOfSubtask && subtaskQuickAddOpen && (
            <Sc.QuickAddContainer>
              <QuickAddSubtask
                taskListIdentifier={parentTask.taskList.taskListIdentifier}
                parentTaskIdentifier={parentTask.identifier}
                isWorkflowSubtask={!!task}
                // onFocus={handleQuickAddOnFocus}
                // origin={origin}
              />
            </Sc.QuickAddContainer>
          )}
        </>
      )}
    </Draggable>
  );
}

export default forwardRef(VSubtask);
