import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Autocomplete, Chip, Checkbox } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';
import { getAllContacts } from 'api/contacts-api';
import { matchSorter } from 'match-sorter';
import { CommunicationType } from 'helpers/task-helpers';
// import Checkbox from 'components/common/Checkbox/Checkbox';
import Input from '../Input/Input';
import {
  RenderOptionStyled,
  NoOptionContainer,
  NoOptionTextLabel,
  RenderLabelStyled,
} from './styled';

const filterOptions = (options, { inputValue }) =>
  matchSorter(options, inputValue, { keys: ['label', 'value'] });

const StandardAutocompleteMUI = styled(Autocomplete)`
  &&& {
    &.MuiAutocomplete-option {
      padding: 0;
    }
    &.MuiAutocomplete-listbox {
      padding: 0;
    }
    &.MuiAutocomplete-noOption {
      padding: 0;
    }
  }
`;

const EmailContactsAutoComplete = ({
  type,
  onChange,
  onBlur,
  placeholder,
  error,
  errorMessage,
  patient,
  setShow,
  setNewContact,
  multiple = true,
  value,
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
      return;
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
          case CommunicationType.EMAIL: {
            setContacts(
              response
                ?.filter((contact) => contact.email)
                .map((contact) => ({
                  label: contact.name,
                  value: contact.email,
                  identifier: contact.identifier,
                })),
            );
            break;
          }
          case CommunicationType.FAX: {
            setContacts(
              response
                ?.filter((contact) => contact.faxPhoneNumber)
                .map((contact) => ({
                  label: contact.name,
                  value: contact.faxPhoneNumber,
                  identifier: contact.identifier,
                })),
            );
            break;
          }
          case CommunicationType.SMS: {
            setContacts(
              response
                ?.filter((contact) => contact.mobilePhoneNumber)
                .map((contact) => ({
                  label: contact.name,
                  value: contact.mobilePhoneNumber,
                  identifier: contact.identifier,
                })),
            );
            break;
          }
          default: {
            setContacts([]);
          }
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
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        <NoOptionContainer
          onClick={(event) => {
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
              No results - Click to create new contact:{' '}
              <NoOptionTextLabel>{inputState}</NoOptionTextLabel>
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
      value={value}
      isOptionEqualToValue={(option, value) => option.identifier === value.identifier}
      onChange={onChange}
      onInputChange={(event, value) => {
        setInputState(value);
      }}
      inputValue={inputState}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      getOptionSelected={(option, value) => option.value === value.value}
      getOptionLabel={(option) => `${option.label} - ${option.value}` ?? option}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderOption={(parameters, option, { selected }) => {
        return (
        <RenderOptionStyled {...parameters} key={option.identifier}>
         { multiple && (<Checkbox
            checked={selected}
          />)}
          <RenderLabelStyled>
            {option.label}
            <span>({option.value})</span>
          </RenderLabelStyled>
        </RenderOptionStyled>
      )}}
      options={contacts}
      loading={loading}
      renderTags={renderTagsCallback}
      handleHomeEndKeys
      noOptionsText={noOptionText}
      openOnFocus
      InputProps={{
        onKeyDown: (event) => {
          if (event.key === 'Enter' && event?.target.value !== '') {
            event.stopPropagation();
            event.preventDefault();
            // eslint-disable-next-line no-unused-expressions
            event?.target?.blur();
          }
        },
      }}
      renderInput={(parameters) => {
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

// import * as React from 'react';
// import Checkbox from '@mui/material/Checkbox';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import { getAllContacts } from 'api/contacts-api';

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// const EmailContactsAutoComplete = ({
//   type,
//   onChange,
//   onBlur,
//   placeholder,
//   error,
//   errorMessage,
//   patient,
//   setShow,
//   setNewContact,
//   multiple = true,
//   ...restProps
// }) => {
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState([]);
//   const dataLoaded = React.useRef(false);
//   const [contacts, setContacts] = React.useState([]);
  
//   const loading = open && contacts.length === 0;

//   React.useEffect(() => {
//       let active = true;
//       if (!loading) {
//         return;
//       }
      
//       (async () => {
//         const response = await getAllContacts();
//         response.push({
//           name: `(Patient) ${patient?.firstName} ${patient?.lastName}`,
//           email: patient?.email,
//           mobilePhoneNumber: patient?.phoneMobile?.replace('+1', ''),
//           identifier: patient?.patientIdentifier,
//         });
//         if (active) {
//           switch (type) {
//             case CommunicationType.EMAIL: {
//               setContacts(
//                 response
//                   ?.filter((contact) => contact.email)
//                   .map((contact) => ({
//                     label: contact.name,
//                     value: contact.email,
//                     identifier: contact.identifier,
//                   })),
//               );
//               break;
//             }
//             case CommunicationType.FAX: {
//               setContacts(
//                 response
//                   ?.filter((contact) => contact.faxPhoneNumber)
//                   .map((contact) => ({
//                     label: contact.name,
//                     value: contact.faxPhoneNumber,
//                     identifier: contact.identifier,
//                   })),
//               );
//               break;
//             }
//             case CommunicationType.SMS: {
//               setContacts(
//                 response
//                   ?.filter((contact) => contact.mobilePhoneNumber)
//                   .map((contact) => ({
//                     label: contact.name,
//                     value: contact.mobilePhoneNumber,
//                     identifier: contact.identifier,
//                   })),
//               );
//               break;
//             }
//             default: {
//               setContacts([]);
//             }
//           }
//         }
//       })();
//       dataLoaded.current = true;
  
//       return () => {
//         active = false;
//         dataLoaded.current = false;
//       };
//     }, [loading, patient, type]);

//     React.useEffect(() => {
//       if (!open) {
//         setContacts([]);
//       }
//     }, [open]);

//   return (
//     <Autocomplete
//       multiple
//       id="checkboxes-tags-demo"
//       options={contacts}
//       value={value}
//       onChange={(event, newValue) => {setValue(newValue)}}
//       isOptionEqualToValue={(option, value) => option.identifier === value.identifier}
//       disableCloseOnSelect
//       getOptionLabel={(option) => option.title}
//       onOpen={() =>  {setOpen(true)}}
//       onClose={() => {setOpen(false)}}
//       loading={loading}
//       renderOption={(props, option, { selected }) => (
//         <li {...props}>
//           <Checkbox
//             icon={icon}
//             checkedIcon={checkedIcon}
//             style={{ marginRight: 8 }}
//             checked={selected}
//           />
//           {option.title}
//         </li>
//       )}
//       style={{ width: 500 }}
//       renderInput={(params) => (
//         <TextField {...params} label="Checkboxes" placeholder="Favorites" />
//       )}
//     />
//   );
// }

// export default EmailContactsAutoComplete;

// // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
// const top100Films = [
//   { title: 'The Shawshank Redemption', year: 1994 },
//   { title: 'The Godfather', year: 1972 },
//   { title: 'The Godfather: Part II', year: 1974 },
//   { title: 'The Dark Knight', year: 2008 },
//   { title: '12 Angry Men', year: 1957 },
//   { title: "Schindler's List", year: 1993 },
//   { title: 'Pulp Fiction', year: 1994 },
//   {
//     title: 'The Lord of the Rings: The Return of the King',
//     year: 2003,
//   },
//   { title: 'The Good, the Bad and the Ugly', year: 1966 },
//   { title: 'Fight Club', year: 1999 },
//   {
//     title: 'The Lord of the Rings: The Fellowship of the Ring',
//     year: 2001,
//   },
//   {
//     title: 'Star Wars: Episode V - The Empire Strikes Back',
//     year: 1980,
//   },
//   { title: 'Forrest Gump', year: 1994 },
//   { title: 'Inception', year: 2010 },
//   {
//     title: 'The Lord of the Rings: The Two Towers',
//     year: 2002,
//   },
//   { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
//   { title: 'Goodfellas', year: 1990 },
//   { title: 'The Matrix', year: 1999 },
//   { title: 'Seven Samurai', year: 1954 },
//   {
//     title: 'Star Wars: Episode IV - A New Hope',
//     year: 1977,
//   },
//   { title: 'City of God', year: 2002 },
//   { title: 'Se7en', year: 1995 },
//   { title: 'The Silence of the Lambs', year: 1991 },
//   { title: "It's a Wonderful Life", year: 1946 },
//   { title: 'Life Is Beautiful', year: 1997 },
//   { title: 'The Usual Suspects', year: 1995 },
//   { title: 'Léon: The Professional', year: 1994 },
//   { title: 'Spirited Away', year: 2001 },
//   { title: 'Saving Private Ryan', year: 1998 },
//   { title: 'Once Upon a Time in the West', year: 1968 },
//   { title: 'American History X', year: 1998 },
//   { title: 'Interstellar', year: 2014 },
// ];

// export default EmailContactsAutoComplete;