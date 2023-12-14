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
import { renderToString } from 'react-dom/server';
// import { useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import { getPatientsByCriteria } from 'api/patients-api';
import { getListMembersByName } from 'api/task-list-api';
import FroalaEditor from 'react-froala-wysiwyg';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
import Tribute from 'tributejs';
import { FieldCharacterLimit } from 'helpers/field-type-helpers';
import { markdownItUnderline } from './helpers';
// import { Avatar } from './styled';
import 'tributejs/dist/tribute.css';
import './styles.css';
import {
  SUGGESTIONS_PLACEHOLDER,
  mapPatientsToSuggestions,
} from '../TextEditor/helpers';
import PatientsSuggestionsPopover from '../TextEditor/PatientsSuggestionsPopover/PatientsSuggestionsPopover';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(markdownItUnderline);

let turndownService = new TurndownService();

// eslint-disable-next-line func-names
TurndownService.prototype.escape = function (string) {
  return string;
};

turndownService = turndownService.addRule('people-mention', {
  filter: ['span'],
  // eslint-disable-next-line func-names, object-shorthand
  replacement: function (content, node, options) {
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    if (node.attributes['data-people-mention']) {
      // eslint-disable-next-line sonarjs/prefer-immediate-return
      const alteredValue = `@{${node.attributes['data-people-mention'].nodeValue}}`;
      return alteredValue;
    }
    return content;
  },
});

turndownService = turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  // eslint-disable-next-line func-names, object-shorthand
  replacement: function (content) {
    return `~~${content}~~`;
  },
});

turndownService = turndownService.addRule('underline', {
  filter: ['u'],
  // eslint-disable-next-line func-names, object-shorthand
  replacement: function (content) {
    return `__${content}__`;
  },
});

const FROALA_PRODUCT_KEY =
  'MZC1rE1D4D3I4A16B11D8jF1QUg1Xc2OZE1ABVJRDRNGGUH1ITrA1C7A6D5E1D4D4E1B10D7==';

const fetchPatientsWithDebounce = debounce((value, setPatientSuggestions) => {
  console.log(`inside of debounce:`, value);
  getPatientsByCriteria(value).then((fetchedPatients) => {
    console.log(`returned value from debounce:`, fetchedPatients);

    const formattedPatients = mapPatientsToSuggestions(fetchedPatients);
    setPatientSuggestions(
      formattedPatients.length > 0
        ? formattedPatients
        : [SUGGESTIONS_PLACEHOLDER],
    );
  });
}, 300);

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
  // 'outdent',
  // 'indent',
  'insertLink',
  // 'lineHeight',
  '|',
  // 'emoticons',
  // 'undo',
  // 'redo',
  // 'trackChanges',
  // 'markdown',
];

