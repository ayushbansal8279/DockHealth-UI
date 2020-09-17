import React, { useState, useRef, useEffect } from 'react';
import Editor from 'draft-js-plugins-editor';
import { getMembersByTaskListId } from 'api/tasklist-api';
import { getPatientsByName } from 'api/patient-api';
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
  peopleSuggestionsFilter,
} from './helpers';
import { StyledEditorContainer } from './styled';

const MentionsInput = React.forwardRef(
  (
    {
      readOnly,
      taskListIdentifier,
      withEditedLabel,
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
      SUGGESTIONS_PLACEHOLDER,
    ]);
    const [patientSuggestions, setPatientSuggestions] = useState(
      SUGGESTIONS_PLACEHOLDER,
    );
    const [listMembers, setListMembers] = useState([]);

    useEffect(() => {
      if (!taskListIdentifier) {
        return;
      }

      getMembersByTaskListId(taskListIdentifier, 'ALL').then(members => {
        setListMembers(members);
      });
    }, [taskListIdentifier]);

    const handleChange = newState => {
      if (!state) setEditorState(newState);

      onChange(newState);
    };

    const handleBlur = () => {
      onBlur(state || editorState);
    };

    const onPeopleSearchChange = ({ value }) => {
      setPeopleSuggestions(
        value
          ? peopleSuggestionsFilter(value, mapPeopleToSuggestions(listMembers))
          : [SUGGESTIONS_PLACEHOLDER],
      );
    };

    const clearPatientSuggestions = () => {
      setPatientSuggestions([SUGGESTIONS_PLACEHOLDER]);
    };

    const onPatientSearchChange = ({ value }) => {
      if (value) {
        getPatientsByName(value).then(fetchedPatients => {
          const formattedPatients = mapPatientsToSuggestions(fetchedPatients);
          setPatientSuggestions(formattedPatients);
        });
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
        />

        <PeopleMentionSuggestions
          onSearchChange={onPeopleSearchChange}
          suggestions={peopleSuggestions}
          onAddMention={onAddMention}
          entryComponent={PeopleSuggestionItem}
          popoverComponent={<PeopleSuggestionsPopover />}
        />
        <PatientsMentionSuggestions
          onSearchChange={onPatientSearchChange}
          suggestions={patientSuggestions}
          onAddMention={onAddMention}
          entryComponent={PatientSuggestionItem}
          popoverComponent={<PatientsSuggestionsPopover />}
        />
      </StyledEditorContainer>
    );
  },
);

export default MentionsInput;
