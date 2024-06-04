/* eslint-disable unicorn/no-this-assignment */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable react/no-this-in-sfc */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import FroalaEditor from 'react-froala-wysiwyg';
import { getListMembersByName } from 'api/task-list-api';
import { getUsersByName } from 'api/user-api';
import MarkdownIt from 'markdown-it';
import Tribute from 'tributejs';
import { FieldCharacterLimit } from 'helpers/field-type-helpers';
import { getPatientsByCriteria } from 'api/patients-api';
import { markdownItUnderline } from './helpers';
import 'tributejs/dist/tribute.css';
import './styles.css';
import { mapPatientsToSuggestions } from '../TextEditor/helpers';
import turndownService from './TurndownServiceSingleton';
import { dateFormatter } from '@/app/helpers/date-formatter';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(markdownItUnderline);

md.linkify.set({ fuzzyEmail: false, fuzzyLink: false });

const FROALA_PRODUCT_KEY =
  'MZC1rE1D4D3I4A16B11D8jF1QUg1Xc2OZE1ABVJRDRNGGUH1ITrA1C7A6D5E1D4D4E1B10D7==';

const fetchPatientsWithDebounce = debounce(
  (mentionString, setPatientSuggestions) => {
    if (mentionString) {
      getPatientsByCriteria(mentionString).then((fetchedPatients) => {
        const formattedPatients = mapPatientsToSuggestions(fetchedPatients);
        setPatientSuggestions(formattedPatients);
      });
    }
  },
  300,
);

