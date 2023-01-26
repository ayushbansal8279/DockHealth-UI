/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { useSelector } from 'react-redux';
// import { convertToRaw, EditorState } from 'draft-js';
// import { makeStyles } from '@mui/styles';
// import Editor from 'draft-js-plugins-editor';
import debounce from 'lodash.debounce';
import { getPatientsByCriteria } from 'api/patients-api';
import { getListMembersByName } from 'api/task-list-api';
// import createToolbarPlugin, {
//   Separator,
// } from '@draft-js-plugins/static-toolbar';
// import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import Spacing from 'components/common/Spacing';
import { Box, ClickAwayListener } from '@mui/material';
// import {
//   ItalicButton,
//   BoldButton,
//   UnderlineButton,
//   UnorderedListButton,
//   OrderedListButton,
//   HeadlineOneButton,
//   HeadlineTwoButton,
//   HeadlineThreeButton,
//   createInlineStyleButton,
// } from '@draft-js-plugins/buttons';
import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
import { FieldCharakterLimit } from 'helpers/field-type-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import UsersSuggestionsPopover from './UsersSuggestionsPopover/UsersSuggestionsPopover';
import PatientsSuggestionsPopover from './PatientsSuggestionsPopover/PatientsSuggestionsPopover';
import PatientSuggestionItem from './PatientSuggestionItem/PatientSuggestionItem';
import UserSuggestionItem from './UserSuggestionItem/UserSuggestionItem';
// import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import {
  // initializeLinkifyPlugin,
  initializeUsersMentionPlugin,
  initializePatientMentionPlugin,
} from './plugin-config';
import {
  SUGGESTIONS_PLACEHOLDER,
  mapPatientsToSuggestions,
  mapUsersToSuggestions,
  // createHighlightDecorator,
  // createLinkDecorator,
  // createPlaceholderDecorator,
  countCharakters,
  // convertFromEditorStateToOutput,
} from './helpers';
import { Counter, StyledEditorContainer, ToolbarContainer } from './styled';
import LinkButton from './Link/LinkButton';
import LinkPopover from './Link/LinkPopover';
import { createLinkAtSelection, hasEntity } from './Link/helpers';

