/* eslint-disable @typescript-eslint/no-unused-vars */
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
//   import debounce from 'lodash.debounce';
//   import { getPatientsByCriteria } from 'api/patients-api';
//   import { getListMembersByName } from 'api/task-list-api';
//   import Spacing from 'components/common/Spacing';
//   import { Box, ClickAwayListener } from '@mui/material';
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
//   import { useMentionsEditorState } from 'components/common/TextEditor/use-mentions-editor-state';
//   import { FieldCharakterLimit } from 'helpers/field-type-helpers';
//   import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
//   import { userProfileSelector } from 'selectors/user-selectors';
//   import UsersSuggestionsPopover from './UsersSuggestionsPopover/UsersSuggestionsPopover';
//   import PatientsSuggestionsPopover from './PatientsSuggestionsPopover/PatientsSuggestionsPopover';
//   import PatientSuggestionItem from './PatientSuggestionItem/PatientSuggestionItem';
//   import UserSuggestionItem from './UserSuggestionItem/UserSuggestionItem';
// import '@draft-js-plugins/static-toolbar/lib/plugin.css';
// import {
//   // initializeLinkifyPlugin,
//   initializeUsersMentionPlugin,
//   initializePatientMentionPlugin,
// } from './plugin-config';
//   import {
//     SUGGESTIONS_PLACEHOLDER,
//     mapPatientsToSuggestions,
//     mapUsersToSuggestions,
//     // createHighlightDecorator,
//     // createLinkDecorator,
//     // createPlaceholderDecorator,
//     countCharakters,
//     // convertFromEditorStateToOutput,
//   } from './helpers';
//   import { Counter, StyledEditorContainer, ToolbarContainer } from './styled';
//   import LinkButton from './Link/LinkButton';
//   import LinkPopover from './Link/LinkPopover';
//   import { createLinkAtSelection, hasEntity } from './Link/helpers';

import FroalaEditor from 'react-froala-wysiwyg';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
import './styles.css';

const md = new MarkdownIt();
const turndownService = new TurndownService();

const FROALA_PRODUCT_KEY =
  'MZC1rE1D4D3I4A16B11D8jF1QUg1Xc2OZE1ABVJRDRNGGUH1ITrA1C7A6D5E1D4D4E1B10D7==';

//   const fetchPatientsWithDebounce = debounce(
//     (value, setPatientSuggestions, areSuggestionsOpened) => {
//       getPatientsByCriteria(value).then((fetchedPatients) => {
//         if (areSuggestionsOpened.current) {
//           const formattedPatients = mapPatientsToSuggestions(fetchedPatients);
//           setPatientSuggestions(
//             formattedPatients.length > 0
//               ? formattedPatients
//               : [SUGGESTIONS_PLACEHOLDER],
//           );
//         }
//       });
//     },
//     300,
//   );

const toolbarOptions = [
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  // 'subscript',
  // 'superscript',
  // 'fontSize',
  'paragraphFormat',
  '|',
  'formatOLSimple',
  'formatUL',
  'outdent',
  'indent',
  'insertLink',
  // 'lineHeight',
  '|',
  // 'emoticons',
  // 'undo',
  // 'redo',
  // 'trackChanges',
  // 'markdown',
];

