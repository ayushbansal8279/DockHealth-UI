import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { Segment } from 'views/list-details/modules/Virtualized';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import { getSubtaskStylingLink } from 'components/task/StandardTaskItem/helpers';
import QuickAddSubtask from '@/app/components/task/StandardTaskItem/QuickAddSubtask';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import * as Sc from './styled';
import { useSelector } from 'react-redux';
import { taskLookupSelector } from '@/app/selectors/task-details-selectors';
import { TaskOrigin } from '@/app/helpers/task-helpers';
import {
  searchTermSelector,
  taskDetailsSortSelector,
} from '@/app/selectors/list-details-selectors';
import { megaFilterSelector } from '@/app/selectors/mega-filter-selectors';
import palette from '@/app/styles/palette';

export interface Props extends Segment {
  task: any;
  bgColor: boolean;
  isLastTaskOfGroup: boolean;
}

function VSubtask(
  { metadata, register, task, bgColor, isLastTaskOfGroup, ...record }: Props,
  // eslint-disable-next-line unicorn/prevent-abbreviations
  ref: ForwardedRef<HTMLDivElement>,
) {
  const isLast = () => {
    const xs = metadata.parent?.children ?? [];
    const i = xs.indexOf(metadata.id);
    if (i !== -1) {
      return xs.length - 1 === i;
    }
    return false;
  };

  const [subtaskQuickAddOpen, setSubtaskQuickAddOpen] = useState(false);

  const pulledTask = useSelector((state) => {
    // @ts-ignore
    return taskLookupSelector(state, origin, metadata.parent.id);
  });

  const parentTask = pulledTask;

  useEffect(() => {
    setSubtaskQuickAddOpen(parentTask?.subtaskQuickAddOpen);
  }, [parentTask]);

  // @ts-ignore
  const noOfSubtask = metadata.parent?.children.length - 1;

  const searchValue = useSelector(searchTermSelector);
  const megaFilter = useSelector(megaFilterSelector);
  const sort = useSelector(taskDetailsSortSelector);
  const { selectedFilters } = megaFilter || {};

  return (
    <Draggable
      draggableId={metadata.id}
      index={metadata.index}
      key={metadata.id}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <>
          <div
            style={{
              width: '100%',
              background: bgColor ? palette.aliceBlue : '',
              paddingBottom:
                isLastTaskOfGroup && !subtaskQuickAddOpen ? '20px' : '0px',
            }}
          >
            <Sc.VSubtask
              ref={ref}
              {...register}
              $subitem={metadata.level > 1}
              isWorkflowSubtask={!!task}
              searchValue={!!searchValue}
              isFilterApply={
                !!selectedFilters
                  ? Object.keys(selectedFilters).length > 0
                  : !!selectedFilters
              }
              isSortApplied={!!sort.key}
              bgColor={bgColor}
            >
              {!!searchValue ||
                (!!selectedFilters
                  ? Object.keys(selectedFilters).length > 0
                  : !!selectedFilters) ||
                !!sort.key ||
                getSubtaskStylingLink(isLast())}
              <StandardTaskItem
                // @ts-ignore
                taskIdentifier={metadata.id}
                draggableProvided={provided}
                isDraggable
                isDragging={snapshot.isDragging}
                isWorkflowSubtask={!!task}
                isSubtask
                origin={TaskOrigin.LIST}
                isNestedTask
                pageBackground={bgColor ? palette.aliceBlue : ''}
              />
            </Sc.VSubtask>
          </div>
          {metadata.sameLevelIndex === noOfSubtask && subtaskQuickAddOpen && (
            <div
              style={{
                width: '100%',
                background: bgColor ? palette.aliceBlue : '',
                paddingBottom: isLastTaskOfGroup ? '20px' : '0px',
              }}
            >
              <Sc.QuickAddContainer>
                <QuickAddSubtask
                  taskListIdentifier={parentTask.taskList.taskListIdentifier}
                  parentTaskIdentifier={parentTask.identifier}
                  // onFocus={handleQuickAddOnFocus}
                  // origin={TaskOrigin.LIST}
                />
              </Sc.QuickAddContainer>
            </div>
          )}
        </>
      )}
    </Draggable>
  );
}

export default forwardRef(VSubtask);
