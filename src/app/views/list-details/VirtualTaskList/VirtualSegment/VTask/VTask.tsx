import React, { ForwardedRef, forwardRef, useContext } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import * as Sc from './styled';
import { TaskOrigin } from '@/app/helpers/task-helpers';

export interface Props extends Segment {
  isTaskTemplate: boolean;
  isLastChild: boolean;
}

function VTask(
  { metadata, register, isTaskTemplate, isLastChild, ...record }: Props,
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
      )}
    </Draggable>
  );
}

export default forwardRef(VTask);
