import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TaskStatus, TaskStatusLabel } from 'helpers/task-helpers';
import { Box, Popover } from '@mui/material';
import StatusSwitchIcon from 'img/status-switch-icon.svg';
import {
  ViewTypeImg,
  SelectWrapper,
  SelectIcon,
  ButtonContainer,
  ButtonLabel,
  RotatableChevronButtonWrapper,
  BoxContainer,
  RotatableChevronButtonLabel,
} from './styled';
import RotatableChevron from '@/app/components/common/RotatableChevron/RotatableChevron';
import palette from '@/app/styles/palette';
import TaskStatusSelectForm from './TaskStatusSelectForm';

interface Props {
  value: string;
  onChange: (newStatus: string) => void;
  iconColorFilterActive: string;
  taskListIdentifier: string;
  origin: string;
}

export default function TaskStatusToolbarSelect({
  value,
  onChange,
  iconColorFilterActive,
  taskListIdentifier,
  origin,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(TaskStatus.INCOMPLETE);

  useEffect(() => {
    if (value !== null) {
      setStatus(value);
    } else {
      setStatus(TaskStatus.INCOMPLETE);
    }
  }, [taskListIdentifier, value]);

  const buttonRef = useRef(null);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = (status: string) => {
    setStatus(status);
    onChange(status);
    handleClose();
  };

  return (
    <SelectWrapper>
      <BoxContainer>
        <ButtonContainer
          ref={buttonRef}
          variant="text"
          onClick={handleOpen}
          size="large"
        >
          <SelectIcon>
            <ViewTypeImg
              src={StatusSwitchIcon}
              alt="view type icon"
              iconColorFilterActive={iconColorFilterActive}
            />
          </SelectIcon>
          <ButtonLabel variant="body1">{TaskStatusLabel[value]}</ButtonLabel>
        </ButtonContainer>
        <Box display="flex" width="3px">
          <RotatableChevronButtonWrapper
            variant="text"
            onClick={handleOpen}
            size="large"
          >
            <RotatableChevronButtonLabel variant="body1">
              <RotatableChevron rotated={isOpen} color={palette.white} />
            </RotatableChevronButtonLabel>
          </RotatableChevronButtonWrapper>
        </Box>
      </BoxContainer>
      {isOpen && (
        <Popover
          anchorEl={buttonRef?.current}
          open={isOpen}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <TaskStatusSelectForm
            taskListIdentifier={taskListIdentifier}
            defaultValue={status}
            onSubmit={handleSubmit}
            origin={origin}
          />
        </Popover>
      )}
    </SelectWrapper>
  );
}