const processMarkdownValue = (value, mentions) => {
  if (!value || value === '') {
    return value;
  }
  let mdValue = value.replace(/\\+\*/g, '*');
  mdValue = mdValue.replace(/\n {2}\n/g, '<p><br/></p>');
  const htmlValue = md.render(mdValue || '');
  let processedValue = htmlValue;
  if (mentions && value !== '') {
    for (const mentionInfo of mentions) {
      processedValue = processedValue.replace(
        `@{${mentionInfo.identifier}}`,
        `<span class="fr-deletable fr-tribute" data-people-mention="${mentionInfo.identifier}"><a>@${mentionInfo.name}</a></span>`,
      );
    }
  }
  return processedValue || '';
};

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
      // fullHeight,
      readonly,
      // onFocus = () => {},
      onBlur = () => {},
      onChange = () => {},
      onKeyEnter = () => {},
      // onAddMention = () => {},
      placeholder = '',
      // highlightedValues,
      multiline = true,
      characterLimit = FieldCharacterLimit.RICH_TEXT,
      showCharCount = false,
      initOnClick = false,
      taskListIdentifier,
      mentions,
    },
    outerReference,
  ) => {
    const [rawTextState, setRawTextState] = useState(initialValue);

    const [editorState, setEditorState] = useState(
      processMarkdownValue(rawTextState || '', mentions),
    );

    useEffect(() => {
      if (
        (editorState === undefined || editorState === '') &&
        initialValue !== undefined &&
        initialValue !== null &&
        initialValue !== ''
      ) {
        setEditorState(processMarkdownValue(initialValue || '', mentions));
      }
    }, [editorState, initialValue, mentions]);

    useEffect(() => {
      if (
        editorState !== '' &&
        initialValue !== undefined &&
        initialValue === ''
      ) {
        setEditorState('');
      }
    }, [editorState, initialValue]);

    useEffect(() => {
      if (reset) {
        setEditorState(processMarkdownValue(initialValue || '', mentions));
      }
    }, [reset, initialValue, mentions]);

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
      collection: [
        {
          trigger: '@',
          // eslint-disable-next-line func-names, object-shorthand, unicorn/prevent-abbreviations
          values: function (mentionString, cb) {
            console.log(`mention string: ${mentionString}`);
            if (taskListIdentifier && mentionString) {
              getListMembersByName(taskListIdentifier, mentionString).then(
                (fetchedUsers) => {
                  console.log(`fetched users:`, fetchedUsers);
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
            console.log(`menu template item:`, item);
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
          // noMatchTemplate: function () {
          //   return '<span>@People</span>';
          // },
          // eslint-disable-next-line func-names, object-shorthand
          selectTemplate: function (item) {
            console.log(`select template called ${item}`);
            return `<span class="fr-deletable fr-tribute" data-people-mention="${item?.original.identifier}"><a>@${item?.original.name}</a></span>`;
          },
        },
        {
          trigger: '#',
          // eslint-disable-next-line func-names, object-shorthand, unicorn/prevent-abbreviations
          values: function (mentionString, cb) {
            console.log(`#mention string: ${mentionString}`);
            if (mentionString) {
              fetchPatientsWithDebounce(mentionString, cb);
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
          // noMatchTemplate: function () {
          //   return '<span>@People</span>';
          // },
          // eslint-disable-next-line func-names, object-shorthand
          selectTemplate: function (item) {
            console.log(`select template called ${item}`);
            return `<span class="fr-deletable fr-tribute" data-people-mention="${item?.original.identifier}"><#>@${item?.original.name}</a></span>`;
          },
        },
      ],
    });

    const config = {
      key: FROALA_PRODUCT_KEY,
      attribution: false,
      placeholderText: placeholder,
      multiLine: multiline,
      charCounterCount: !!showToolbar,
      charCounterMax: characterLimit,
      toolbarInline: showToolbarInline,
      toolbarVisibleWithoutSelection: true,
      // height: multiline ? { height } : 30,
      heightMax: multiline ? 150 : 500,
      toolbarButtons: disableToolbar ? [] : toolbarOptions,
      events: {
        // eslint-disable-next-line prettier/prettier, func-names
        initialized() {
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
        'edit.off': function () {},
        // eslint-disable-next-line prettier/prettier, func-names
        focus() {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          // const value = this.html.get();
          // console.log(`focus: ${value}`);
        },
        // eslint-disable-next-line prettier/prettier, func-names
        blur(event) {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          const value = this.html.get();
          // console.log(`blur: ${value}`);
          if (onBlur) {
            event.preventDefault();
            event.stopPropagation();
            const markdown = turndownService.turndown(value);
            onBlur(markdown);
          }
        },
        // eslint-disable-next-line prettier/prettier, func-names
        contentChanged() {
          // eslint-disable-next-line react/no-this-in-sfc, no-shadow
          const value = this.html.get();
          // console.log(`change: ${value}`);
          if (onChange) {
            const markdown = turndownService.turndown(value);
            onChange(markdown);
          }
        },
        // eslint-disable-next-line prettier/prettier, func-names
        keydown(keydownEvent) {
          if (keydownEvent.keyCode === 13) {
            if (
              !(keydownEvent.shiftKey || keydownEvent.ctrlKey) &&
              onKeyEnter?.length > 0
            ) {
              keydownEvent.preventDefault();
              keydownEvent.stopPropagation();
              // eslint-disable-next-line react/no-this-in-sfc, no-shadow
              const value = this.html.get();
              const markdown = turndownService.turndown(value);
              setEditorState('');
              // eslint-disable-next-line react/no-this-in-sfc
              this.html.set('');
              // eslint-disable-next-line no-param-reassign
              onKeyEnter(markdown);
            } else {
              // do nothing
            }
          }
        },
        'url.linked': function (link) {
          // Do something here.
          // this is the editor instance.
          // console.log('url.linked: '+this);
        },
        click(clickEvent) {
          // Do something here.
          // this is the editor instance.
          // console.log(this);
          if (
            clickEvent.currentTarget?.nodeName === 'A' &&
            clickEvent.currentTarget?.href
          ) {
            window.open(clickEvent.currentTarget?.href, '_blank', 'noreferrer');
          }
        },
      },
      linkNoReferrer: false,
      linkText: true,
      linkStyles: {
        class1: 'editor-links',
      },
      linkAlwaysBlank: true,
      linkAlwaysNoFollow: false,
      listAdvancedTypes: true,
      linkAutoPrefix: 'https://',
      linkConvertEmailAddress: false,
      linkEditButtons: ['linkOpen', 'linkEdit'],
      linkList: [],
      fontSizeSelection: false,
      paragraphFormatSelection: false,
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
          // editor.toolbar.hide();
          // editor.$second_tb?.hide();
        }
      }
    }, [editor, showToolbar]);

    // useEffect(() => {
    //   if (editor && focus) {
    //     editor.events.focus();
    //   }
    // }, [editor, focus]);

    return (
      <FroalaEditor
        tag="textarea"
        config={config}
        model={editorState}
        onModelChange={setEditorState}
        // onManualControllerReady={handleController}
      />
    );
  },
);

export default RichTextEditor;
