import React, { ForwardedRef, forwardRef } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import { getSubtaskStylingLink } from "components/task/StandardTaskItem/helpers";
import * as Sc from './styled';

export interface Props extends Segment {
  task: any
}

function VSubtask({ metadata, register, task, ...record }: Props, ref: ForwardedRef<HTMLDivElement>) {
  const isLast = () => {
    const xs = metadata.parent?.children ?? []
    const i = xs.indexOf(metadata.id)
    if (i !== -1) {
      return xs.length - 1 === i
    }
    return false
  }
  return (
    <Sc.VSubtask
      ref={ref}
      {...register}
      $subitem={metadata.level > 1}
    >
      {getSubtaskStylingLink(isLast())}
      {/* @ts-ignore */}
      <StandardTaskItem taskIdentifier={metadata.id}/>
    </Sc.VSubtask>
  );
}

export default forwardRef(VSubtask);