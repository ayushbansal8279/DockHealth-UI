/* eslint-disable @typescript-eslint/camelcase */
import { convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import { markdownToDraft } from 'markdown-draft-js';

const getIndicesOf = (searchValue, text, caseSensitive) => {
  let temporaryText = text;
  let temporarySearchValue = searchValue;
  const searchValueLength = temporarySearchValue.length;
  if (searchValueLength === 0) {
    return [];
  }
  let startIndex = 0;
  let index;
  const indices = [];
  if (!caseSensitive) {
    temporaryText = temporaryText.toLowerCase();
    temporarySearchValue = temporarySearchValue.toLowerCase();
  }

  while (
    // eslint-disable-next-line no-cond-assign
    (index = temporaryText.indexOf(temporarySearchValue, startIndex)) > -1
  ) {
    indices.push(index);
    startIndex = index + searchValueLength;
  }
  return indices;
};

const getEntityRanges = (text, mentionName, mentionKey) => {
  const indices = getIndicesOf(mentionName, text);
  if (indices.length > 0) {
    return indices.map(offset => ({
      key: mentionKey,
      length: mentionName.length,
      offset,
    }));
  }

  return null;
};

export const createMentionEntitiesFromRawText = (
  text,
  tags,
  handleRichText,
) => {
  const rawContent = handleRichText
    ? markdownToDraft(text, {
        blockStyles: {
          ins_open: 'UNDERLINE',
          del_open: 'STRIKETHROUGH',
        },
        remarkableOptions: {
          enable: {
            inline: 'ins',
          },
        },
      })
    : convertToRaw(ContentState.createFromText(text));

  const rawState = tags.map(tag => {
    const { mentionType, ...data } = tag;
    return {
      type: mentionType === '@' ? 'mention' : `${mentionType}mention`,
      mutability: 'SEGMENTED',
      data: { mention: { ...data } },
    };
  });

  rawContent.entityMap = [...rawState];

  rawContent.blocks = rawContent.blocks.map(block => {
    const ranges = [];

    tags.forEach(({ mentionType, name }, index) => {
      const entityRanges = getEntityRanges(
        block.text,
        `${mentionType}${name}`,
        index,
      );
      if (entityRanges) {
        ranges.push(...entityRanges);
      }
    });

    return { ...block, entityRanges: ranges };
  });

  return convertFromRaw(rawContent);
};

export const createMentionEntities = (
  tokenizedText,
  rawText,
  tags,
  handleRichText,
) => {
  const tagsWithType = tags.map(tag => {
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
