import React, { useState, useRef, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import './editorStyles.css';
import { getMembersByTaskListId } from 'api/tasklist-api';
import { getPatientsByName } from 'api/patient-api';
import createMentionEntities from './create-mention-entities';
import PeopleSuggestionsPopover from './PeopleSuggestionsPopover/PeopleSuggestionsPopover';
import PatientsSuggestionsPopover from './PatientsSuggestionsPopover/PatientsSuggestionsPopover';
import PatientSuggestionItem from './PatientSuggestionItem/PatientSuggestionItem';
import PeopleSuggestionItem from './PeopleSuggestionItem/PeopleSuggestionItem';
import {
  linkifyPluginConfig,
  patientMentionPluginConfig,
  peopleMentionPluginConfig,
} from './plugin-config';
import {
  SUGGESTIONS_PLACEHOLDER,
  mapPatientsToSuggestions,
  mapPeopleToSuggestions,
  peopleSuggestionsFilter,
} from './helpers';

const MentionsInput = React.forwardRef(
  (
    {
      readOnly,
      taskListIdentifier,
      onBlur = () => {},
      onFocus = () => {},
      onChange = () => {},
      placeholder = '',
    },
    reference,
  ) => {
    const peopleMentionPlugin = useRef(peopleMentionPluginConfig);
    const patientMentionPlugin = useRef(patientMentionPluginConfig);
    const linkifyPlugin = useRef(linkifyPluginConfig);

    // const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [editorState, setEditorState] = useState(
      EditorState.createWithContent(
        createMentionEntities(
          'asdfasdf @Matthew Russell sdf #Patient 3 asdfasdfasdf',
          [
            {
              id: '',
              name: 'Matthew Russell',
              mentionType: '@',
            },
            {
              id: '',
              name: 'Patient 3',
              mentionType: '#',
            },
          ],
        ),
      ),
    );

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

    const handleChange = state => {
      setEditorState(state);
      onChange(state);
      console.log('state', convertToRaw(state.getCurrentContent()));
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

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const onAddMention = () => {
      // get the mention object selected
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
      <div className="editor" onClick={focus}>
        <Editor
          ref={reference}
          plugins={plugins}
          editorState={editorState}
          readOnly={readOnly}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
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
      </div>
    );
  },
);

export default MentionsInput;
