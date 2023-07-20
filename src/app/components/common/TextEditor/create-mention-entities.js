// import { convertFromRaw, convertToRaw, ContentState } from 'draft-js';
// import { markdownToDraft } from 'markdown-draft-js';

// const getIndicesOf = (searchValue, text, caseSensitive) => {
//   let temporaryText = text;
//   let temporarySearchValue = searchValue;
//   const searchValueLength = temporarySearchValue.length;
//   if (searchValueLength === 0) {
//     return [];
//   }
//   let startIndex = 0;
//   let index;
//   const indices = [];
//   if (!caseSensitive) {
//     temporaryText = temporaryText.toLowerCase();
//     temporarySearchValue = temporarySearchValue.toLowerCase();
//   }

//   while (
//     // eslint-disable-next-line no-cond-assign
//     (index = temporaryText.indexOf(temporarySearchValue, startIndex)) > -1
//   ) {
//     indices.push(index);
//     startIndex = index + searchValueLength;
//   }
//   return indices;
// };

// const getEntityRanges = (text, mentionName, mentionKey) => {
//   const indices = getIndicesOf(mentionName, text);
//   if (indices.length > 0) {
//     return indices.map((offset) => ({
//       key: mentionKey,
//       length: mentionName.length,
//       offset,
//     }));
//   }

//   return null;
// };

export const createMentionEntitiesFromRawText = () =>
  // text,
  // tags,
  // handleRichText,
  {
    // const rawContent = handleRichText
    //   ? markdownToDraft(text, {
    //       blockStyles: {
    //         ins_open: 'UNDERLINE',
    //         del_open: 'STRIKETHROUGH',
    //       },
    //       remarkableOptions: {
    //         enable: {
    //           inline: ['ins', 'links'],
    //         },
    //       },
    //       preserveNewlines: true,
    //     })
    //   : convertToRaw(ContentState.createFromText(text));
    // const rawState = tags.map((tag) => {
    //   const { mentionType, ...data } = tag;
    //   return {
    //     type: mentionType === '@' ? 'mention' : `${mentionType}mention`,
    //     mutability: 'SEGMENTED',
    //     data: { mention: { ...data } },
    //   };
    // });
    // for (const element of rawState) {
    //   rawContent.entityMap[element?.data?.mention?.identifier] = element;
    // }
    // const newBlocks = rawContent.blocks
    //   .filter((block) => !!block)
    //   .map((block) => {
    //     const ranges = [];
    //     for (const { mentionType, name, identifier } of tags) {
    //       const entityRanges = getEntityRanges(
    //         block?.text || '',
    //         `${mentionType}${name}`,
    //         identifier,
    //       );
    //       if (entityRanges) {
    //         ranges.push(...entityRanges);
    //       }
    //     }
    //     return {
    //       ...block,
    //       entityRanges: [...(block.entityRanges || []), ...ranges],
    //     };
    //   });
    // return convertFromRaw({ ...rawContent, blocks: newBlocks });
  };

export const createMentionEntities = (
  tokenizedText,
  rawText,
  tags,
  handleRichText,
) => {
  const tagsWithType = tags.map((tag) => {
    const foundIndex = tokenizedText.indexOf(`{${tag.identifier}}`);

    if (foundIndex !== -1) {
      return {
        ...tag,
        mentionType: tokenizedText[foundIndex - 1],
      };
    }

    return { ...tag };
  });

  return createMentionEntitiesFromRawText(
    rawText,
    tagsWithType,
    handleRichText,
  );
};
