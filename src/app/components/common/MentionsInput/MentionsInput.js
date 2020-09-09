import React, { useState, useRef } from 'react';

import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from 'draft-js-mention-plugin';
import './editorStyles.css';
import peopleMentions from './people';
import patientMentions from './patient';
import palette from 'styles/palette';
import { Popper } from '@material-ui/core';
import Highlighter from 'react-highlight-words';

const MemberEntry = props => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars

    // eslint-disable-line no-unused-vars
    isFocused,
    ...parentProps
  } = props;

  return (
    <div
      {...parentProps}
      style={{ backgroundColor: isFocused ? palette.coolGrey1 : 'transparent' }}
    >
      <div style={{ display: 'flex', padding: '10px' }}>
        <div style={{ height: 20, width: 20 }}>
          <img
            src={mention.avatar}
            style={{ width: '100%', height: '100%' }}
            role="presentation"
            alt=""
          />
        </div>

        <div>
          <Highlighter
            highlightStyle={{ fontWeight: 'bold', background: 'none' }}
            searchWords={searchValue?.toLowerCase().split(/\s+/)}
            autoEscape
            textToHighlight={mention.name}
          />
        </div>
      </div>
    </div>
  );
};

const PatientEntry = ({ mention, searchValue, isFocused, ...parentProps }) => {
  return (
    <div
      {...parentProps}
      style={{ backgroundColor: isFocused ? palette.coolGrey1 : 'transparent' }}
    >
      <div style={{ display: 'flex', padding: '10px' }}>
        <div style={{ height: 20, width: 20 }}>
          <img
            src={mention.avatar}
            style={{ width: '100%', height: '100%' }}
            role="presentation"
            alt=""
          />
        </div>

        <div>
          <Highlighter
            highlightStyle={{ fontWeight: 'bold', background: 'none' }}
            searchWords={searchValue?.toLowerCase().split(/\s+/)}
            autoEscape
            textToHighlight={mention.name}
          />
        </div>
      </div>
    </div>
  );
};

const MemberMention = ({ mention, className, children }) => {
  const reference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  console.log('hovered', isHovered);
  return (
    <span>
      <a
        ref={reference}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: 'rgba(7, 74, 134, 0.07)',
          color: palette.darkBlue,
          cursor: 'pointer',
        }}
        className={className}
        href={mention.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <Popper
          anchorEl={reference.current}
          open={isHovered}
          position="bottom-start"
          style={{ zIndex: 2000 }}
        >
          <div style={{ padding: '100px 20px', backgroundColor: 'red' }}>
            {mention.name}
          </div>
        </Popper>
      </a>
    </span>
  );
};

const PatientMention = ({ mention, className, children, ...props }) => {
  const reference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  console.log('props', props);
  console.log('mention', mention);

  return (
    <a
      className={className}
      ref={reference}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'rgba(7, 74, 134, 0.07)',
        color: palette.darkBlue,
        cursor: 'pointer',
      }}
      href={mention.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={isHovered}
        position="bottom-start"
        style={{ zIndex: 2000 }}
      >
        <div style={{ padding: '100px 20px', backgroundColor: 'red' }}>
          {mention.name}
        </div>
      </Popper>
    </a>
  );
};

const MentionsInput = () => {
  const peopleMentionPlugin = useRef(
    createMentionPlugin({
      mentionPrefix: '@',
      mentionTrigger: '@',
      mentionComponent: MemberMention,
      positionSuggestions: props => {
        const rightPosition =
          window.innerWidth - props.decoratorRect.left - 200;

        return {
          position: 'fixed',
          top: props.decoratorRect.bottom + 5,
          right: rightPosition,
          left: 'auto',
          bottom: 'auto',
          background: 'indigo',
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
      positionSuggestions: props => {
        const rightPosition =
          window.innerWidth - props.decoratorRect.left - 200;

        return {
          position: 'fixed',
          top: props.decoratorRect.bottom + 5,
          right: rightPosition,
          left: 'auto',
          bottom: 'auto',
          background: 'indigo',
          width: 200,
          zIndex: 1001,
        };
      },
    }),
  );

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [peopleSuggestions, setPeopleSuggestions] = useState(peopleMentions);
  const [patientSuggestions, setPatientSuggestions] = useState(patientMentions);
  const editor = useRef(null);

  const onChange = state => {
    setEditorState(state);
    console.log('state', convertToRaw(state.getCurrentContent()));
  };

  const onPeopleSearchChange = ({ value }) => {
    setPeopleSuggestions(defaultSuggestionsFilter(value, peopleMentions));
  };

  const onPatientSearchChange = ({ value }) => {
    setPatientSuggestions(defaultSuggestionsFilter(value, patientMentions));
  };

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
      />
      <PeopleMentionSuggestions
        onSearchChange={onPeopleSearchChange}
        suggestions={peopleSuggestions}
        onAddMention={onAddMention}
        entryComponent={MemberEntry}
      />
      <PatientsMentionSuggestions
        onSearchChange={onPatientSearchChange}
        suggestions={patientSuggestions}
        onAddMention={onAddMention}
        entryComponent={PatientEntry}
      />
    </div>
  );
};

export default MentionsInput;
