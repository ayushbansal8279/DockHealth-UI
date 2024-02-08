import React, { ForwardedRef, forwardRef, useContext } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import * as Sc from './styled';
import { ListPageContext } from 'views/list-details/ListDetailsView';

export interface Props extends Segment {
  isTaskTemplate: boolean;
  isLastChild: boolean;
}

function VTask(
  { metadata, register, isTaskTemplate, isLastChild, ...record }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-unused-vars
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { changeViewType } = useContext(ListPageContext);
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
          $template={isTaskTemplate}
        >
          <StandardTaskItem
            // @ts-ignore
            taskIdentifier={metadata.id}
            draggableProvided={provided}
            isDraggable
            isDragging={snapshot.isDragging}
            isTaskTemplate={isTaskTemplate}
            isLastChild={isLastChild || false}
            changeViewType={changeViewType}
          />
        </Sc.VTask>
      )}
    </Draggable>
  );
}

export default forwardRef(VTask);
