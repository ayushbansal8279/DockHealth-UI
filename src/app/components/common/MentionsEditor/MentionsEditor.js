/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Editor from 'draft-js-plugins-editor';
import debounce from 'lodash.debounce';
import { getPatientsByCriteria } from 'api/patient-api';
import { getListMembersByName } from 'api/task-list-api';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
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
  createHighlightDecorator,
} from './helpers';
import { StyledEditorContainer } from './styled';

const fetchPatientsWithDebounce = debounce(
  (value, setPatientSuggestions, areSuggestionsOpened) => {
    getPatientsByCriteria(value).then(fetchedPatients => {
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
      highlightedValues,
      taskListIdentifier,
      isDrawerEditor = false,
      oneline = false,
      disableMentions = false,
    },
    reference,
  ) => {
    const linkifyPlugin = useRef(initializeLinkifyPlugin());
    const peopleMentionPlugin = useRef(
      initializePeopleMentionPlugin(isDrawerEditor),
    );
    const patientMentionPlugin = useRef(
      initializePatientMentionPlugin(isDrawerEditor),
    );

    const [editorState, setEditorState] = useState(initialState);

    const [peopleSuggestions, setPeopleSuggestions] = useState([
      [SUGGESTIONS_PLACEHOLDER],
    ]);
    const [
      isFetchingPeopleSuggestions,
      setIsFetchingPeopleSuggestions,
    ] = useState(false);
    const [patientSuggestions, setPatientSuggestions] = useState([
      SUGGESTIONS_PLACEHOLDER,
    ]);
    const [patientSearchValue, setPatientSearchValue] = useState(null);
    const [peopleSearchValue, setPeopleSearchValue] = useState(null);

    const arePeopleSuggestionsOpened = useRef(false);
    const arePatientSuggestionsOpened = useRef(false);

    const { currentUser } = useSelector(store => ({
      currentUser: store.userState.userProfile,
    }));

    const customerTypeLabel = getCustomerTypeLabel(currentUser);

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

    const fetchPeopleWithDebounce = useCallback(
      debounce(value => {
        getListMembersByName(taskListIdentifier, value).then(fetchedPeople => {
          if (arePeopleSuggestionsOpened.current) {
            const formattedPeople = mapPeopleToSuggestions(fetchedPeople);
            setPeopleSuggestions(
              formattedPeople.length > 0
                ? formattedPeople
                : [SUGGESTIONS_PLACEHOLDER],
            );
          }
          setIsFetchingPeopleSuggestions(false);
        });
      }, 300),
      [arePeopleSuggestionsOpened, taskListIdentifier],
    );

    const onPeopleSearchChange = ({ value }) => {
      if (value) {
        setIsFetchingPeopleSuggestions(true);
        setPeopleSearchValue(value);
        fetchPeopleWithDebounce(value);
      } else {
        setIsFetchingPeopleSuggestions(false);
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
        isOneline={oneline}
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
          decorators={
            highlightedValues?.length > 0
              ? [createHighlightDecorator(highlightedValues)]
              : null
          }
        />
        {!disableMentions && taskListIdentifier && (
          <PeopleMentionSuggestions
            onSearchChange={onPeopleSearchChange}
            suggestions={peopleSuggestions}
            onAddMention={onAddMention}
            entryComponent={PeopleSuggestionItem}
            popoverComponent={
              <PeopleSuggestionsPopover
                searchValue={peopleSearchValue}
                isFetching={isFetchingPeopleSuggestions}
              />
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
        )}
        {!disableMentions && (
          <PatientsMentionSuggestions
            onSearchChange={onPatientSearchChange}
            suggestions={patientSuggestions}
            onAddMention={onAddMention}
            entryComponent={PatientSuggestionItem}
            popoverComponent={
              <PatientsSuggestionsPopover
                searchValue={patientSearchValue}
                customerTypeLabel={customerTypeLabel}
              />
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
        )}
      </StyledEditorContainer>
    );
  },
);

export default MentionsEditor;
