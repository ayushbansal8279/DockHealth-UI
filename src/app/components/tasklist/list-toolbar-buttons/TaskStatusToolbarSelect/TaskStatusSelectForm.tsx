import React, { ChangeEvent, FormEvent, useState } from 'react';
import Button from 'components/common/v2/Button/Button';
import {
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material';
import { TaskStatus, TaskStatusLabel } from '@/app/helpers/task-helpers';
import {
  TaskStatusFormData,
  convertTaskStatusFormDataToStatus,
} from './helpers';
import Spacing from '@/app/components/common/Spacing';
import { updateListPreferences } from '@/app/actions/task-list-actions';
import { useDispatch } from 'react-redux';
import { WorkflowLabel } from './styled';
import localStorageHelper from '@/app/helpers/local-storage-helper';

const options = [
  {
    name: 'incomplete',
    label: TaskStatusLabel[TaskStatus.INCOMPLETE],
  },
  {
    name: 'complete',
    label: TaskStatusLabel[TaskStatus.COMPLETE],
  },
] as const;

const workflowOption = {
  name: 'CompletedWorkflowTasks',
  label: 'Completed workflow tasks',
  setup: { displayOptions: ['SHOW_WORKFLOW_COMPLETED_TASKS'] },
  setupBlank: { displayOptions: [] },
} as const;

interface Props {
  defaultValue: string;
  taskListIdentifier: string;
  onSubmit: (newStatus: string) => void;
}

export default function TaskStatusSelectForm({
  defaultValue,
  onSubmit,
  taskListIdentifier,
}: Props) {
  const [formData, setFormData] = useState<TaskStatusFormData>({
    incomplete: [TaskStatus.INCOMPLETE, TaskStatus.ALL].includes(defaultValue),
    complete: [TaskStatus.COMPLETE, TaskStatus.ALL].includes(defaultValue),
  });

  const storageKey = `workflowStatus${taskListIdentifier}`;
  const storedWorkflowStatus = localStorageHelper.getItem(storageKey);
  const dispatch = useDispatch();
  const [completedWorkflowTasks, setCompletedWorkflowTask] = useState(storedWorkflowStatus || false);

  const applyDisabled = !formData.incomplete && !formData.complete;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleWorflowChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setCompletedWorkflowTask(checked);
    checked
      ? localStorageHelper.setItem(storageKey, true)
      : localStorageHelper.removeItem(storageKey);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(convertTaskStatusFormDataToStatus(formData));

    dispatch(
      updateListPreferences(
        completedWorkflowTasks
          ? workflowOption.setup
          : workflowOption.setupBlank,
        taskListIdentifier,
      ),
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 2 }}>
        <FormGroup>
          {options.map((option) => (
            <FormControlLabel
              key={option.name}
              control={
                <Switch
                  name={option.name}
                  checked={formData[option.name]}
                  onChange={handleChange}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
        <Divider sx={{ my: 1 }} />
        <WorkflowLabel>Workflows</WorkflowLabel>
        <Spacing vertical={3} />
        <FormGroup>
          <FormControlLabel
            key={workflowOption.name}
            control={
              <Switch
                name={workflowOption.name}
                checked={completedWorkflowTasks}
                onChange={handleWorflowChange}
              />
            }
            label={workflowOption.label}
          />
        </FormGroup>
        <Spacing vertical={3} />
        <Divider sx={{ my: 1 }} />
        <Button type="submit" variant="primary-red" disabled={applyDisabled}>
          Apply
        </Button>
      </Box>
    </form>
  );
}
