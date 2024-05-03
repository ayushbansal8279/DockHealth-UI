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

interface Props {
  defaultValue: string;
  onSubmit: (newStatus: string) => void;
}

export default function TaskStatusSelectForm({
  defaultValue,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<TaskStatusFormData>({
    incomplete: [TaskStatus.INCOMPLETE, TaskStatus.ALL].includes(defaultValue),
    complete: [TaskStatus.COMPLETE, TaskStatus.ALL].includes(defaultValue),
  });

  const applyDisabled = !formData.incomplete && !formData.complete;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(convertTaskStatusFormDataToStatus(formData));
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
        <Button type="submit" variant="primary-red" disabled={applyDisabled}>
          Apply
        </Button>
      </Box>
    </form>
  );
}
