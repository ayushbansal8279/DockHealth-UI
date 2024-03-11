import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'components/common/Select/Select';
import PriorityFlag from 'img/priority-flag';
import { changeTaskPriority } from 'actions/task-actions';
import { onTaskDrawerTaskPriorityChanged } from 'helpers/ga-event-helper';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import { PriorityFieldContainer, PriorityFlagContainer, Title } from './styled';
import { PRIORITY_OPTIONS } from './helpers';
import PrioritySelectIcon from 'img/PrioritySelectIcon';
import { Button, IconButton, InputAdornment } from '@mui/material';
import Spacing from 'components/common/Spacing';

const PrioritySection = ({ selectedTask, disabled = false }) => {
  const dispatch = useDispatch();
  const { priority } = selectedTask || {};
  const [open, setOpen] = React.useState(false);

  const handleOptionChange = (event) => {
    const { value } = event.target;

    onTaskDrawerTaskPriorityChanged(value);
    dispatch(changeTaskPriority(selectedTask, value));
  };

  return (
    <PriorityFieldContainer>
      <Title>Priority</Title>
      {/* Required for future Changes */}
      {/* <PriorityFlagContainer>
        <PriorityFlag color={getPriorityColor(priority)} />
      </PriorityFlagContainer> */}

      <Button
        size="small"
        variant="outlined"
        sx={{
          marginLeft:'15px',
          height: '40px',
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: 'black',
          },
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <PrioritySelectIcon />
        <Select
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            marginLeft: '2px',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton aria-label="search">
                  <PrioritySelectIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
          variant="outlined"
          // label="Priority"
          // name="priority"
          open={open}
          value={priority}
          onChange={handleOptionChange}
          options={PRIORITY_OPTIONS}
          disabled={disabled}
        ></Select>
      </Button>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
