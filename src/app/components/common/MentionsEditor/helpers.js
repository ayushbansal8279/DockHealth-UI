import moment from 'moment';
import { isEmpty } from 'ramda';
import { EditorState, convertToRaw } from 'draft-js';
import { createMentionEntities } from './create-mention-entities';

export const SUGGESTIONS_PLACEHOLDER = {
  name: '',
  identifier: '',
  type: 'DEFAULT',
};

export const getFormattedAge = ({ dob }) => {
  if (!dob) {
    return '';
  }

  const yearsOld = moment().diff(moment(dob), 'years');

  if (yearsOld < 0) {
    return '';
  }

  const yearsLabel = yearsOld === 1 ? 'yr' : 'yrs';

  return `${yearsOld} ${yearsLabel}`;
};

export const mapPatientsToSuggestions = patients =>
  patients.map(({ patientIdentifier, firstName, lastName, dob, mrn }) => ({
    identifier: patientIdentifier,
    name: `${firstName} ${lastName}`,
    age: getFormattedAge({ dob }),
    mrn,
  }));

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
