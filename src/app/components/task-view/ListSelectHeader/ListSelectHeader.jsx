import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import { RotatableHeaderChevron } from 'components/common/RotatableChevron/RotatableChevron';
import GenericHeader from 'components/common/GenericHeader';
import ListPopover from 'components/common/ListPopover';
import Spacing from 'components/common/Spacing';
import { HeaderTitleContainer, StyledTitle, TitleContainer } from './styled';

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

const ListSelectHeader = ({ hasTitle, title, isFetching, taskList }) => {
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

export default ListSelectHeader;
