import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { Button, IconButton } from '@material-ui/core';
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
}) => {
  const addWorkflowOption = { name: 'Add Workflow', onClick: onAddWorkflow };
  const mergedColumnContextMenuOptions = addWorkflowOption
    ? [addWorkflowOption, ...columnContextMenuOptions]
    : columnContextMenuOptions;

  return (
    <BoardColumnHeaderContainer>
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
