import { Grid, Typography } from '@material-ui/core';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import styled from 'styled-components';
import useBoolean from '../../hooks/useBoolean';
import GenericHeader from '../common/GenericHeader';
import ListPopover from '../common/ListPopover';
import RotatableChevron from '../common/RotatableChevron';
import Spacing from '../common/Spacing';

const StyledTitle = styled(Typography)`
  && {
    cursor: pointer;
    filter: brightness(1);
    font-size: 36px;
    line-height: 49px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: filter 0.25s ease-out;
    white-space: nowrap;

    &:hover {
      filter: brightness(1.25);
    }
  }
`;

const HeaderTitleContainer = styled.div`
  flex: 0.35;
  overflow: hidden;
`;

const transformTaskList = ({ closeListPopover, taskList }) => ({
  listName,
  taskListIdentifier,
}) => ({
  active: taskListIdentifier === taskList?.taskListIdentifier,
  key: taskListIdentifier,
  label: listName,
  onClick: () => {
    closeListPopover();
    hashHistory.push(`/tasks/${taskListIdentifier}`);
  },
});

const Header = ({ hasTitle, title, isFetching, taskList }) => {
  const taskListIdentifier = taskList?.taskListIdentifier;

  const listPopoverReference = useRef(null);

  const [isListPopoverOpen, openListPopover, closeListPopover] = useBoolean(
    false,
  );

  const taskLists = useSelector(store => store.taskListState.tasklist ?? []);

  const listPopoverItems = [
    ...taskLists.map(transformTaskList({ closeListPopover, taskList })),
    {
      key: 'inbox',
      active: !taskListIdentifier,
      label: 'Inbox',
      onClick: () => {
        closeListPopover();
        hashHistory.push(`/tasks/Inbox`);
      },
    },
  ];

  return (
    <GenericHeader isFetching={isFetching || !hasTitle}>
      <HeaderTitleContainer ref={listPopoverReference}>
        <StyledTitle onClick={openListPopover} variant="h5" component="div">
          <Grid container alignItems="center">
            <div>{title}</div>
            <Spacing horizontal={3} />
            <RotatableChevron rotated={isListPopoverOpen} />
          </Grid>
        </StyledTitle>
      </HeaderTitleContainer>
      <ListPopover
        anchorEl={listPopoverReference.current}
        open={isListPopoverOpen}
        onClose={closeListPopover}
        items={listPopoverItems}
      />
    </GenericHeader>
  );
};

export default Header;
