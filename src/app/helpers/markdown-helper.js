import markdownToTxt from 'markdown-to-txt';

const isActualNumberedList = (text) => {
  const lines = text.split('\n');
  let numberedListCount = 0;

  for (const line of lines) {
    const numberedListPattern = /^\d+\.\s/;
    if (numberedListPattern.test(line.trim())) {
      numberedListCount++;
    }
  }

  return numberedListCount >= 2;
};

const escapeFalseListPatterns = (text) => {
  if (!text) return text;

  if (isActualNumberedList(text)) {
    return text;
  }

  return text.replace(/^(\d+)\.(\s)/gm, '$1\\.$2');
};

const unescapeFalseListPatterns = (text) => {
  if (!text) return text;

  return text.replace(/(\d+)\\.(\s)/g, '$1.$2');
};

export const convertToSimpleString = (source) => {
  if (!source) return '';

  const escapedSource = escapeFalseListPatterns(source);

  const converted = markdownToTxt(escapedSource, { gfm: true });

  return unescapeFalseListPatterns(converted);
};
