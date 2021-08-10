/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { convertToRaw } from 'draft-js';
import { makeStyles } from '@material-ui/core/styles';
import Editor from 'draft-js-plugins-editor';
import debounce from 'lodash.debounce';
import { getPatientsByCriteria } from 'api/patient-api';
import { getListMembersByName } from 'api/task-list-api';
import createToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/static-toolbar';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
// import createEmojiPlugin from '@draft-js-plugins/emoji';
import Spacing from 'components/common/Spacing.tsx';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  createInlineStyleButton,
} from '@draft-js-plugins/buttons';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import PeopleSuggestionsPopover from './PeopleSuggestionsPopover/PeopleSuggestionsPopover';
import PatientsSuggestionsPopover from './PatientsSuggestionsPopover/PatientsSuggestionsPopover';
import PatientSuggestionItem from './PatientSuggestionItem/PatientSuggestionItem';
import PeopleSuggestionItem from './PeopleSuggestionItem/PeopleSuggestionItem';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
// import '@draft-js-plugins/emoji/lib/plugin.css';
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
import {
  StyledEditorContainer,
  // EmojiContainer,
  ToolbarContainer,
} from './styled';

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

const separatorStyles = makeStyles({
  root: {
    display: 'inline-block',
    borderRight: '1px solid #ddd',
    height: '30px',
    margin: '0 0.5em',
    marginBottom: '2px',
  },
});

const TextEditor = React.forwardRef(
  (
    {
      showToolbar = false,
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
      oneline = false,
      disableMentions = false,
      minHeight,
    },
    outerReference,
  ) => {
    const innerReference = useRef();
    const reference = outerReference || innerReference;
    const staticToolbarPlugin = useRef(createToolbarPlugin());
    // const emojiPlugin = useRef(createEmojiPlugin());
    // const { EmojiSelect } = emojiPlugin.current;
    const { Toolbar } = staticToolbarPlugin.current;
    const linkifyPlugin = useRef(initializeLinkifyPlugin());
    const peopleMentionPlugin = useRef(initializePeopleMentionPlugin());
    const patientMentionPlugin = useRef(initializePatientMentionPlugin());

    const [editorState, setEditorState] = useMentionsEditorState(initialState);
    const [isFocused, setIsFocused] = useState(false);

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

    const currentState = state || editorState;

    const customerTypeLabel = getCustomerTypeLabel(currentUser);

    const handleChange = newState => {
      if (!state) setEditorState(newState);
      onChange(newState);
    };

    const showPlaceholder = useMemo(() => {
      const rawState = convertToRaw(currentState.getCurrentContent());
      const firstBlock = rawState?.blocks?.[0];
      if (firstBlock) {
        const { type } = firstBlock;
        const containOnlyList =
          type === 'ordered-list-item' || type === 'unordered-list-item';
        return !containOnlyList;
      }
      return false;
    }, [currentState]);

    const handleFocus = event => {
      onFocus(event);
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur(currentState);
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
      staticToolbarPlugin.current,
      // emojiPlugin.current,
    ];

    const ThroughLineButton = outerProps => {
      const StrikethroughButton = createInlineStyleButton(
        {
          style: 'STRIKETHROUGH',
          children: (
            <div>
              <StrikethroughSIcon />
            </div>
          ),
        },
        'STRIKETHROUGH',
      );
      return <StrikethroughButton {...outerProps} />;
    };
    // const EmojiiButton = outerProps => {
    //   const StrikethroughButton = createInlineStyleButton(
    //     {
    //       children: (
    //         <EmojiContainer>
    //           <EmojiSelect style={{ border: 'none' }} />
    //         </EmojiContainer>
    //       ),
    //     },
    //     'STRIKETHROUGH',
    //   );
    //   return <StrikethroughButton {...outerProps} />;
    // };

    const styleMap = {
      STRIKETHROUGH: {
        textDecoration: 'line-through',
      },
    };

    const separaterClass = separatorStyles();

    return (
      <StyledEditorContainer
        withEditedLabel={withEditedLabel && readOnly}
        isReadOnly={readOnly}
        isOneline={oneline}
        onClick={focus}
        minHeight={minHeight}
      >
        {showToolbar && isFocused && (
          <ToolbarContainer>
            <Toolbar>
              {externalProps => {
                const currentProps = {
                  ...externalProps,
                  getEditorState: () => currentState,
                };
                return (
                  <div>
                    <BoldButton {...currentProps} />
                    <ItalicButton {...currentProps} />
                    <UnderlineButton {...currentProps} />
                    <ThroughLineButton {...currentProps} />
                    <Separator
                      {...currentProps}
                      className={separaterClass.root}
                    />
                    <UnorderedListButton {...currentProps} />
                    <OrderedListButton {...currentProps} />
                    <Separator
                      {...currentProps}
                      className={separaterClass.root}
                    />
                    <HeadlineOneButton {...currentProps} />
                    <HeadlineTwoButton {...currentProps} />
                    <HeadlineThreeButton {...currentProps} />
                    {/* <EmojiiButton {...currentProps} /> */}
                  </div>
                );
              }}
            </Toolbar>
          </ToolbarContainer>
        )}
        <Editor
          customStyleMap={styleMap}
          ref={reference}
          plugins={plugins}
          editorState={currentState}
          readOnly={readOnly}
          placeholder={showPlaceholder ? placeholder : ''}
          onFocus={handleFocus}
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

        <Spacing horizontal={4} />
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

export default TextEditor;
