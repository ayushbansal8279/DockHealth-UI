import React from 'react';
import moment from 'moment';
import ReactHtmlParser from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import Highlighter from 'react-highlight-words';
import PatientMention from 'components/common/TextEditor/PatientMention/PatientMention';
import UserMention from 'components/common/TextEditor/UserMention/UserMention';
import {
  linkifyTextWithMentions,
  markdownItUnderline,
} from 'components/common/RichTextEditor/helpers';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(markdownItUnderline);

function createMentionsComment(tokenizedDescription, mentions) {
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
              #{currentMention.name}{' '}
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
  return nodes && nodes.length > 0
    ? nodes.map((node) => {
        if (containsHref(node)) {
          return node;
        }
        return traverseNode(node, mentions);
      })
    : nodes;
}

export function traverseNode(node, mentions) {
  if (node && node?.props && node.props.children) {
    const { children } = node.props;
    if (typeof children === 'string') {
      return {
        ...node,
        props: { children: createMentionsComment(children, mentions) },
      };
    }
    return traverseNode(children, mentions);
  }
  return node;
}

export function getCommentDetails(comment) {
  const { creator, dateUpdated } = comment;

  let dateLabel = '';

  if (moment(dateUpdated).isSame(new Date(), 'd')) {
    dateLabel = 'Today';
  } else if (moment(dateUpdated).isSame(moment().subtract(1, 'days'), 'd')) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = moment(dateUpdated).format('MM/DD/YYYY');
  }

  const commentDetails = `${creator?.firstName} ${creator?.lastName}${
    creator?.credentials ? `, ${creator?.credentials}` : ''
  }, ${dateLabel} @ ${moment(dateUpdated).format('h:mma')}`;

  return commentDetails;
}

export const processMarkdownValue = (
  markdownText, // string
  preserveNewLines = true,
) => {
  let htmlValue = md.render(markdownText || '');
  if (preserveNewLines) {
    const mdValue = markdownText?.replace(/\n {2}\n/g, '<p><br/></p>');
    htmlValue = md.render(mdValue || '');
  }
  const nodes = ReactHtmlParser(htmlValue || '');
  return nodes;
};

function containsHref(node) {
  if (node && node?.props && node.props.children) {
    const { children } = node.props;

    if (node?.props?.href) {
      return true;
    }
    if (children) {
      return containsHref(children);
    }
  }

  return false;
}
