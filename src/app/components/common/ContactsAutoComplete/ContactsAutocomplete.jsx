import React, { useEffect, useRef, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { getAllContacts } from 'api/contacts-api';
import { matchSorter } from 'match-sorter';
import { CommunicationType } from 'helpers/task-helpers';
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

const ContactsAutoComplete = ({
  type,
  onChange,
  onBlur,
  placeholder,
  error,
  errorMessage,
  patient,
  ...restProps
}) => {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  const dataLoaded = useRef(false);

  const loading = open && !dataLoaded.current;
  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      const response = await getAllContacts();
      response.push({
        name: `(Patient) ${patient?.firstName} ${patient?.lastName}`,
        email: patient?.email,
        mobilePhoneNumber: patient?.phoneMobile?.replace('+1', ''),
        identifier: patient?.patientIdentifier,
      });
      if (active) {
        switch (type) {
          case CommunicationType.EMAIL:
            setContacts(
              response
                .filter(contact => contact.email)
                .map(contact => ({
                  label: contact.name,
                  value: contact.email,
                  identifier: contact.identifier,
                })),
            );
            break;
          case CommunicationType.FAX:
            setContacts(
              response
                .filter(contact => contact.faxPhoneNumber)
                .map(contact => ({
                  label: contact.name,
                  value: contact.faxPhoneNumber,
                  identifier: contact.identifier,
                })),
            );
            break;
          case CommunicationType.SMS:
            setContacts(
              response
                .filter(contact => contact.mobilePhoneNumber)
                .map(contact => ({
                  label: contact.name,
                  value: contact.mobilePhoneNumber,
                  identifier: contact.identifier,
                })),
            );
            break;
          default:
            setContacts([]);
        }
      }
    })();
    dataLoaded.current = true;

    return () => {
      active = false;
      dataLoaded.current = false;
    };
  }, [loading, patient, type]);

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
      noOptionsText="No contacts provided"
      openOnFocus
      renderInput={parameters => {
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

export default ContactsAutoComplete;
