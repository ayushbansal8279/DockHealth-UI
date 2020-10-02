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

const fetchPatientsWithDebounce = debounce((value, setPatientSuggestions) => {
  getPatientsByName(value).then(fetchedPatients => {
    const formattedPatients = mapPatientsToSuggestions(fetchedPatients);
    setPatientSuggestions(formattedPatients);
  });
}, 300);

const fetchPeopleWithDebounce = debounce((value, setPeopleSuggestions) => {
  getUserByFirstName(value).then(fetchedPeople => {
    const formattedPeople = mapPeopleToSuggestions(fetchedPeople);
    setPeopleSuggestions(formattedPeople);
  });
}, 300);

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
        fetchPeopleWithDebounce(value, setPeopleSuggestions);
      } else {
        clearPeopleSuggestions();
      }
    };

    const clearPatientSuggestions = () => {
      setPatientSuggestions([SUGGESTIONS_PLACEHOLDER]);
    };

    const onPatientSearchChange = ({ value }) => {
      if (value) {
        fetchPatientsWithDebounce(value, setPatientSuggestions);
      } else {
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
          popoverComponent={<PeopleSuggestionsPopover />}
          onClose={() => {
            fetchPeopleWithDebounce.cancel();
          }}
        />
        <PatientsMentionSuggestions
          onSearchChange={onPatientSearchChange}
          suggestions={patientSuggestions}
          onAddMention={onAddMention}
          entryComponent={PatientSuggestionItem}
          popoverComponent={<PatientsSuggestionsPopover />}
          onClose={() => {
            fetchPatientsWithDebounce.cancel();
          }}
        />
      </StyledEditorContainer>
    );
  },
);

export default MentionsEditor;
