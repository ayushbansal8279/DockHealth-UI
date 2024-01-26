import React, { ForwardedRef, forwardRef } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import { getSubtaskStylingLink } from 'components/task/StandardTaskItem/helpers';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import * as Sc from './styled';

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
  return (
    <Draggable
      draggableId={metadata.id}
      index={metadata.index}
      key={metadata.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Sc.VSubtask ref={ref} {...register} $subitem={metadata.level > 1}>
          {getSubtaskStylingLink(isLast())}
          <StandardTaskItem
            // @ts-ignore
            taskIdentifier={metadata.id}
            draggableProvided={provided}
            isDraggable
            isDragging={snapshot.isDragging}
          />
        </Sc.VSubtask>
      )}
    </Draggable>
  );
}

export default forwardRef(VSubtask);
