import React, { useCallback, useRef, useState } from 'react';
import { Box, Popover } from '@mui/material';
import StatusSwitchIcon from 'img/status-switch-icon.svg';
import {
  BoxContainer,
  ButtonContainer,
  ButtonLabel,
  RotatableChevronButtonLabel,
  RotatableChevronButtonWrapper,
  SelectIcon,
  ViewTypeImg,
} from '../TaskStatusToolbarSelect/styled';
import RotatableChevron from '@/app/components/common/RotatableChevron/RotatableChevron';
import palette from '@/app/styles/palette';
import TaskViewFilterForm from './TaskViewFilterForm';
import { IDashboardTaskViewFilter } from '@/app/types/taskViewFilter';

interface Props {
  filter: IDashboardTaskViewFilter;
  onChange: (value: IDashboardTaskViewFilter) => void;
}

export default function HomeTaskViewFilter({ filter, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleButtonClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = (newFilter: IDashboardTaskViewFilter) => {
    if (newFilter.includeWorkflows !== filter.includeWorkflows) {
      onChange(newFilter);
    }
    handleClose();
  };

  return (
    <>
      <BoxContainer>
        <ButtonContainer
          ref={buttonRef}
          variant="text"
          onClick={handleButtonClick}
          size="large"
        >
          <SelectIcon>
            <ViewTypeImg src={StatusSwitchIcon} />
          </SelectIcon>
          <ButtonLabel variant="body1">Task View</ButtonLabel>
        </ButtonContainer>
        <Box display="flex" width="3px">
          <RotatableChevronButtonWrapper
            variant="text"
            onClick={handleButtonClick}
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
          <TaskViewFilterForm filter={filter} onSubmit={handleSubmit} />
        </Popover>
      )}
    </>
  );
}
