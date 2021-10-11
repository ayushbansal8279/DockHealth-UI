import React, { useEffect, useState } from 'react';
import { Box, Collapse } from '@material-ui/core';
import { useBoolean } from 'hooks/useBoolean';
import usePrevious from 'hooks/use-previous';
import { onSlimViewChanged } from 'helpers/ga-event-helper';
import { TaskGroupType } from 'helpers/task-helpers';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import ViewTypeSwitch, {
  ViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import {
  Container,
  GroupHeader,
  GroupTitle,
  GroupName,
  GroupCount,
} from './styled';

const TaskListGroupCollapse = props => {
  const { children, group, count } = props;
  // TODO: remove or when group will be added
  const { 0: open, 3: toggleOpen } = useBoolean(true);
  const [viewType, setViewType] = useState(ViewType.SLIM_VIEW);

  const isFullView = viewType === ViewType.FULL_VIEW;

  const previousViewType = usePrevious(viewType);

  useEffect(() => {
    if (previousViewType) {
      onSlimViewChanged(viewType === ViewType.SLIM_VIEW);
    }
  }, [previousViewType, viewType]);

  return (
    <Container>
      <GroupHeader>
        <Box
          display="flex"
          flex={1}
          alignItems="center"
          overflow="hidden"
          onClick={toggleOpen}
        >
          <RotatableChevron rotated={open} />
          <Box p={1} />
          <GroupTitle>
            <GroupName>
              <span>
                {group?.groupType === TaskGroupType.TASKLIST_DEFAULT
                  ? 'New tasks'
                  : group?.groupName}
              </span>
            </GroupName>
            {count && <GroupCount>({count})</GroupCount>}
          </GroupTitle>
        </Box>
        {open && <ViewTypeSwitch value={viewType} onChange={setViewType} />}
      </GroupHeader>
      <Collapse timeout={150} in={open}>
        <Box p={0.5} />
        {children({ isFullView })}
      </Collapse>
    </Container>
  );
};

export default TaskListGroupCollapse;
