import markdownToTxt from 'markdown-to-txt';

export const convertToSimpleString = (source) => {
  return source ? markdownToTxt(source, { gfm: false }) : '';
};