const fetchPatientsWithDebounce = debounce(
  (value, setPatientSuggestions, areSuggestionsOpened) => {
    getPatientsByCriteria(value).then((fetchedPatients) => {
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

// const separatorStyles = makeStyles({
//   root: {
//     display: 'inline-block',
//     borderRight: '1px solid #ddd',
//     height: '30px',
//     margin: '0 0.5em',
//     marginBottom: '2px',
//   },
// });

const TextEditor = React.forwardRef(
  (
    {
      maxHeight,
      showToolbar = false,
      fullHeight,
      readOnly,
      withEditedLabel,
      // keyBindingFn,
      // handleKeyCommand,
      // onBlur = () => {},
      // onFocus = () => {},
      onChange = () => {},
      onAddMention = () => {},
      // placeholder = '',
      initialState,
      state,
      // highlightedValues,
      taskListIdentifier,
      oneline = false,
      // disableNativeLinks = false,
      disableMentions = false,
      minHeight,
      getFocusFromParent,
      characterLimit = showToolbar ? FieldCharakterLimit.RICH_TEXT : false,
    },
    outerReference,
  ) => {
    const [showCounter] = useState(false);
    const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
    const linkButtonReference = useRef();
    const innerReference = useRef();
    const StyledEditorContainerReference = useRef();
    const reference = outerReference || innerReference;
    // const staticToolbarPlugin = useRef(createToolbarPlugin());
    // const { Toolbar } = staticToolbarPlugin.current;
    // const linkifyPlugin = useRef(initializeLinkifyPlugin());
    const usersMentionPlugin = useRef(initializeUsersMentionPlugin());
    const patientMentionPlugin = useRef(initializePatientMentionPlugin());
    const [editorState, setEditorState] = useMentionsEditorState(initialState);
    const [isFocused, setIsFocused] = useState(false);
    const [usersSuggestions, setUsersSuggestions] = useState([
      [SUGGESTIONS_PLACEHOLDER],
    ]);

    const [isFetchingUsersSuggestions, setIsFetchingUsersSuggestions] =
      useState(false);
    const [patientSuggestions, setPatientSuggestions] = useState([
      SUGGESTIONS_PLACEHOLDER,
    ]);
    const [patientSearchValue, setPatientSearchValue] = useState(null);
    const [usersSearchValue, setUsersSearchValue] = useState(null);
    const areUsersSuggestionsOpened = useRef(false);
    const arePatientSuggestionsOpened = useRef(false);

    const currentUser = useSelector(userProfileSelector);

    useEffect(() => {
      if (
        typeof getFocusFromParent === 'boolean' &&
        getFocusFromParent !== isFocused
      )
        setIsFocused(getFocusFromParent);
    }, [getFocusFromParent, isFocused]);

    const currentState = state ?? editorState;

    const counter = useMemo(
      () => countCharakters(currentState),
      [currentState],
    );

    const customerTypeLabel = getCustomerTypeLabel(currentUser);
    // const showPlaceholder = useMemo(() => {
    // const rawState = convertToRaw(currentState.getCurrentContent());
    // const firstBlock = rawState?.blocks?.[0];
    // if (firstBlock) {
    //   const { type } = firstBlock;
    //   const containOnlyList =
    //     type === 'ordered-list-item' || type === 'unordered-list-item';
    //   return !containOnlyList;
    // }
    // return false;
    // }, [currentState]);

    // const handleFocus = (event) => {
    //   onFocus(event);
    //   setIsFocused(true);
    //   setShowCounter(true);
    // };

    const handleClickAway = useCallback(() => {
      if (isFocused) {
        // setIsFocused(false);
      }
    }, [isFocused]);

    const clearUsersSuggestions = () => {
      setUsersSuggestions([SUGGESTIONS_PLACEHOLDER]);
    };

    const handleChange = useCallback(
      (newState) => {
        // const { tokenizedText } = convertFromEditorStateToOutput(
        //   newState,
        //   true,
        // );

        // console.log('tokenizedText', tokenizedText);
        if (!state) setEditorState(newState);
        onChange(newState);
      },
      [onChange, setEditorState, state],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchUsersWithDebounce = useCallback(
      debounce((value) => {
        getListMembersByName(taskListIdentifier, value).then((fetchedUsers) => {
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

    const { MentionSuggestions: UsersMentionSuggestions } =
      usersMentionPlugin.current;
    const { MentionSuggestions: PatientsMentionSuggestions } =
      patientMentionPlugin.current;

    // const plugins = useMemo(() => {
    //   const pluginArray = [];
    //   if (!disableMentions) {
    //     pluginArray.push(
    //       usersMentionPlugin.current,
    //       patientMentionPlugin.current,
    //     );
    //   }
    //   // if (showToolbar) pluginArray.push(staticToolbarPlugin.current);
    //   if (!disableNativeLinks) pluginArray.push(linkifyPlugin.current);
    //   return pluginArray;
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [disableMentions, disableNativeLinks, showToolbar]);

    // const ThroughLineButton = (outerProps) => {
    //   const StrikethroughButton = createInlineStyleButton(
    //     {
    //       style: 'STRIKETHROUGH',
    //       children: (
    //         <div>
    //           <StrikethroughSIcon />
    //         </div>
    //       ),
    //     },
    //     'STRIKETHROUGH',
    //   );
    //   return <StrikethroughButton {...outerProps} />;
    // };

    // const styleMap = {
    //   STRIKETHROUGH: {
    //     textDecoration: 'line-through',
    //   },
    // };

    // const separaterClass = separatorStyles();

    const initText = useMemo(() => {
      const selection = currentState.getSelection();
      const anchorKey = selection.getAnchorKey();
      const currentContent = currentState.getCurrentContent();
      const currentBlock = currentContent.getBlockForKey(anchorKey);
      const start = selection.getStartOffset();
      const end = selection.getEndOffset();
      return currentBlock.getText().slice(start, end);
    }, [currentState]);

    const initLink = useMemo(() => {
      try {
        const selection = currentState.getSelection();
        const content = currentState.getCurrentContent();
        const startKey = selection.getStartKey();
        const startOffset = selection.getStartOffset();
        const block = content.getBlockForKey(startKey);
        const linkKey = block.getEntityAt(startOffset);
        const linkInstance = currentState.getEntity(linkKey);
        const { url } = linkInstance.getData();

        return url || '';
      } catch {
        return '';
      }
    }, [currentState]);

    const handleLinkPopoverConfirm = useCallback(
      ({ text = '', link = '' }) => {
        handleChange(createLinkAtSelection(currentState, { text, link }));
      },
      [currentState, handleChange],
    );

    const handleLinkPopoverOpen = useCallback(
      (flag) => {
        if (hasEntity(currentState, 'LINK')) {
          const selection = currentState?.getSelection();
          if (selection.isCollapsed()) {
            const content = currentState.getCurrentContent();
            const startKey = selection.getStartKey();
            const startOffset = selection.getStartOffset();
            const block = content.getBlockForKey(startKey);
            const entity = block.getEntityAt(startOffset);

            block.findEntityRanges(
              (character) => character.getEntity() === entity,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (start, end) => {
                // const newSelection = selection.merge({
                //   anchorOffset: start,
                //   focusOffset: end,
                // });
                // const newEditorState = EditorState.acceptSelection(
                //   currentState,
                //   newSelection,
                // );
                // const newState = EditorState.forceSelection(
                //   newEditorState,
                //   newEditorState.getSelection(),
                // );
                // handleChange(newState);
              },
            );
          }
          setLinkPopoverOpen(flag);
        } else {
          setLinkPopoverOpen(flag);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentState, handleChange],
    );

    // const handleAllowType = useCallback(
    //   (_, newState) => {
    //     if (!characterLimit) return;
    //     const newCount = countCharakters(newState);
    //     // eslint-disable-next-line consistent-return
    //     if (newCount >= characterLimit) return 'handled';
    //   },
    //   [characterLimit],
    // );

    // const handleAllowPaste = useCallback(
    //   (text, _, newState) => {
    //     if (!characterLimit) return;
    //     const newCount = countCharakters(newState);
    //     // eslint-disable-next-line consistent-return
    //     if (newCount + text.length - 1 >= characterLimit) return 'handled';
    //   },
    //   [characterLimit],
    // );
    // const handleEditorBlur = useCallback(
    //   (event) => {
    //     setShowCounter(false);
    //     if (!linkPopoverOpen) {
    //       if (currentState) {
    //         const { tokenizedText } = convertFromEditorStateToOutput(
    //           currentState,
    //           showToolbar,
    //         );
    //         onBlur(event, tokenizedText);

    //         // console.log('tokenizedText', tokenizedText);
    //       } else {
    //         onBlur(event);
    //       }
    //     }
    //   },
    //   [linkPopoverOpen, onBlur, showToolbar, currentState],
    // );

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <StyledEditorContainer
            withEditedLabel={withEditedLabel && readOnly}
            isReadOnly={readOnly}
            isOneline={oneline}
            onClick={focus}
            minHeight={minHeight}
            fullHeight={fullHeight}
            ref={StyledEditorContainerReference}
          >
            {showToolbar && isFocused && (
              <ToolbarContainer>
                {/* <Toolbar> */}
                {(externalProps) => {
                  const currentProps = {
                    ...externalProps,
                    getEditorState: () => currentState,
                  };
                  return (
                    <div>
                      {/* <BoldButton {...currentProps} />
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
                      /> */}
                      <LinkButton
                        buttonReference={linkButtonReference}
                        popoverOpen={linkPopoverOpen}
                        handleOpen={handleLinkPopoverOpen}
                        {...currentProps}
                      />
                    </div>
                  );
                }}
                {/* </Toolbar> */}
              </ToolbarContainer>
            )}
            {maxHeight ? (
              <Box maxHeight={maxHeight} overflow="auto">
                {/* <Editor
                  handleBeforeInput={handleAllowType}
                  handlePastedText={handleAllowPaste}
                  customStyleMap={styleMap}
                  ref={reference}
                  plugins={plugins}
                  editorState={currentState}
                  readOnly={readOnly}
                  placeholder={showPlaceholder ? placeholder : ''}
                  // onFocus={handleFocus}
                  onBlur={handleEditorBlur}
                  onChange={handleChange}
                  keyBindingFn={keyBindingFn}
                  handleKeyCommand={handleKeyCommand}
                  decorators={[
                    ...(highlightedValues?.length > 0
                      ? [createHighlightDecorator(highlightedValues)]
                      : []),
                    createLinkDecorator,
                    createPlaceholderDecorator,
                  ]}
                /> */}
              </Box>
            ) : (
              // <Editor
              //   handleBeforeInput={handleAllowType}
              //   handlePastedText={handleAllowPaste}
              //   customStyleMap={styleMap}
              //   ref={reference}
              //   plugins={plugins}
              //   editorState={currentState}
              //   readOnly={readOnly}
              //   placeholder={showPlaceholder ? placeholder : ''}
              //   onFocus={handleFocus}
              //   onBlur={handleEditorBlur}
              //   onChange={handleChange}
              //   keyBindingFn={keyBindingFn}
              //   handleKeyCommand={handleKeyCommand}
              //   decorators={[
              //     ...(highlightedValues?.length > 0
              //       ? [createHighlightDecorator(highlightedValues)]
              //       : []),
              //     createLinkDecorator,
              //     createPlaceholderDecorator,
              //   ]}
              // />
              <div />
            )}

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
          {!!characterLimit && (getFocusFromParent ?? showCounter) && (
            <Counter alert={counter >= characterLimit}>
              {`${counter}/${characterLimit}`}
            </Counter>
          )}
          <LinkPopover
            initText={initText}
            initLink={initLink}
            anchorElement={linkButtonReference}
            isPopoverOpen={linkPopoverOpen}
            close={() => handleLinkPopoverOpen(false)}
            onSave={handleLinkPopoverConfirm}
          />
        </div>
      </ClickAwayListener>
    );
  },
);

export default TextEditor;
