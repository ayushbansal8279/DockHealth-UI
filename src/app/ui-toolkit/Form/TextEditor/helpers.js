// import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import markdownToTxt from 'markdown-to-txt';

export const convertToSimpleString = (source) => {
  // return $convertFromMarkdownString(source ?? '', TRANSFORMERS);
  return source ? markdownToTxt(source) : '';
};


export const traverse = (node, callback) => {
  callback(node);
  if (node.children) {
    for (const child of node.children) {
      traverse(child, callback);
    }
  }
};
