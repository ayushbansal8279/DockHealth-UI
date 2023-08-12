import React, { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { matchSorter } from 'match-sorter';
import { getAllTemplateNames } from 'api/template-api';
import styled from 'styled-components';
import Input from '../Input/Input';

const filterOptions = (options, { inputValue }) =>
  matchSorter(options, inputValue, { keys: ['label', 'value'] });

const StandardAutocompleteMUI = styled(Autocomplete)`
  &&& {
    &.MuiAutocomplete-options {
      padding: 0;
    }
    &.MuiAutocomplete-listbox {
      padding: 0;
    }
    &.MuiAutocomplete-noOptions {
      padding: 0;
    }
  }
`;

const TemplateAutoComplete = ({
  type,
  onChange,
  onBlur,
  placeholder,
  error,
  errorMessage,
  ...restProps
}) => {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const dataLoaded = useRef(false);

  const loading = open && !dataLoaded.current;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return;
    }

    getAllTemplateNames(type).then((data) => {
      if (active) {
        setTemplates(
          data
            .filter((t) => t.type === type)
            .map((t) => ({
              label: t.name,
              value: t.shortMessage,
              body: t.details,
              identifier: t.identifier,
            })),
        );
      }
      dataLoaded.current = true;
    });

    return () => {
      active = false;
      dataLoaded.current = false;
    };
  }, [loading, type]);

  React.useEffect(() => {
    if (!open) {
      setTemplates([]);
    }
  }, [open]);

  return (
    <StandardAutocompleteMUI
      filterOptions={filterOptions}
      id="autocomplete-template"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      loadingText="Getting templates"
      noOptionsText="No templates provided"
      onBlur={onBlur}
      onChange={onChange}
      getOptionSelected={(option, value) =>
        option.identifier === value.identifier
      }
      getOptionLabel={(option) => option.label}
      options={templates}
      loading={loading}
      handleHomeEndKeys
      openOnFocus
      renderInput={(parameters) => {
        return (
          <Input
            {...parameters}
            helperText={error ? errorMessage : null}
            error={error}
            placeholder={placeholder}
            shrink
            InputProps={{
              ...parameters.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {parameters.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );
      }}
      {...restProps}
    />
  );
};

export default TemplateAutoComplete;
