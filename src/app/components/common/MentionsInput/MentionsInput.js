import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import './editorStyles.css';
import { getMembersByTaskListId } from 'api/tasklist-api';
import { getPatientsByName } from 'api/patient-api';
import createMentionEntities from './helpers';
import PeopleSuggestionsPopover from './PeopleSuggestionsPopover/PeopleSuggestionsPopover';
import PatientsSuggestionsPopover from './PatientsSuggestionsPopover/PatientsSuggestionsPopover';
import PatientSuggestionItem from './PatientSuggestionItem/PatientSuggestionItem';
import PeopleSuggestionItem from './PeopleSuggestionItem/PeopleSuggestionItem';
import PeopleMention from './PeopleMention/PeopleMention';
import PatientMention from './PatientMention/PatientMention';

const getFormattedAge = ({ dob }) => {
  if (!dob) {
    return '';
  }

  const yearsOld = moment().diff(moment(dob), 'years');

  if (yearsOld < 0) {
    return '';
  }

  const yearsLabel = yearsOld === 1 ? 'yr' : 'yrs';

  return `${yearsOld} ${yearsLabel}`;
};

const mapPatientsToSuggestions = patients =>
  patients.map(({ patientIdentifier, firstName, lastName, dob, mrn }) => ({
    id: patientIdentifier,
    name: `${firstName} ${lastName}`,
    age: getFormattedAge({ dob }),
    mrn,
  }));

const mapPeopleToSuggestions = people =>
  people.map(person => ({
    ...person,
    id: person.userIdentifier,
    name: person.userName,
  }));

const peopleSuggestionsFilter = (value, people) =>
  people.filter(({ name }) =>
    name.toLowerCase().startsWith(value.toLowerCase()),
  );

const MentionsInput = ({ readOnly, taskListIdentifier }) => {
  const peopleMentionPlugin = useRef(
    createMentionPlugin({
      mentionPrefix: '@',
      mentionTrigger: '@',
      // supportWhitespace: true,
      mentionComponent: PeopleMention,
      // mentionSuggestionsComponent: CustomMentionSuggestions,
      positionSuggestions: props => {
        const rightPosition =
          window.innerWidth - props.decoratorRect.left - 192;

        // TODO: refactor counting right position
        return {
          position: 'fixed',
          top: props.decoratorRect.bottom + 5,
          right: rightPosition < 90 ? 90 : rightPosition,
          left: 'auto',
          bottom: 'auto',
          width: 200,
          zIndex: 1001,
        };
      },
    }),
  );

  const patientMentionPlugin = useRef(
    createMentionPlugin({
      mentionPrefix: '#',
      mentionTrigger: '#',
      mentionComponent: PatientMention,
      // supportWhitespace: true,
      positionSuggestions: props => {
        // calculate from right side because of task drawer fixed position
        const rightPosition =
          window.innerWidth - props.decoratorRect.left - 192;

        // TODO: refactor counting right position
        return {
          position: 'fixed',
          top: props.decoratorRect.bottom + 5,
          right: rightPosition < 130 ? 130 : rightPosition,
          left: 'auto',
          bottom: 'auto',
          width: 200,
          zIndex: 1001,
        };
      },
    }),
  );

  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      createMentionEntities(
        'asdfasdf @Matthew Russell sdf #Patient 3 asdfasdfasdf',
        [
          {
            avatar:
              'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
            link: 'https://twitter.com/mrussell247',
            name: 'Matthew Russell',
            title: 'Test tilte',
            mentionType: '@',
          },
          {
            name: 'Patient 3',
            link: 'https://twitter.com/jyopur',
            avatar:
              'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
            mentionType: '#',
          },
        ],
      ),
    ),
  );

  const placeholder = {
    name: '',
    id: '',
    type: 'DEFAULT',
  };

  const [peopleSuggestions, setPeopleSuggestions] = useState([placeholder]);
  const [patientSuggestions, setPatientSuggestions] = useState(placeholder);
  const [listMembers, setListMembers] = useState([]);
  const editor = useRef(null);

  useEffect(() => {
    if (!taskListIdentifier) {
      return;
    }

    getMembersByTaskListId(taskListIdentifier, 'ALL').then(members => {
      setListMembers(members);
    });
  }, [taskListIdentifier]);

  const onChange = state => {
    setEditorState(state);
    console.log('state', convertToRaw(state.getCurrentContent()));
  };

  const onPeopleSearchChange = ({ value }) => {
    setPeopleSuggestions(
      value
        ? peopleSuggestionsFilter(value, mapPeopleToSuggestions(listMembers))
        : [placeholder],
    );
  };

  const clearPatientSuggestions = () => {
    setPatientSuggestions([placeholder]);
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
    editor.current.focus();
  };

  const {
    MentionSuggestions: PeopleMentionSuggestions,
  } = peopleMentionPlugin.current;
  const {
    MentionSuggestions: PatientsMentionSuggestions,
  } = patientMentionPlugin.current;
  const plugins = [peopleMentionPlugin.current, patientMentionPlugin.current];
  return (
    <div className="editor" onClick={focus}>
      <Editor
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
        ref={editor}
        placeholder="Placeholder"
        readOnly={readOnly}
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
};

export default MentionsInput;
