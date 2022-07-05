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
}) => {
  return (
    <BoardColumnHeaderContainer>
      <ColumnName>{`${name} (${tasksLength})`}</ColumnName>
      <ActionsContainer>
        <Button>
          <PlusIcon>+</PlusIcon>
        </Button>
        {columnContextMenuOptions?.length && (
          <OptionsMenu
            options={columnContextMenuOptions}
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
