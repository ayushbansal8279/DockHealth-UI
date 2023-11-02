import React, { ForwardedRef, forwardRef } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import * as Sc from './styled';

export interface Props extends Segment {
  isTaskTemplate: boolean;
}

function VTask({ metadata, register, isTaskTemplate, ...record }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Sc.VTask
      ref={ref}
      {...register}
      $subitem={metadata.level > 1}
      $template={isTaskTemplate}
    >
      {/* @ts-ignore */}
      <StandardTaskItem taskIdentifier={metadata.id}/>
    </Sc.VTask>
  );
}

export default forwardRef(VTask);