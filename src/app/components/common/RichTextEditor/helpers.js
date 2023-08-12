import TurndownService from 'turndown';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();
let turndownService = new TurndownService();
turndownService = turndownService.addRule('people-mention', {
  filter: ['del', 's', 'strike'],
  // eslint-disable-next-line func-names, object-shorthand
  replacement: function (content) {
    return `~${content}~`;
  },
});

export const htmlToMarkdown = (html) => {
  return turndownService.turndown(html);
};

export const markdowntoHTML = (markdownText) => {
  return md.render(markdownText || '');
};
