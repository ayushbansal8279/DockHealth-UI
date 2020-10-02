import React, { useState, useRef } from 'react';
import Editor from 'draft-js-plugins-editor';
import debounce from 'lodash.debounce';
import { getPatientsByName } from 'api/patient-api';
import { getUserByFirstName } from 'api/people-api';
import PeopleSuggestionsPopover from './PeopleSuggestionsPopover/PeopleSuggestionsPopover';
import PatientsSuggestionsPopover from './PatientsSuggestionsPopover/PatientsSuggestionsPopover';
import PatientSuggestionItem from './PatientSuggestionItem/PatientSuggestionItem';
import PeopleSuggestionItem from './PeopleSuggestionItem/PeopleSuggestionItem';
import {
  initializeLinkifyPlugin,
  initializePeopleMentionPlugin,
  initializePatientMentionPlugin,
} from './plugin-config';
import {
  SUGGESTIONS_PLACEHOLDER,
  mapPatientsToSuggestions,
  mapPeopleToSuggestions,
} from './helpers';
import { StyledEditorContainer } from './styled';

const fetchPatientsWithDebounce = debounce(
  (value, setPatientSuggestions, areSuggestionsOpened) => {
    getPatientsByName(value).then(fetchedPatients => {
      if (areSuggestionsOpened.current) {
        const formattedPatients = mapPatientsToSuggestions(fetchedPatients);
        setPatientSuggestions(
          formattedPatients.length > 0
            ? formattedPatients
            : [SUGGESTIONS_PLACEHOLDER],
        );
      }
    });
  },
  300,
);

const fetchPeopleWithDebounce = debounce(
  (value, setPeopleSuggestions, areSuggestionsOpened) => {
    getUserByFirstName(value).then(fetchedPeople => {
      if (areSuggestionsOpened.current) {
        const formattedPeople = mapPeopleToSuggestions(fetchedPeople);
        setPeopleSuggestions(
          formattedPeople.length > 0
            ? formattedPeople
            : [SUGGESTIONS_PLACEHOLDER],
        );
      }
    });
  },
  300,
);

const MentionsEditor = React.forwardRef(
  (
    {
      readOnly,
      withEditedLabel,
      keyBindingFn,
      handleKeyCommand,
      onBlur = () => {},
      onFocus = () => {},
      onChange = () => {},
      onAddMention = () => {},
      placeholder = '',
      initialState,
      state,
    },
    reference,
  ) => {
    const linkifyPlugin = useRef(initializeLinkifyPlugin());
    const peopleMentionPlugin = useRef(initializePeopleMentionPlugin());
    const patientMentionPlugin = useRef(initializePatientMentionPlugin());

    const [editorState, setEditorState] = useState(initialState);

    const [peopleSuggestions, setPeopleSuggestions] = useState([
      [SUGGESTIONS_PLACEHOLDER],
    ]);
    const [patientSuggestions, setPatientSuggestions] = useState([
      SUGGESTIONS_PLACEHOLDER,
    ]);
    const [patientSearchValue, setPatientSearchValue] = useState(null);
    const [peopleSearchValue, setPeopleSearchValue] = useState(null);

    const arePeopleSuggestionsOpened = useRef(false);
    const arePatientSuggestionsOpened = useRef(false);

    const handleChange = newState => {
      if (!state) setEditorState(newState);

      onChange(newState);
    };

    const handleBlur = () => {
      onBlur(state || editorState);
    };

    const clearPeopleSuggestions = () => {
      setPeopleSuggestions([SUGGESTIONS_PLACEHOLDER]);
    };

    const onPeopleSearchChange = ({ value }) => {
      if (value) {
        setPeopleSearchValue(value);
        fetchPeopleWithDebounce(
          value,
          setPeopleSuggestions,
          arePeopleSuggestionsOpened,
        );
      } else {
        setPeopleSearchValue('');
        clearPeopleSuggestions();
      }
    };

    const clearPatientSuggestions = () => {
      setPatientSuggestions([SUGGESTIONS_PLACEHOLDER]);
    };

    const onPatientSearchChange = ({ value }) => {
      if (value) {
        setPatientSearchValue(value);
        fetchPatientsWithDebounce(
          value,
          setPatientSuggestions,
          arePatientSuggestionsOpened,
        );
      } else {
        setPatientSearchValue('');
        clearPatientSuggestions();
      }
    };

    const focus = () => {
      if (reference?.current) {
        reference.current.focus();
      }
    };

    const {
      MentionSuggestions: PeopleMentionSuggestions,
    } = peopleMentionPlugin.current;
    const {
      MentionSuggestions: PatientsMentionSuggestions,
    } = patientMentionPlugin.current;
    const plugins = [
      peopleMentionPlugin.current,
      patientMentionPlugin.current,
      linkifyPlugin.current,
    ];
    return (
      <StyledEditorContainer
        withEditedLabel={withEditedLabel && readOnly}
        isReadOnly={readOnly}
        onClick={focus}
      >
        <Editor
          ref={reference}
          plugins={plugins}
          editorState={state || editorState}
          readOnly={readOnly}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
        />

        <PeopleMentionSuggestions
          onSearchChange={onPeopleSearchChange}
          suggestions={peopleSuggestions}
          onAddMention={onAddMention}
          entryComponent={PeopleSuggestionItem}
          popoverComponent={
            <PeopleSuggestionsPopover searchValue={peopleSearchValue} />
          }
          onOpen={() => {
            arePeopleSuggestionsOpened.current = true;
            setPeopleSearchValue('');
          }}
          onClose={() => {
            arePeopleSuggestionsOpened.current = false;
            setPeopleSearchValue(null);
          }}
        />
        <PatientsMentionSuggestions
          onSearchChange={onPatientSearchChange}
          suggestions={patientSuggestions}
          onAddMention={onAddMention}
          entryComponent={PatientSuggestionItem}
          popoverComponent={
            <PatientsSuggestionsPopover searchValue={patientSearchValue} />
          }
          onOpen={() => {
            arePatientSuggestionsOpened.current = true;
            setPatientSearchValue('');
          }}
          onClose={() => {
            arePatientSuggestionsOpened.current = false;
            setPatientSearchValue(null);
          }}
        />
      </StyledEditorContainer>
    );
  },
);

export default MentionsEditor;
