import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material';
import Button from 'components/common/v2/Button/Button';
import {
  IDashboardTaskViewFilter,
  dashboardTaskViewFilterOptions,
} from '@/app/types/taskViewFilter';

interface Props {
  filter: IDashboardTaskViewFilter;
  onSubmit: (newValue: IDashboardTaskViewFilter) => void;
}

export default function TaskViewFilterForm({ filter, onSubmit }: Props) {
  const [formData, setFormData] = useState({ ...filter });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 2 }}>
        <FormGroup>
          {dashboardTaskViewFilterOptions.map((option) => (
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
        <Button type="submit" variant="primary-red">
          Apply
        </Button>
      </Box>
    </form>
  );
}
