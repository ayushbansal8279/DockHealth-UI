import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Button, IconButton } from '@mui/material';
import {
  BoardColumnHeaderContainer,
  ColumnName,
  ActionsContainer,
  PlusIcon,
} from './styled';

const BoardColumnHeader = ({
  name,
  tasksLength = 0,
  columnContextMenuOptions,
  onAddWorkflow,
  onAddTaskOption,
  isDragging,
}) => {
  const addWorkflowOption = { name: 'Add Workflow', onClick: onAddWorkflow };
  const mergedColumnContextMenuOptions = addWorkflowOption
    ? [addWorkflowOption, ...columnContextMenuOptions]
    : columnContextMenuOptions;

  return (
    <BoardColumnHeaderContainer isDragging={isDragging}>
      <ColumnName>{`${name} (${tasksLength})`}</ColumnName>
      <ActionsContainer>
        <Button onClick={onAddTaskOption}>
          <PlusIcon>+</PlusIcon>
        </Button>
        {mergedColumnContextMenuOptions?.length && (
          <OptionsMenu
            options={mergedColumnContextMenuOptions}
            customButtonComponent={IconButton}
          >
            <MoreVertIcon />
          </OptionsMenu>
        )}
      </ActionsContainer>
    </BoardColumnHeaderContainer>
  );
};

export default BoardColumnHeader;
