// import React from 'react';
// import isEmpty from 'ramda/src/isEmpty';
// import {
//   EditorState,
//   convertToRaw,
//   CompositeDecorator,
//   SelectionState,
//   convertFromRaw,
// } from 'draft-js';
// import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
// import { createMentionEntities } from './create-mention-entities';
// import { HighlightedElement } from './styled';
// import Placeholder from './AddOns/Placeholder/Placeholder';

// const extendedStyleItems = {
//   STRIKETHROUGH: {
//     open: function open() {
//       return '~~';
//     },

//     close: function close() {
//       return '~~';
//     },
//   },
//   UNDERLINE: {
//     open: function open() {
//       return '++';
//     },

//     close: function close() {
//       return '++';
//     },
//   },
// };

export const SUGGESTIONS_PLACEHOLDER = {
  name: '',
  identifier: '',
  type: 'DEFAULT',
};

export const mapPatientsToSuggestions = (patients) =>
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

export const mapUsersToSuggestions = (users) =>
  users.map((user) => ({
    ...user,
    identifier: user.identifier,
    name: user.name,
  }));

// const substituteNameForIdInText = (rawText, mentions) => {
//   let textWithIds = rawText;
//   for (const { type, name, identifier, meta } of mentions) {
//     if (type === '#mention') {
//       textWithIds = textWithIds.replace(
//         new RegExp(`#${name}`, 'g'),
//         `#{${identifier}}`,
//       );
//     } else if (type === 'mention' && name && name !== '') {
//       textWithIds = textWithIds.replace(
//         new RegExp(`@${name}`, 'g'),
//         `@{${identifier}}`,
//       );
//     }
//     if (type === 'PLACEHOLDER') {
//       textWithIds = textWithIds.replace(
//         new RegExp(`${name}`, 'g'),
//         `${meta}\n`,
//       );
//     }
//   }
//   return textWithIds;
// };

export const substituteNameForIdInTokenizedText = (rawText, mentions) => {
  let textWithIds = rawText;
  for (const { name, identifier } of mentions) {
    textWithIds = textWithIds.replace(
      new RegExp(` @{${identifier}}`, 'g'),
      ` ${name}`,
    );
  }
  return textWithIds;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const convertFromEditorStateToOutput = (editorState, handleRichText) => {
  // const stateContent = convertToRaw(editorState.getCurrentContent());
  // const textBlocks = stateContent.blocks.map((block) => block.text);

  // const rawText = textBlocks.join('\n');
  // const mentions = Object.values(stateContent.entityMap)?.map((entity) => ({
  //   ...entity.data.mention,
  //   ...entity.data,
  //   type: entity.type,
  // }));

  // const textValue = handleRichText
  //   ? draftToMarkdown(stateContent, {
  //       styleItems: extendedStyleItems,
  //       preserveNewlines: true,
  //     })
  //   : rawText;

  return {
    // rawText,
    // tokenizedText: substituteNameForIdInText(textValue, mentions),
    // mentions,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addStylesToText = (text) => {
  // const draftText = markdownToDraft(text, {
  //   styleItems: extendedStyleItems,
  //   preserveNewlines: true,
  // });
  // return convertFromRaw(draftText);
};

// const HighlightedComponent = ({ children }) => {
//   return <HighlightedElement>{children}</HighlightedElement>;
// };

// function findWithRegex(words, contentBlock, callback) {
//   const text = contentBlock.getText();

//   for (const word of words) {
//     const matches = [...text.matchAll(new RegExp(word, 'gi'))];
//     for (const match of matches)
//       callback(match.index, match.index + match[0].length);
//   }
// }

// const handleStrategy = (words) => (contentBlock, callback) => {
//   findWithRegex(words, contentBlock, callback);
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createHighlightDecorator = (words) => {};
// new CompositeDecorator([
//   {
//     strategy: handleStrategy(words),
//     component: HighlightedComponent,
//   },
// ]);

// function findLinkEntities(contentBlock, callback, contentState) {
//   contentBlock.findEntityRanges((character) => {
//     const entityKey = character.getEntity();
//     return (
//       entityKey !== null &&
//       contentState.getEntity(entityKey).getType() === 'LINK'
//     );
//   }, callback);
// }

// function findPlaceholders(contentBlock, callback, contentState) {
//   contentBlock.findEntityRanges((character) => {
//     const entityKey = character.getEntity();
//     return (
//       entityKey !== null &&
//       contentState.getEntity(entityKey).getType() === 'PLACEHOLDER'
//     );
//   }, callback);
// }

// const Link = ({ contentState, entityKey, children }) => {
//   const { url } = contentState.getEntity(entityKey).getData();
//   return (
//     <a
//       onClick={() => window.open(url, '_blank')}
//       href={url}
//       target="_blank"
//       style={{
//         link: {
//           color: '#3b5998',
//           textDecoration: 'underline',
//         },
//       }}
//       rel="noreferrer"
//     >
//       {children}
//     </a>
//   );
// };

// export const createLinkDecorator = new CompositeDecorator([
//   {
//     strategy: findLinkEntities,
//     component: Link,
//   },
// ]);

// export const createPlaceholderDecorator = new CompositeDecorator([
//   {
//     strategy: findPlaceholders,
//     component: Placeholder,
//   },
// ]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const convertToEditorState = (state) => {
  // if (!state || isEmpty(state) || !state.rawText) {
  //   return EditorState.createEmpty();
  // }
  // return EditorState.createWithContent(
  //   createMentionEntities(
  //     state.tokenizedText,
  //     state.rawText,
  //     state.mentions || [],
  //     state.handleRichText || false,
  //   ),
  // );
};

export const isEditorStateEmpty = (state) => {
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (!state) return true;
  // const rawState = convertToRaw(state?.getCurrentContent());
  // const firstBlock = rawState?.blocks?.[0];
  // if (firstBlock && firstBlock.text === '') {
  //   return true;
  // }
  return false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const moveSelectionToEnd = (editorState) => {
  // const content = editorState.getCurrentContent();
  // const blockMap = content.getBlockMap();
  // const key = blockMap.last().getKey();
  // const length = blockMap.last().getLength();
  // const selection = new SelectionState({
  //   anchorKey: key,
  //   anchorOffset: length,
  //   focusKey: key,
  //   focusOffset: length,
  // });
  // return EditorState.forceSelection(editorState, selection);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const countCharakters = (state) => {
  // const { tokenizedText } = convertFromEditorStateToOutput(state, true);
  // return tokenizedText.length || 0;
};
