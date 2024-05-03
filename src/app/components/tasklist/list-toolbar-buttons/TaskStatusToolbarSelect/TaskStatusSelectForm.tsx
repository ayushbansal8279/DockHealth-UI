import React, { ChangeEvent, FormEvent, useState } from 'react';
import Button from 'components/common/v2/Button/Button';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { TaskStatusSelectOptions } from '@/app/helpers/task-helpers';

interface Props {
  defaultValue: string;
  onSubmit: (newStatus: string) => void;
}

export default function TaskStatusSelectForm({
  defaultValue,
  onSubmit,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ p: 2 }}>
        <RadioGroup
          aria-labelledby="status-select"
          name="status-select"
          value={value}
          onChange={handleChange}
          sx={{ mb: 1 }}
        >
          {TaskStatusSelectOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        <Button type="submit" variant="primary-red">
          Apply
        </Button>
      </FormControl>
    </form>
  );
}
