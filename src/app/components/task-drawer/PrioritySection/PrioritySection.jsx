import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PriorityFlag from 'img/priority-flag';
import { changeTaskPriority } from 'actions/task-actions';
import { onTaskDrawerTaskPriorityChanged } from 'helpers/ga-event-helper';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import { PriorityFieldContainer, PriorityFlagContainer, Title } from './styled';
import PrioritySelectIcon from 'img/PrioritySelectIcon';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import Spacing from 'components/common/Spacing';
import { ColorIndicator } from '../../common/Select/styled';

const PrioritySection = ({ selectedTask, disabled = false }) => {
  const dispatch = useDispatch();
  const { priority } = selectedTask || {};
  const [open, setOpen] = React.useState(false);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    console.log(value);

    onTaskDrawerTaskPriorityChanged(value);
    dispatch(changeTaskPriority(selectedTask, value));
  };

  const PRIORITY_OPTIONS = [
    {
      value: TaskPriority.LOW,
      label: 'No Priority',
      tag: '--',
    },
    {
      value: TaskPriority.HIGH,
      label: 'High',
      tag: 'High',
    },
  ];

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
          marginLeft: '12px',
          height: '40px',
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <PrioritySelectIcon />
        <Select
          sx={{
            textTransform:'none',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            color:'#8492A4'
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
          open={open}
          value={priority}
          onChange={handleOptionChange}
          disabled={disabled}
          renderValue={(selectedValue) =>
            PRIORITY_OPTIONS.find((option) => option.value === selectedValue)
              ?.tag
          }
        >
          {PRIORITY_OPTIONS?.map((option) => {
            const { OptionIcon } = option;
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.color && <ColorIndicator color={option.color} />}
                {OptionIcon || null}
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            );
          })}
        </Select>
      </Button>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
