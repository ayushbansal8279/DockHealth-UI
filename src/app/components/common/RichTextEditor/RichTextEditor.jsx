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
// import { useSelector } from 'react-redux';
// import debounce from 'lodash.debounce';
// import MenuList from '@mui/material/MenuList';
// import MenuItem from '@mui/material/MenuItem';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
// import { renderToString } from 'react-dom/server';
import { getPatientsByCriteria } from 'api/patients-api';
import { getListMembersByName } from 'api/task-list-api';
// import UserMention from 'components/common/TextEditor/UserMention/UserMention';
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
import Tribute from 'tributejs';
// import { Avatar } from './styled';
import 'tributejs/dist/tribute.css';
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
      value: initialValue, // initial value
      height = 100,
      // maxHeight,
      disableToolbar = false,
      showToolbar = true, // dynamic show/hide toolbar
      showToolbarInline = false,
      focus = false,
      reset = false,
      // manualInitialize = false,
      // showToolbarOnEdit = true,
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
      placeholder = '',
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
      taskListIdentifier,
    },
    outerReference,
  ) => {
    const [rawTextState, setRawTextState] = useState(initialValue);

    const [editorState, setEditorState] = useState(
      md.render(rawTextState || ''),
    );

    useEffect(() => {
      if (editorState !== '' && initialValue && initialValue === '') {
        setEditorState('');
      }
    }, [initialValue, editorState]);

    useEffect(() => {
      if (reset) {
        setEditorState(initialValue);
      }
    }, [reset, initialValue]);

    const [editor, setEditor] = useState(null);
    // const [initControls, setInitControls] = useState(null);

    // const handleController = useCallback(
    //   (initControls_) => {
    //     if (manualInitialize) {
    //       setInitControls(initControls_);
    //     }
    //   },
    //   [manualInitialize],
    // );

    // const showToolbarInline = !showToolbar;

    const tribute = new Tribute({
      trigger: '@',
      // eslint-disable-next-line func-names, object-shorthand, unicorn/prevent-abbreviations
      values: function (mentionString, cb) {
        if (taskListIdentifier && mentionString) {
          getListMembersByName(taskListIdentifier, mentionString).then(
            (fetchedUsers) => {
              // fetchedUsers.map((user) => {
              //   images[user.identifier] =
              //     getUserAvatarThumbnailUrl(user) ||
              //     (isUserGroup(user)
              //       ? user.initials?.[0].toUpperCase()
              //       : user.initials?.toLowerCase());
              // });
              cb(fetchedUsers);
            },
          );
        }
      },
      menuShowMinLength: 0,
      allowSpaces: true,
      requireLeadingSpace: false,
      lookup: 'name',
      searchOpts: {
        skip: true, // true will skip local search, useful if doing server-side search
      },
      containerClass: 'tribute-container', // class added to the menu container
      itemClass: '', // class added to each list item
      selectClass: 'highlight', // class added in the flyout menu for active item
      // eslint-disable-next-line func-names, object-shorthand
      menuItemTemplate: function (item) {
        const option = item.original;
        // return `<span className="text">${option.name}</span>`;
        // return renderToString(
        //   <MenuItem
        //     key={option.identifier}
        //     ref={option.setRefElement}
        //     role="option"
        //     // aria-selected={isSelected}
        //     // id={`typeahead-item-${index}`}
        //   >
        //     {/* <Avatar $color={option.color}>
        //       {option.picture?.length > 2 ? (
        //         <img src={option.picture} alt="avatar" />
        //       ) : (
        //         option.picture
        //       )}
        //     </Avatar> */}
        //     {/* <span className="text">
        //       {option.name} - {option.identifier}
        //     </span> */}
        //     <UserMention mention={option} />
        //   </MenuItem>,
        // );
        return `<div>
          <div class="profile">
              <img src=${
                import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
              }user/profilePicture/${
          option.identifier
        }?UserPictureType=PROFILE_THUMBNAIL alt="" />
          </div>
          <p 
            style="margin-bottom: 0;
            color: ${palette.mediumGrey};
            font-size: ${fontSizes.regular};
            font-weight: ${fontWeights.light};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;">
            ${option.name}
          </p>
        </div>`;
      },
      // eslint-disable-next-line func-names, object-shorthand
      noMatchTemplate: function () {
        return '<span>@People</span>';
      },
      // eslint-disable-next-line func-names, object-shorthand
      selectTemplate: function (item) {
        return `<span class="fr-deletable fr-tribute"><a>@${item.original.name}</a></span>`;
      },
    });

    const config = {
      key: FROALA_PRODUCT_KEY,
      attribution: false,
      placeholderText: placeholder,
      multiLine: multiline,
      charCounterCount: false,
      toolbarInline: showToolbarInline,
      toolbarVisibleWithoutSelection: true,
      height: multiline ? { height } : 30,
      heightMax: multiline ? 150 : 30,
      toolbarButtons: disableToolbar ? [] : toolbarOptions,
      events: {
        // eslint-disable-next-line prettier/prettier, func-names
        'initialized' : function() {
          if (readonly) {
            // eslint-disable-next-line react/no-this-in-sfc, no-shadow
            this.edit.off();
          }
          setEditor(this);
          // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
          const froalaEditor = this;
          tribute.attach(froalaEditor.el);
          froalaEditor.events.on(
            'keydown',
            // eslint-disable-next-line unicorn/prevent-abbreviations
            (e) => {
              if ((e.which === 13 || e.which === 10) && tribute.isActive) {
                return false;
              }
            },
            true,
          );
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

    if (initOnClick) {
      config.initOnClick = true;
    }

    useEffect(() => {
      if (editor) {
        if (readonly) {
          editor.edit.off();
        } else {
          editor.edit.on();
        }
      }
    }, [editor, readonly]);

    useEffect(() => {
      if (editor) {
        if (showToolbar) {
          editor.toolbar.show();
          editor.$second_tb?.show();
        } else {
          editor.toolbar.hide();
          editor.$second_tb?.hide();
        }
      }
    }, [editor, showToolbar]);

    // useEffect(() => {
    //   if (editor && focus) {
    //     editor.events.focus();
    //   }
    // }, [editor, focus]);

    return (
      // <ClickAwayListener onClickAway={handleClickAway}>
      <FroalaEditor
        tag="textarea"
        config={config}
        model={editorState}
        onModelChange={setEditorState}
        // onManualControllerReady={handleController}
      />
      // </ClickAwayListener>
    );
  },
);

export default RichTextEditor;
