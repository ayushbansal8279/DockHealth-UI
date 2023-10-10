import React, { ForwardedRef, forwardRef } from "react"
import { Segment } from "../../Virtualized/types"
import * as Sc from "./styled"
import TasksGroup from "components/tasklist/TasksGroup/TasksGroup";


export interface Props extends Segment {
  name: string
  count: number
}

function Group({ name, count, metadata, register }: Props, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Sc.Group
      ref={ref}
      {...register}
    >
      <TasksGroup groupName={name}>{() => null}</TasksGroup>
    </Sc.Group>
  )
}


export default forwardRef(Group)