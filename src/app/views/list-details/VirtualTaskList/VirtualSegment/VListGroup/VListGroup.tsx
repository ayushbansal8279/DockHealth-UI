import React, { ForwardedRef, forwardRef } from 'react'
import { Segment } from 'views/list-details/modules/Virtualized';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import * as Sc from './styled';

export interface Props extends Segment {
  name: string;
  count: number;
}

function VListGroup({ name, count, metadata, register }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Sc.VListGroup
      ref={ref}
      {...register}
    >
      {/* @ts-ignore */}
      <TasksGroup groupName={name}>{() => null}</TasksGroup>
    </Sc.VListGroup>
  );
}

export default forwardRef(VListGroup);