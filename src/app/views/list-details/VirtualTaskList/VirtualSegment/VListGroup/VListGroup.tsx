import React, { ForwardedRef, forwardRef, useCallback } from 'react'
import { Segment } from 'views/list-details/modules/Virtualized';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import * as Sc from './styled';
import { reorderTaskListGroups } from "actions/list-details-actions";
import { useDispatch } from "react-redux";

export interface Props extends Segment {
  name: string;
  count: number;
}

function VListGroup({ name, count, metadata, register }: Props, ref: ForwardedRef<HTMLDivElement>) {
  const dispatch = useDispatch();

  const moveGroup = useCallback(
    // @ts-ignore
    (index, direction) => {
      const factor = direction === 'up' ? -1 : 1;
      dispatch(reorderTaskListGroups(index, index + factor));
    },
    [dispatch],
  );

  return (
    <Sc.VListGroup
      ref={ref}
      {...register}
    >
      {/* @ts-ignore */}
      <TasksGroup
        groupName={name}
        moveGroupUp={() => moveGroup(metadata.sameLevelIndex, 'up')}
        moveGroupDown={() => moveGroup(metadata.sameLevelIndex, 'down')}
      >
        {() => null}
      </TasksGroup>
    </Sc.VListGroup>
  );
}

export default forwardRef(VListGroup);