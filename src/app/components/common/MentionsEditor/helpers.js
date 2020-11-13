import React from 'react';
import { isEmpty } from 'ramda';
import { EditorState, convertToRaw, CompositeDecorator } from 'draft-js';
import { createMentionEntities } from './create-mention-entities';
import { HighlightedElement } from './styled';

export const SUGGESTIONS_PLACEHOLDER = {
  name: '',
  identifier: '',
  type: 'DEFAULT',
};

export const mapPatientsToSuggestions = patients =>
  patients.map(
    ({ patientIdentifier, firstName, middleName, lastName, age, mrn }) => ({
      identifier: patientIdentifier,
      name: middleName
        ? `${lastName}, ${firstName} ${middleName?.slice(0, 1)}`
        : `${lastName}, ${firstName}`,
      age,
      mrn,
    }),
  );

export const mapPeopleToSuggestions = people =>
  people.map(person => ({
    ...person,
    identifier: person.userIdentifier,
    name: person.userName,
  }));

const substituteNameForIdInText = (rawText, mentions) => {
  let textWithIds = rawText;
  mentions.forEach(({ type, name, identifier }) => {
    if (type === '#mention') {
      textWithIds = textWithIds.replace(
        new RegExp(`#${name}`, 'g'),
        `#{${identifier}}`,
      );
    } else if (type === 'mention') {
      textWithIds = textWithIds.replace(
        new RegExp(`@${name}`, 'g'),
        `@{${identifier}}`,
      );
    }
  });
  return textWithIds;
};

export const convertFromEditorStateToOutput = editorState => {
  const stateContent = convertToRaw(editorState.getCurrentContent());
  const textBlocks = stateContent.blocks.map(block => block.text);
  const rawText = textBlocks.join('\n');
  const mentions = Object.values(stateContent.entityMap)?.map(entity => ({
    ...entity.data.mention,
    type: entity.type,
  }));

  return {
    rawText,
    tokenizedText: substituteNameForIdInText(rawText, mentions),
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

export const convertToEditorState = state => {
  if (!state || isEmpty(state) || !state.rawText) {
    return EditorState.createEmpty();
  }

  return EditorState.createWithContent(
    createMentionEntities(
      state.tokenizedText,
      state.rawText,
      state.mentions || [],
    ),
  );
};
