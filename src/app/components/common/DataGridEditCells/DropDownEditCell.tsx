import React, { useCallback, useMemo } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { selectStyles } from './helpers';
import { PlaceholderText } from './styled';

interface DropDownEditCellProps
  extends GridRenderEditCellParams<any, string | undefined> {
  options: { name: string; identifier: string }[];
}

export default function DropDownEditCell({
  id,
  field,
  value,
  options,
  name,
}: DropDownEditCellProps) {
  const apiRef = useGridApiContext();

  const validOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.filter(
      (option) =>
        option &&
        typeof option.name === 'string' &&
        typeof option.identifier === 'string',
    );
  }, [options]);

  const selectedOption = useMemo(() => {
    if (!value || validOptions.length === 0) return null;
    return (
      validOptions.find((option) => option.identifier === value) ||
      validOptions.find((option) => option.name === value) ||
      null
    );
  }, [validOptions, value]);

  const safeValue = selectedOption?.identifier || '';

  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value;
      apiRef.current.setEditCellValue({
        id,
        field,
        value: newValue,
      });
    },
    [apiRef, id, field],
  );

  const renderValue = useCallback(
    (selected: string) => {
      if (!selected) {
        return <PlaceholderText>{name}</PlaceholderText>;
      }
      const option = validOptions.find((opt) => opt.identifier === selected);
      return option?.name || selected;
    },
    [validOptions, name],
  );

  if (validOptions.length === 0) {
    return (
      <Select
        displayEmpty
        fullWidth
        value=""
        disabled
        renderValue={() => (
          <PlaceholderText>No options available</PlaceholderText>
        )}
        sx={selectStyles}
      />
    );
  }

  return (
    <Select
      displayEmpty
      fullWidth
      value={safeValue || ''}
      onChange={handleChange}
      renderValue={renderValue}
      IconComponent={ArrowDropDownIcon}
      sx={selectStyles}
    >
      <MenuItem value="" disabled sx={{ color: 'gray' }}>
        {name}
      </MenuItem>
      {validOptions.map(({ name, identifier }) => (
        <MenuItem key={identifier} value={identifier}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
}
