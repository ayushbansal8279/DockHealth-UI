import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { getAllContacts } from 'api/contacts-api';
import { CloseIcon } from 'components/tour-wizard/Tour/styled';
import { matchSorter } from 'match-sorter';
import Input from '../Input/Input';
import { RenderOptionStyled } from './styled';

const filterOptions = (options, { inputValue }) =>
  matchSorter(options, inputValue, { keys: ['label', 'value'] });

const StandardAutocompleteMUI = withStyles({
  option: {
    padding: 0,
  },
  listbox: {
    padding: 0,
  },
  noOptions: {
    padding: 0,
  },
})(Autocomplete);

const ContactsAutocomplete = ({
  type,
  onChange,
  onBlur,
  placeholder,
  error,
  handleCloseIcon,
  ...restProps
}) => {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const loading = open && contacts.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const response = await getAllContacts();
      if (active) {
        setContacts(
          response.map(contact => ({
            label: contact.name,
            value: contact.email,
            identifier: contact.identifier,
          })),
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setContacts([]);
    }
  }, [open]);

  return (
    <StandardAutocompleteMUI
      filterOptions={filterOptions}
      id={`autocomplete-contact-${type}`}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      closeIcon={<CloseIcon onClick={handleCloseIcon} fontSize="small" />}
      loadingText="Getting contacts"
      onBlur={onBlur}
      onChange={onChange}
      getOptionSelected={(option, value) => option.value === value.value}
      getOptionLabel={option => option.value ?? option}
      renderOption={option => (
        <RenderOptionStyled>
          {option.label}
          <span>({option.value})</span>
        </RenderOptionStyled>
      )}
      options={contacts}
      loading={loading}
      freeSolo
      handleHomeEndKeys
      openOnFocus
      renderInput={parameters => {
        return (
          <Input
            {...parameters}
            label="Email"
            autoFocus
            helperText={error ? 'Incorrect email' : null}
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

export default ContactsAutocomplete;