const RichTextEditor = React.forwardRef(
  (
    {
      value,
      height = 100,
      // maxHeight,
      showToolbar = true,
      showToolbarOnEdit = true,
      // showToolbarInline = false,
      // fullHeight,
      readonly,
      // withEditedLabel,
      // keyBindingFn,
      // handleKeyCommand,
      // onFocus = () => {},
      onBlur = () => {},
      onChange = () => {},
      onKeyEnter = () => {},
      // onAddMention = () => {},
      // placeholder = '',
      // initialState,
      // state,
      // highlightedValues,
      // taskListIdentifier,
      // oneline = false,
      multiline = true,
      // disableNativeLinks = false,
      // disableMentions = false,
      // minHeight,
      // getFocusFromParent,
      // characterLimit = showToolbar ? FieldCharakterLimit.RICH_TEXT : false,
      showCharCount = false,
      initOnClick = false,
    },
    outerReference,
  ) => {
    const [rawTextState, setRawTextState] = useState(value);

    const [editorState, setEditorState] = useState(
      // rawTextState,
      md.render(rawTextState || ''),
    );

    const [editor, setEditor] = useState(null);

    useEffect(() => {
      if (editor) {
        if (readonly) {
          editor.edit.off();
          if (showToolbarOnEdit) {
            editor.toolbar.hide();
            editor.$second_tb?.hide();
          }
        } else {
          editor.edit.on();
          if (showToolbarOnEdit) {
            editor.toolbar.show();
            editor.$second_tb?.show();
          }
        }
      }
    }, [editor, readonly, showToolbarOnEdit]);

    useEffect(() => {
      if (editor) {
        if (showToolbar) {
          editor.toolbar.show();
          editor.events.focus();
        } else {
          editor.toolbar.hide();
        }
      }
    }, [editor, showToolbar]);

    const showToolbarInline = !showToolbar;

    const config = {
      key: FROALA_PRODUCT_KEY,
      attribution: false,
      placeholder: 'Edit task details',
      multiLine: { multiline },
      charCounterCount: false,
      initOnClick: { initOnClick },
      toolbarInline: showToolbarInline,
      toolbarVisibleWithoutSelection: true,
      height: multiline ? { height } : 30,
      heightMax: multiline ? 150 : 30,
      toolbarButtons: showToolbar ? toolbarOptions : [],
      events: {
        // eslint-disable-next-line prettier/prettier, func-names
        'initialized' : function() {
          if (readonly) {
            // eslint-disable-next-line react/no-this-in-sfc, no-shadow
            this.edit.off();
          }
          setEditor(this);
        },
        // eslint-disable-next-line prettier/prettier, func-names
        'edit.off': function () {
        },
        // eslint-disable-next-line prettier/prettier, func-names
        'focus': function () {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          // const value = this.html.get();
          // console.log(`focus: ${value}`);
        },
        // eslint-disable-next-line prettier/prettier, func-names
        'blur': function () {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          const value = this.html.get();
          // console.log(`blur: ${value}`);
          const markdown = turndownService.turndown(value);
          onBlur(markdown);
        },
        // eslint-disable-next-line prettier/prettier, func-names
        'contentChanged': function () {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          const value = this.html.get();
          // console.log(`change: ${value}`);
          if (onChange) {
            const markdown = turndownService.turndown(value);
            onChange(markdown);
          }
        },
        // eslint-disable-next-line prettier/prettier, func-names
        'keydown': function (keydownEvent) {
          if (keydownEvent.keyCode === 13) {
            if (!keydownEvent.shiftKey && onKeyEnter?.length > 0) {
              // eslint-disable-next-line react/no-this-in-sfc, no-shadow
              const value = this.html.get();
              const markdown = turndownService.turndown(value);
              onKeyEnter(markdown);
              setEditorState('');
            } else {
              // do nothing
            }
          }
        },
      },
      linkNoReferrer: false,
      linkText: true,
      linkStyles: {
        class1: 'editor-links',
      },
      fontSizeSelection: false,
      paragraphFormatSelection: false,
      listAdvancedTypes: true,
      lineBreakerOffset: 5,
      paragraphFormat: {
        N: 'Normal',
        H1: 'Heading 1',
        H2: 'Heading 2',
        H3: 'Heading 3',
      },
    };

    return (
      // <ClickAwayListener onClickAway={handleClickAway}>
      <FroalaEditor
        tag="textarea"
        config={config}
        model={editorState}
        onModelChange={setEditorState}
      />
      // </ClickAwayListener>
    );
  },
);

export default RichTextEditor;
