import React, { ForwardedRef, forwardRef } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import * as Sc from './styled';

export interface Props extends Segment {
  text: string;
  definition: any;
}

function VSubtask({ metadata, register, definition, ...record }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Sc.VSubtask
      ref={ref}
      {...register}
      $subitem={metadata.level > 1}
    >
      {/* @ts-ignore */}
      <StandardTaskItem taskIdentifier={metadata.id}/>
    </Sc.VSubtask>
  );
}

export default forwardRef(VSubtask);