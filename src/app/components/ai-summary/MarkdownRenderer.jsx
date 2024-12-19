import React from 'react';
import MarkdownIt from 'markdown-it';
import parse from 'html-react-parser';

const MarkdownRenderer = ({ content }) => {
  const md = new MarkdownIt();
  const htmlContent = md.render(content);
  return <div>{parse(htmlContent)}</div>;
};
export default MarkdownRenderer;
