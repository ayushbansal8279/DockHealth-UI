import React, { ForwardedRef, forwardRef } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import * as Sc from './styled';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

export interface Props extends Segment {
  isTaskTemplate: boolean;
}

function VTask({ metadata, register, isTaskTemplate, ...record }: Props, ref: ForwardedRef<HTMLDivElement>) {
  console.log('VTask', metadata);
  return (
      <Draggable draggableId={metadata.id} index={metadata.index} key={metadata.id}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Sc.VTask
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={provided.draggableProps.style}
            {...register}
            $subitem={metadata.level > 1}
            $template={isTaskTemplate}
          >
            {/* @ts-ignore */}
            <StandardTaskItem taskIdentifier={metadata.id}/>
          </Sc.VTask>
        )}
      </Draggable>
  );
}

export default forwardRef(VTask);