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

export const markdowntoHTML = (markdownText, mentions) => {
  const htmlValue = md.render(markdownText || '');
  let processedValue = htmlValue;
  if (mentions && markdownText !== '') {
    for (const mentionInfo of mentions) {
      processedValue = processedValue.replace(
        `@{${mentionInfo.identifier}}`,
        `<span class="fr-deletable fr-tribute" data="${mentionInfo.identifier}"><a>**@${mentionInfo.name}</a></span>`,
      );
    }
  }
  processedValue = processedValue.replace('<p>', '');
  processedValue = processedValue.replace('</p>', '');
  return processedValue || '';
};
