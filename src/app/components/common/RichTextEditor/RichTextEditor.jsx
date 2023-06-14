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

const RichTextEditor = React.forwardRef(
  (
    {
      value,
      // maxHeight,
      showToolbar = true,
      // fullHeight,
      // readOnly,
      // withEditedLabel,
      // keyBindingFn,
      // handleKeyCommand,
      onBlur = () => {},
      // onFocus = () => {},
      // onChange = () => {},
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

    const showToolbarInline = !showToolbar;

    const config = {
      key: FROALA_PRODUCT_KEY,
      attribution: false,
      placeholder: 'Edit task details',
      multiLine: { multiline },
      charCounterCount: false,
      //   initOnClick: { initOnClick },
      toolbarInline: showToolbarInline,
      toolbarVisibleWithoutSelection: false,
      height: multiline ? 100 : 30,
      heightMax: multiline ? 150 : 30,
      toolbarButtons: showToolbar
        ? [
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
            // 'lineHeight',
            '|',
            'insertLink',
            // 'emoticons',
            // 'undo',
            // 'redo',
            // 'trackChanges',
            // 'markdown',
          ]
        : [],
      events: {
        // eslint-disable-next-line func-names, object-shorthand, prettier/prettier
        'focus': function () {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          const value = this.html.get();
          //   console.log(`focus: ${value}`);
        },
        // eslint-disable-next-line func-names, object-shorthand, prettier/prettier
        // 'blur': function (e, editor) {
        'blur': function () {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          const value = this.html.get();
          //   console.log(`blur: ${value}`);
          const markdown = turndownService.turndown(value);
          onBlur(markdown);
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
