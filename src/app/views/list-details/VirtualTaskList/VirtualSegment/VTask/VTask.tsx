import React, { ForwardedRef, forwardRef } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import * as Sc from './styled';

export interface Props extends Segment {
  isTaskTemplate: boolean;
  isLastChild: boolean;
}

function VTask(
  { metadata, register, isTaskTemplate, ...record }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-unused-vars
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <Draggable
      draggableId={metadata.id}
      index={metadata.index}
      key={metadata.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Sc.VTask
          {...register}
          $subitem={metadata.level > 1}
          // @ts-ignore
            $workflow={record.task?.itemType === "BUNDLE"}
            $template={isTaskTemplate}
        >
          <StandardTaskItem
            // @ts-ignore
            taskIdentifier={metadata.id}
            draggableProvided={provided}
            isDraggable
              isDragging={snapshot.isDragging}
              isTaskTemplate={isTaskTemplate}
              isLastChild={isLastChild}
          />
        </Sc.VTask>
      )}
    </Draggable>
  );
}

export default forwardRef(VTask);
