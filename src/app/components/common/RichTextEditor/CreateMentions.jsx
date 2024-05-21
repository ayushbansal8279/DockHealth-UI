import React from 'react';
import ReactHtmlParser from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import Highlighter from 'react-highlight-words';
import { linkifyTextWithMentions, markdownItUnderline } from './helpers';
import UserMention from '../TextEditor/UserMention/UserMention';
import PatientMention from '../TextEditor/PatientMention/PatientMention';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(markdownItUnderline);

export function createMentionsFromTokenizedDescription(
  tokenizedDescription,
  mentions,
) {
  if (!tokenizedDescription || tokenizedDescription === '') {
    return tokenizedDescription;
  }

  return tokenizedDescription.split(/\s/).map((word) => {
    if (word.includes('[http') || word.includes('http')) {
      return ReactHtmlParser(linkifyTextWithMentions(`${word} `, mentions));
    }

    if (word[0] === '@') {
      const wordMentionIdentifier = word.split(/@{(.*?)}/)[1];
      const currentMention = mentions?.find(
        (m) => m.identifier === wordMentionIdentifier,
      );

      if (currentMention) {
        return (
          <UserMention
            mention={currentMention}
            className="fr-deletable fr-tribute"
          >
            <span data={currentMention.identifier}>
              @{currentMention.name}{' '}
            </span>
          </UserMention>
        );
      }
    }

    if (word[0] === '#') {
      const wordMentionIdentifier = word.split(/#{(.*?)}/)[1];
      const currentMention = mentions?.find(
        (m) => m.identifier === wordMentionIdentifier,
      );

      if (currentMention) {
        return (
          <PatientMention
            mention={currentMention}
            className="fr-deletable fr-tribute"
          >
            <span data={currentMention.identifier}>
              @{currentMention.name}{' '}
            </span>
          </PatientMention>
        );
      }
    }

    return (
      <Highlighter
        highlightClassName="list-highlight"
        autoEscape
        searchWords={[]}
        textToHighlight={`${word} `}
      />
    );
  });
}

export function traverseNodes(nodes, mentions) {
  return nodes && nodes.length > 0 ? nodes.map((node) => {
      return traverseNode(node, mentions);
  }) : nodes;
}

export function traverseNode(node, mentions) {
  if (node && node?.props && node.props.children) {
    const { children } = node.props;
    if (typeof children === 'string') {
      return {
        ...node,
        props: {
          children: createMentionsFromTokenizedDescription(children, mentions),
        },
      };
    }
    return traverseNode(children, mentions);
  }
  return node;
}

export const processMarkdownValue = (markdownText, preserveNewLines = true) => {
  let htmlValue = md.render(markdownText || '');
  if (preserveNewLines) {
    const mdValue = markdownText?.replace(/\n {2}\n/g, '<p><br/></p>');
    htmlValue = md.render(mdValue || '');
  }
  return ReactHtmlParser(htmlValue || '');
};

export function createMentions(
  markdownText,
  mentions,
  preserveNewLines = true,
) {
  const node = processMarkdownValue(markdownText, preserveNewLines);
  return traverseNodes(node, mentions);
}
