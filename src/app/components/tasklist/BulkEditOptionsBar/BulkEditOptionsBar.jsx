import React, { useMemo } from 'react';
import palette from 'styles/palette';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import DuplicateIcon from 'img/bulk-edit/DuplicateIcon';
import CalendarIcon from 'img/bulk-edit/CalendarIcon';
import StatusIcon from 'img/bulk-edit/StatusIcon';
import CompleteIcon from 'img/bulk-edit/CompleteIcon';
import MoveIcon from 'img/bulk-edit/MoveIcon';
import DeleteIcon from 'img/bulk-edit/DeleteIcon';
import {
  IconButton,
  IconBox,
  CloseButton,
  CloseIcon,
  ButtonsWrapper,
  Container,
  TasksText,
  AssigneeIcon,
} from './styled';

const BulkEditOptionsBar = ({ selectedTasks = [], onClose }) => {
  const dispatch = useDispatch();

  const allTasksSameType = useMemo(() => {
    let allSameType = true;

    for (let i = 0; i < selectedTasks.length; i += 1) {
      if (i !== 0) {
        allSameType =
          !!selectedTasks[i].parentTaskIdentifier ===
          !!selectedTasks[i - 1].parentTaskIdentifier;

        if (!allSameType) {
          break;
        }
      }
    }

    return allSameType;
  }, [selectedTasks]);

  function handleMoveTasks() {
    // TODO: in confirm method need to move selectedTasks to selected destination
    dispatch(
      openModal('SelectTaskDestination', {
        tasksToMove: selectedTasks,
        confirmText: 'Move',
        confirm: selectedDestination => {
          console.log('selectedDestination', selectedDestination);
        },
      }),
    );
  }

  return (
    <Container open={selectedTasks?.length > 0}>
      <TasksText>
        {`${selectedTasks.length} Task${
          selectedTasks.length > 1 ? 's' : ''
        } Selected`}
      </TasksText>
      <ButtonsWrapper>
        <IconButton type="button" onClick={() => {}}>
          <IconBox>
            <DuplicateIcon />
          </IconBox>
          <p>Duplicate</p>
        </IconButton>
        <IconButton
          type="button"
          disabled={!allTasksSameType}
          onClick={handleMoveTasks}
        >
          <IconBox>
            <MoveIcon />
          </IconBox>
          <p>Move</p>
        </IconButton>
        <IconButton type="button" onClick={() => {}}>
          <IconBox>
            <CompleteIcon />
          </IconBox>
          <p>Complete</p>
        </IconButton>
        <IconButton type="button" onClick={() => {}}>
          <IconBox>
            <StatusIcon />
          </IconBox>
          <p>Status</p>
        </IconButton>
        <IconButton type="button" onClick={() => {}}>
          <IconBox>
            <CalendarIcon />
          </IconBox>
          <p>Date</p>
        </IconButton>
        <IconButton type="button" onClick={() => {}}>
          <IconBox>
            <AssigneeIcon />
          </IconBox>
          <p>Assignee</p>
        </IconButton>
        <IconButton type="button" color={palette.oPlusRed} onClick={() => {}}>
          <IconBox>
            <DeleteIcon />
          </IconBox>
          <p>Delete</p>
        </IconButton>
        <CloseButton type="button" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </ButtonsWrapper>
    </Container>
  );
};

export default BulkEditOptionsBar;
