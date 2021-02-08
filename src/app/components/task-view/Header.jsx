import { Typography } from '@material-ui/core';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import { RotatableHeaderChevron } from 'components/common/RotatableChevron/RotatableChevron';
import GenericHeader from '../common/GenericHeader';
import ListPopover from '../common/ListPopover';
import Spacing from '../common/Spacing';

const StyledTitle = styled(Typography)`
  && {
    align-items: center;
    cursor: pointer;
    display: flex;
    filter: brightness(1);
    flex-flow: row nowrap;
    transition: filter 0.25s ease-out;

    &:hover {
      filter: brightness(1.25);
    }
  }
`;

const HeaderTitleContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const TitleContainer = styled.div`
  font-size: 1.5rem;
  max-width: 32rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const transformTaskList = ({ closeListPopover, taskList, history }) => ({
  listName,
  taskListIdentifier,
}) => ({
  active: taskListIdentifier === taskList?.taskListIdentifier,
  key: taskListIdentifier,
  label: listName,
  onClick: () => {
    closeListPopover();
    history.push(`/core/tasks/${taskListIdentifier}`);
  },
});

const Header = ({ hasTitle, title, isFetching, taskList }) => {
  const taskListIdentifier = taskList?.taskListIdentifier;

  const listPopoverReference = useRef(null);
  const history = useHistory();
  const [isListPopoverOpen, openListPopover, closeListPopover] = useBoolean(
    false,
  );

  const taskLists = useSelector(store => store.taskListState.tasklist ?? []);
  const pendingTaskLists = useSelector(
    store => store.invitationState.pendingTasklists ?? [],
  );

  const mergedTaskLists = [...taskLists, ...pendingTaskLists];

  const listPopoverItems = [
    ...mergedTaskLists.map(
      transformTaskList({ closeListPopover, taskList, history }),
    ),
    {
      key: 'inbox',
      active: !taskListIdentifier,
      label: 'Inbox',
      onClick: () => {
        closeListPopover();
        history.push(`/core/tasks/Inbox`);
      },
    },
  ];

  return (
    <GenericHeader isFetching={isFetching || !hasTitle} useTypography={false}>
      <HeaderTitleContainer>
        <StyledTitle onClick={openListPopover} variant="h6" component="div">
          <TitleContainer>{title}</TitleContainer>
          <Spacing horizontal={3} />
          <RotatableHeaderChevron
            rotated={isListPopoverOpen}
            color={palette.oPlusRed}
            ref={listPopoverReference}
          />
        </StyledTitle>
      </HeaderTitleContainer>
      <ListPopover
        anchorEl={listPopoverReference.current}
        open={isListPopoverOpen}
        onClose={closeListPopover}
        items={listPopoverItems}
        maxItems={10}
      />
    </GenericHeader>
  );
};

export default Header;
