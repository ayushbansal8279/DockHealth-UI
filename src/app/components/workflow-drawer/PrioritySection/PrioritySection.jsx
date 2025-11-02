/* eslint-disable unicorn/consistent-function-scoping */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPriorityColor, TaskPriority } from 'helpers/task-helpers';
import {
  workflowSelector,
  workflowAutofocusFieldSelector,
} from 'selectors/workflow-drawer-selectors';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import { PriorityFieldContainer, Title, PriorityFlagContainer } from './styled';
import { Button, ListItemText, MenuItem, Select } from '@mui/material';
import PrioritySelectIcon from '@/app/img/PrioritySelectIcon';
import PriorityHigh from 'img/PriorityHigh';

const PrioritySection = ({ disabled }) => {
  const dispatch = useDispatch();
  const selectedWorkflow = useSelector(workflowSelector);
  const { priority } = selectedWorkflow || {};
  const inputReference = useRef(null);
  const autoFocusFieldName = useSelector(workflowAutofocusFieldSelector);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      inputReference.current &&
      autoFocusFieldName === WorkflowDrawerFieldNames.PRIORITY
    ) {
      inputReference.current.scrollIntoView(true);
      inputReference.current.focus();
    }
  }, [autoFocusFieldName]);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    dispatch(
      updatePartialWorkflow(selectedWorkflow?.identifier, {
        priority: value,
      }),
    );
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
      <Button
        size="small"
        variant="outlined"
        sx={{
          marginLeft: '5px',
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
        <PriorityFlagContainer IsPriority={priority === 'HIGH'}>
          {priority === 'HIGH' ? <PriorityHigh /> : <PrioritySelectIcon />}
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
              color: '#8492A4',
            }}
            size="small"
            variant="outlined"
            open={open}
            onChange={handleOptionChange}
            value={priority || ''}
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
                  {/* {option.color && <ColorIndicator color={option.color} />} */}
                  {OptionIcon || null}
                  <ListItemText>{option.label}</ListItemText>
                </MenuItem>
              );
            })}
          </Select>
        </PriorityFlagContainer>
      </Button>
    </PriorityFieldContainer>
  );
};

export default PrioritySection;
