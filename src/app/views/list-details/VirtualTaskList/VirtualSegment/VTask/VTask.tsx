import React, { ForwardedRef, forwardRef } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import * as Sc from './styled';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

export interface Props extends Segment {
  isTaskTemplate: boolean;
}

function VTask({ metadata, register, isTaskTemplate, ...record }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
      <Draggable draggableId={metadata.id} index={metadata.index} key={metadata.id}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Sc.VTask
            {...register}
            $subitem={metadata.level > 1}
            $template={isTaskTemplate}
            data-dupa={metadata.index}
          >
            <StandardTaskItem
              // @ts-ignore
              taskIdentifier={metadata.id}
              draggableProvided={provided}
              isDraggable={true}
              isDragging={snapshot.isDragging}
            />
          </Sc.VTask>
        )}
      </Draggable>
  );
}

export default forwardRef(VTask);