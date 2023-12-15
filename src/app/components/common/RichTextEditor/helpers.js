import TurndownService from 'turndown';
import MarkdownIt from 'markdown-it';
import { mentionifyAndLinkifyTaskText } from 'helpers/utility-functions';

// eslint-disable-next-line no-shadow
export const markdownItUnderline = (md) => {
  // eslint-disable-next-line unicorn/consistent-function-scoping, unicorn/prevent-abbreviations
  function renderUnderline(tokens, idx, opts, _, slf) {
    const token = tokens[idx];
    if (token.markup === '__') {
      token.tag = 'u';
    }
    return slf.renderToken(tokens, idx, opts);
  }

  // eslint-disable-next-line no-param-reassign
  md.renderer.rules.strong_open = renderUnderline;
  // eslint-disable-next-line no-param-reassign
  md.renderer.rules.strong_close = renderUnderline;
};

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
}).use(markdownItUnderline);
let turndownService = new TurndownService();
turndownService = turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  // eslint-disable-next-line func-names, object-shorthand
  replacement: function (content) {
    return `~~${content}~~`;
  },
});

export const htmlToMarkdown = (html) => {
  return turndownService.turndown(html);
};

export const markdowntoHTML = (markdownText, preserveNewLines) => {
  let htmlValue = md.render(markdownText || '');
  if (preserveNewLines) {
    const mdValue = markdownText?.replace(/\n {2}\n/g, '<p><br/></p>');
    htmlValue = md.render(mdValue || '');
  }
  return htmlValue || '';
};

export const markdowntoHTMLWithMentions = (
  markdownText,
  mentions,
  preserveNewLines,
) => {
  let htmlValue = md.render(markdownText || '');
  if (preserveNewLines) {
    const mdValue = markdownText?.replace(/\n {2}\n/g, '<p><br/></p>');
    htmlValue = md.render(mdValue || '');
  }
  let processedValue = htmlValue;
  if (mentions && markdownText !== '') {
    for (const mentionInfo of mentions) {
      processedValue = processedValue.replace(
        `@{${mentionInfo.identifier}}`,
        `<span class="fr-deletable fr-tribute" data-people-mention="${mentionInfo.identifier}"><a>@${mentionInfo.name}</a></span>`,
      );
      processedValue = processedValue.replace(
        `#{${mentionInfo.identifier}}`,
        `<span class="fr-deletable fr-tribute" data-patient-mention="${mentionInfo.identifier}"><a>#${mentionInfo.name}</a></span>`,
      );
    }
  }
  processedValue = processedValue.replace('<p>', '');
  processedValue = processedValue.replace('</p>', '');
  processedValue = processedValue.replaceAll('<a ', '<a target="_blank" ');
  return processedValue || '';
};

export const linkifyTextWithMentions = (value, mentions) => {
  if (value?.includes('[http')) {
    return markdowntoHTMLWithMentions(value, mentions, false);
  }
  if (value?.includes('http')) {
    return mentionifyAndLinkifyTaskText({
      members: mentions,
      value,
    });
  }
  return value;
};