const fetchMemberesWithDebounce = (taskListIdentifier) =>
  debounce((mentionString, setMemberSuggestions) => {
    if (mentionString) {
      if (taskListIdentifier) {
        getListMembersByName(taskListIdentifier, mentionString).then(
          (fetchedUsers) => {
            setMemberSuggestions(fetchedUsers);
          },
        );
      } else {
        getUsersByName(mentionString).then((fetchedUsers) =>
          setMemberSuggestions(fetchedUsers),
        );
      }
    }
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

const RichTextEditor = ({
  value: initialValue, // initial value
  disableToolbar = false,
  showToolbar = true, // dynamic show/hide toolbar
  showToolbarInline = false,
  focus = false,
  reset = false,
  readonly,
  onFocus = () => {},
  onBlur = () => {},
  onChange = () => {},
  onKeyEnter = () => {},
  onKeyEscape,
  placeholder = '',
  multiline = true,
  characterLimit = FieldCharacterLimit.RICH_TEXT,
  showCharCount = false,
  initOnClick = false,
  taskListIdentifier,
  mentions,
}) => {
  const [rawTextState, setRawTextState] = useState(initialValue);
  const [editor, setEditor] = useState(null);

  const processMarkdownValue = useCallback(
    (value) => {
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
          processedValue = processedValue.replace(
            `#{${mentionInfo.identifier}}`,
            `<span class="fr-deletable fr-tribute" data-patient-mention="${mentionInfo.identifier}"><a>#${mentionInfo.name}</a></span>`,
          );
        }
      }
      return processedValue || '';
    },
    [mentions],
  );

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
  }, [editorState, initialValue, mentions, processMarkdownValue]);

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
  }, [reset, initialValue, mentions, processMarkdownValue]);

  const membersTribute = useMemo(() => {
    return new Tribute({
      trigger: '@',
      values: fetchMemberesWithDebounce(taskListIdentifier),
      menuShowMinLength: 0,
      allowSpaces: true,
      requireLeadingSpace: true,
      lookup: 'name',
      searchOpts: {
        skip: true, // true will skip local search, useful if doing server-side search
      },
      containerClass: 'tribute-container', // class added to the menu container
      itemClass: '', // class added to each list item
      selectClass: 'highlight', // class added in the flyout menu for active item
      menuItemTemplate(item) {
        const option = item.original;
        return `<div style="width: 250px;">
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
      selectTemplate(item) {
        return `<span class="fr-deletable fr-tribute" data-people-mention="${item?.original.identifier}"><a>@${item?.original.name}</a></span>`;
      },
    });
  }, [taskListIdentifier]);

  const patientsTribute = useMemo(() => {
    return new Tribute({
      trigger: '#',
      values: fetchPatientsWithDebounce,
      menuShowMinLength: 0,
      allowSpaces: true,
      requireLeadingSpace: true,
      lookup: 'name',
      searchOpts: {
        skip: true, // true will skip local search, useful if doing server-side search
      },
      containerClass: 'tribute-container', // class added to the menu container
      itemClass: '', // class added to each list item
      selectClass: 'highlight', // class added in the flyout menu for active item
      menuItemTemplate(item) {
        const option = item.original;
        return `<div style="display: flex; padding-left: 10px; padding-right: 10px;">
          <span style="
            display: inline-block;
            width: 200px;
            color: ${palette.mediumGrey};
            font-size: ${fontSizes.regular};
            font-weight: ${fontWeights.light};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;"
          >
            ${option.name}
          </span>
          <span style="
            display: inline-block;
            width: 150px;
            color: ${option.dob ? palette.mediumGrey : palette.coolGrey1};
            font-size: ${fontSizes.regular};
            font-weight: ${fontWeights.light};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;"
          >
            ${
              option.dob ? dateFormatter(option.dob, 'MMM d, yyyy') : '(No DOB)'
            }
          </span>
          <span style="
            display: inline-block;
            width: 80px;
            color: ${option.mrn ? palette.mediumGrey : palette.coolGrey1};
            font-size: ${fontSizes.regular};
            font-weight: ${fontWeights.light};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;"
          >
            ${option.mrn ?? '(No MRN)'}
          </span>
        </div>`;
      },
      selectTemplate(item) {
        return `<span class="fr-deletable fr-tribute" data-patient-mention="${item?.original.identifier}"><a>#${item?.original.name}</a></span>`;
      },
    });
  }, []);

  const config = useMemo(
    () => ({
      key: FROALA_PRODUCT_KEY,
      attribution: false,
      placeholderText: placeholder,
      multiLine: multiline,
      charCounterCount: false,
      toolbarInline: showToolbarInline,
      toolbarVisibleWithoutSelection: true,
      heightMax: multiline ? 150 : 500,
      toolbarButtons: disableToolbar ? [] : toolbarOptions,
      events: {
        initialized() {
          if (readonly) {
            this.edit.off();
          }
          setEditor(this);
          const froalaEditor = this;
          membersTribute.attach(froalaEditor.el);
          patientsTribute.attach(froalaEditor.el);
          froalaEditor.events.on(
            'keydown',
            (e) => {
              if (
                (e.which === 13 || e.which === 10) &&
                (membersTribute.isActive || patientsTribute.isActive)
              ) {
                return false;
              }
            },
            true,
          );
        },
        'edit.off': () => {},
        focus() {
          onFocus();
        },
        blur(event) {
          const value = this.html.get();
          if (onBlur) {
            event.preventDefault();
            event.stopPropagation();
            const markdown = turndownService.turndown(value);
            onBlur(markdown);
          }
        },
        contentChanged() {
          const value = this.html.get();
          if (onChange) {
            const markdown = turndownService.turndown(value);
            onChange(markdown);
          }
        },
        keydown(keydownEvent) {
          if (keydownEvent.key === 'Enter') {
            if (
              !(keydownEvent.shiftKey || keydownEvent.ctrlKey) &&
              onKeyEnter?.length > 0
            ) {
              keydownEvent.preventDefault();
              keydownEvent.stopPropagation();
              const value = this.html.get();
              const markdown = turndownService.turndown(value);
              setEditorState('');
              this.html.set('');
              onKeyEnter(markdown);
            }
          } else if (
            keydownEvent.key === 'Escape' ||
            keydownEvent.key === 'Esc'
          ) {
            onKeyEscape?.();
          }
        },
        'url.linked': function (link) {
          // Do something here.
          console.log(link);
        },
        click(clickEvent) {
          if (
            clickEvent.currentTarget?.nodeName === 'A' &&
            clickEvent.currentTarget?.href
          ) {
            window.open(clickEvent.currentTarget?.href, '_blank', 'noreferrer');
          }
        },
        // 'link.beforeInsert': (link, text, attrs) => {
        //   console.log(link);
        //   console.log(text);
        //   console.log(attrs);
        // },
        'link.beforeInsert': function (link, text, attrs) {
          console.log(link);
          console.log(text);
          console.log(attrs);
        },
        'link.beforeRemove': function (link, text, attrs) {
          console.log(link);
          console.log(text);
          console.log(attrs);
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
    }),
    [
      disableToolbar,
      multiline,
      onBlur,
      onChange,
      onKeyEnter,
      placeholder,
      readonly,
      showToolbarInline,
      membersTribute,
      patientsTribute,
      onFocus,
      onKeyEscape,
    ],
  );

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
    if (editor && showToolbar) {
      editor.toolbar.show();
      editor.$second_tb?.show();
    }
  }, [editor, showToolbar]);

  return (
    <FroalaEditor
      tag="textarea"
      config={config}
      model={editorState}
      onModelChange={setEditorState}
      // onManualControllerReady={handleController}
    />
  );
};

export default RichTextEditor;
