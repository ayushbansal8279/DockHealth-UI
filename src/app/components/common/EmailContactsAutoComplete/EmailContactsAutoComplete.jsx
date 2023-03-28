import React, { useEffect, useRef, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { getAllContacts } from 'api/contacts-api';
import { matchSorter } from 'match-sorter';
import { CommunicationType } from 'helpers/task-helpers';
import { Chip } from '@material-ui/core';
import Input from '../Input/Input';
import {
  RenderOptionStyled,
  NoOptionContainer,
  NoOptionTextLabel,
} from './styled';

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

const EmailContactsAutoComplete = ({
  type,
  onChange,
  onBlur,
  placeholder,
  error,
  errorMessage,
  setShow,
  setNewContact,
  ...restProps
}) => {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState([]);

  const dataLoaded = useRef(false);

  const [inputState, setInputState] = useState();

  const loading = open && !dataLoaded.current;
  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      const response = await getAllContacts();
      if (active) {
        switch (type) {
          case CommunicationType.EMAIL:
            setContacts(
              response
                ?.filter(contact => contact.email)
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
                ?.filter(contact => contact.faxPhoneNumber)
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
                ?.filter(contact => contact.mobilePhoneNumber)
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
  }, [loading, type]);

  React.useEffect(() => {
    if (!open) {
      setContacts([]);
    }
  }, [open]);

  const renderTagsCallback = React.useCallback(
    (tagValue, getTagProps) =>
      tagValue.map((option, index) => (
        <Chip
          key={tagValue.labelIdentifier}
          {...getTagProps({ index })}
          // onDelete={() => {
          //   setSelectedContacts(state =>
          //     state.filter(label => label.identifier !== option.identifier),
          //   );
          //   // removeLabelFromTask(option);
          // }}
          label={option.label}
        />
      )),
    [],
  );

  const noOptionText = React.useMemo(
    () => (
      <div
        onMouseDown={event => {
          event.preventDefault();
        }}
      >
        <NoOptionContainer
          onClick={event => {
            if (inputState) {
              event.stopPropagation();
              event.preventDefault();
              if (setShow) {
                setNewContact({ value: inputState });
                setShow(true);
              }
            }
          }}
        >
          {inputState ? (
            <>
              No results - Create{' '}
              <NoOptionTextLabel>{inputState}</NoOptionTextLabel> label
            </>
          ) : (
            <>No results</>
          )}
        </NoOptionContainer>
      </div>
    ),
    [inputState, setNewContact, setShow],
  );

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
      onInputChange={(event, value) => {
        setInputState(value);
      }}
      multiple
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
      renderTags={renderTagsCallback}
      handleHomeEndKeys
      noOptionsText={noOptionText}
      openOnFocus
      InputProps={{
        onKeyDown: event => {
          if (event.key === 'Enter' && event?.target.value !== '') {
            event.stopPropagation();
            event.preventDefault();
            // eslint-disable-next-line no-unused-expressions
            event?.target?.blur();
          }
        },
      }}
      renderInput={parameters => {
        return (
          <Input
            {...parameters}
            helperText={error ? errorMessage : null}
            error={error}
            placeholder={placeholder}
            shrink
            value={undefined}
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

export default EmailContactsAutoComplete;
