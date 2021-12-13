/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { convertToRaw } from 'draft-js';
import { makeStyles } from '@material-ui/core/styles';
import Editor from 'draft-js-plugins-editor';
import debounce from 'lodash.debounce';
import { getPatientsByCriteria } from 'api/patients-api';
import { getListMembersByName } from 'api/task-list-api';
import createToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/static-toolbar';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import Spacing from 'components/common/Spacing.tsx';
import { ClickAwayListener } from '@material-ui/core';
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
import UsersSuggestionsPopover from './UsersSuggestionsPopover/UsersSuggestionsPopover';
import PatientsSuggestionsPopover from './PatientsSuggestionsPopover/PatientsSuggestionsPopover';
import PatientSuggestionItem from './PatientSuggestionItem/PatientSuggestionItem';
import UserSuggestionItem from './UserSuggestionItem/UserSuggestionItem';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import {
  initializeLinkifyPlugin,
  initializeUsersMentionPlugin,
  initializePatientMentionPlugin,
} from './plugin-config';
import {
  SUGGESTIONS_PLACEHOLDER,
  mapPatientsToSuggestions,
  mapUsersToSuggestions,
  createHighlightDecorator,
  createLinkDecorator,
} from './helpers';
import { StyledEditorContainer, ToolbarContainer } from './styled';
import LinkButton from './Link/LinkButton';

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
    const StyledEditorContainerReference = useRef();
    const reference = outerReference || innerReference;
    const staticToolbarPlugin = useRef(createToolbarPlugin());
    const { Toolbar } = staticToolbarPlugin.current;
    const linkifyPlugin = useRef(initializeLinkifyPlugin());
    const usersMentionPlugin = useRef(initializeUsersMentionPlugin());
    const patientMentionPlugin = useRef(initializePatientMentionPlugin());
    const [editorState, setEditorState] = useMentionsEditorState(initialState);
    const [isFocused, setIsFocused] = useState(false);
    const [usersSuggestions, setUsersSuggestions] = useState([
      [SUGGESTIONS_PLACEHOLDER],
    ]);
    const [
      isFetchingUsersSuggestions,
      setIsFetchingUsersSuggestions,
    ] = useState(false);
    const [patientSuggestions, setPatientSuggestions] = useState([
      SUGGESTIONS_PLACEHOLDER,
    ]);
    const [patientSearchValue, setPatientSearchValue] = useState(null);
    const [usersSearchValue, setUsersSearchValue] = useState(null);
    const areUsersSuggestionsOpened = useRef(false);
    const arePatientSuggestionsOpened = useRef(false);

    const { currentUser } = useSelector(store => ({
      currentUser: store.userState.userProfile,
    }));

    const currentState = state || editorState;

    const customerTypeLabel = getCustomerTypeLabel(currentUser);

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

    const handleClickAway = useCallback(() => {
      setIsFocused(false);
      onBlur(currentState);
    }, [currentState, onBlur]);

    const clearUsersSuggestions = () => {
      setUsersSuggestions([SUGGESTIONS_PLACEHOLDER]);
    };

    const handleChange = useCallback(
      newState => {
        if (!state) setEditorState(newState);
        onChange(newState);
      },
      [onChange, setEditorState, state],
    );

    const fetchUsersWithDebounce = useCallback(
      debounce(value => {
        getListMembersByName(taskListIdentifier, value).then(fetchedUsers => {
          if (areUsersSuggestionsOpened.current) {
            const formattedUsers = mapUsersToSuggestions(fetchedUsers);
            setUsersSuggestions(
              formattedUsers.length > 0
                ? formattedUsers
                : [SUGGESTIONS_PLACEHOLDER],
            );
          }
          setIsFetchingUsersSuggestions(false);
        });
      }, 300),
      [areUsersSuggestionsOpened, taskListIdentifier],
    );

    const onUsersSearchChange = ({ value }) => {
      if (value) {
        setIsFetchingUsersSuggestions(true);
        setUsersSearchValue(value);
        fetchUsersWithDebounce(value);
      } else {
        setIsFetchingUsersSuggestions(false);
        setUsersSearchValue('');
        clearUsersSuggestions();
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
      MentionSuggestions: UsersMentionSuggestions,
    } = usersMentionPlugin.current;
    const {
      MentionSuggestions: PatientsMentionSuggestions,
    } = patientMentionPlugin.current;
    const plugins = [
      usersMentionPlugin.current,
      patientMentionPlugin.current,
      linkifyPlugin.current,
      staticToolbarPlugin.current,
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

    const styleMap = {
      STRIKETHROUGH: {
        textDecoration: 'line-through',
      },
    };

    const separaterClass = separatorStyles();

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <StyledEditorContainer
          withEditedLabel={withEditedLabel && readOnly}
          isReadOnly={readOnly}
          isOneline={oneline}
          onClick={focus}
          minHeight={minHeight}
          ref={StyledEditorContainerReference}
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
                      <Separator
                        {...currentProps}
                        className={separaterClass.root}
                      />
                      <LinkButton {...currentProps} />
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
            onChange={handleChange}
            keyBindingFn={keyBindingFn}
            handleKeyCommand={handleKeyCommand}
            decorators={[
              ...(highlightedValues?.length > 0
                ? [createHighlightDecorator(highlightedValues)]
                : []),
              createLinkDecorator,
            ]}
          />
          <Spacing horizontal={4} />
          {!disableMentions && taskListIdentifier && (
            <UsersMentionSuggestions
              onSearchChange={onUsersSearchChange}
              suggestions={usersSuggestions}
              onAddMention={onAddMention}
              entryComponent={UserSuggestionItem}
              popoverComponent={
                <UsersSuggestionsPopover
                  searchValue={usersSearchValue}
                  isFetching={isFetchingUsersSuggestions}
                />
              }
              onOpen={() => {
                areUsersSuggestionsOpened.current = true;
                setUsersSearchValue('');
              }}
              onClose={() => {
                areUsersSuggestionsOpened.current = false;
                setUsersSearchValue(null);
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
      </ClickAwayListener>
    );
  },
);

export default TextEditor;
