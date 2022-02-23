/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { isEmpty } from 'ramda';
import {
  EditorState,
  convertToRaw,
  CompositeDecorator,
  SelectionState,
} from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import { createMentionEntities } from './create-mention-entities';
import { HighlightedElement } from './styled';

export const SUGGESTIONS_PLACEHOLDER = {
  name: '',
  identifier: '',
  type: 'DEFAULT',
};

export const mapPatientsToSuggestions = patients =>
  patients.map(
    ({ patientIdentifier, firstName, middleName, lastName, dob, mrn }) => ({
      identifier: patientIdentifier,
      name: middleName
        ? `${lastName}, ${firstName} ${middleName?.slice(0, 1)}`
        : `${lastName}, ${firstName}`,
      dob,
      mrn,
    }),
  );

export const mapUsersToSuggestions = users =>
  users.map(user => ({
    ...user,
    identifier: user.identifier,
    name: user.name,
  }));

const substituteNameForIdInText = (rawText, mentions) => {
  let textWithIds = rawText;
  mentions.forEach(({ type, name, identifier }) => {
    if (type === '#mention') {
      textWithIds = textWithIds.replace(
        new RegExp(`#${name}`, 'g'),
        `#{${identifier}}`,
      );
    } else if (type === 'mention' && name && name !== '') {
      textWithIds = textWithIds.replace(
        new RegExp(`@${name}`, 'g'),
        `@{${identifier}}`,
      );
    }
  });
  return textWithIds;
};

export const convertFromEditorStateToOutput = (editorState, handleRichText) => {
  const stateContent = convertToRaw(editorState.getCurrentContent());

  const textBlocks = stateContent.blocks.map(block => block.text);
  const rawText = textBlocks.join('\n');
  const mentions = Object.values(stateContent.entityMap)?.map(entity => ({
    ...entity.data.mention,
    type: entity.type,
  }));

  const extendedStyleItems = {
    STRIKETHROUGH: {
      open: function open() {
        return '~~';
      },

      close: function close() {
        return '~~';
      },
    },
    UNDERLINE: {
      open: function open() {
        return '++';
      },

      close: function close() {
        return '++';
      },
    },
  };

  const textValue = handleRichText
    ? draftToMarkdown(stateContent, {
        styleItems: extendedStyleItems,
      })
    : rawText;

  return {
    rawText,
    tokenizedText: substituteNameForIdInText(textValue, mentions),
    mentions,
  };
};

const HighlightedComponent = ({ children }) => {
  return <HighlightedElement>{children}</HighlightedElement>;
};

function findWithRegex(words, contentBlock, callback) {
  const text = contentBlock.getText();

  words.forEach(word => {
    const matches = [...text.matchAll(new RegExp(word, 'gi'))];
    matches.forEach(match =>
      callback(match.index, match.index + match[0].length),
    );
  });
}

const handleStrategy = words => (contentBlock, callback) => {
  findWithRegex(words, contentBlock, callback);
};

export const createHighlightDecorator = words =>
  new CompositeDecorator([
    {
      strategy: handleStrategy(words),
      component: HighlightedComponent,
    },
  ]);

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
}

const Link = ({ contentState, entityKey, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      onClick={() => window.open(url, '_blank')}
      href={url}
      target="_blank"
      style={{
        link: {
          color: '#3b5998',
          textDecoration: 'underline',
        },
      }}
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const createLinkDecorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export const convertToEditorState = state => {
  if (!state || isEmpty(state) || !state.rawText) {
    return EditorState.createEmpty();
  }

  return EditorState.createWithContent(
    createMentionEntities(
      state.tokenizedText,
      state.rawText,
      state.mentions || [],
      state.handleRichText || false,
    ),
  );
};

export const isEditorStateEmpty = state => {
  if (!state) return true;
  const rawState = convertToRaw(state?.getCurrentContent());
  const firstBlock = rawState?.blocks?.[0];
  if (firstBlock && firstBlock.text === '') {
    return true;
  }
  return false;
};

export const moveSelectionToEnd = editorState => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const key = blockMap.last().getKey();
  const length = blockMap.last().getLength();
  const selection = new SelectionState({
    anchorKey: key,
    anchorOffset: length,
    focusKey: key,
    focusOffset: length,
  });
  return EditorState.forceSelection(editorState, selection);
};
