/* eslint-disable sonarjs/cognitive-complexity */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import Spacing from 'components/common/Spacing';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { OutfitTypography } from 'styles/theme';
// eslint-disable-next-line import/no-named-as-default
import { useBoolean } from 'hooks/useBoolean';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import PatientMention from 'components/common/TextEditor/PatientMention/PatientMention';
import UserMention from 'components/common/TextEditor/UserMention/UserMention';
import ReactHtmlParser from 'html-react-parser';
import {
  linkifyTextWithMentions,
  markdownItUnderline,
} from 'components/common/RichTextEditor/helpers';
import MarkdownIt from 'markdown-it';
import Highlighter from 'react-highlight-words';
import {
  CommentActionLabel,
  CommentContainer,
  CommentText,
  CommentDetails,
  CommentContent,
  CommentWrapper,
  CommentMemberContainer,
  CommentActionsSection,
  EditCommentButton,
} from './styled';

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

function traverseNodes(node, mentions) {
  if (node && node?.props && node.props.children) {
    const { children } = node.props;
    if (typeof children === 'string') {
      return {
        ...node,
        props: { children: createMentionsComment(children, mentions) },
      };
    }
    return traverseNodes(children, mentions);
  }
  return node;
}

const Comment = ({
  comment,
  onDelete,
  onUpdate,
  currentUser,
  selectedTask,
}) => {
  const {
    // comment: commentContent,
    creator,
    // dateCreated,
    dateUpdated,
    commentIdentifier,
    commentMentions,
    tokenizedComment,
  } = comment;

  const commentEditorReference = useRef();
  const [isEdited, setIsEdited] = useState(false);
  const [isValueReset, setValueReset] = useState(false);
  const [isFocused, setFocused, unsetFocused] = useBoolean(false);

  useEffect(() => {
    if (isEdited) {
      // eslint-disable-next-line no-unused-expressions
      commentEditorReference?.current?.focus();
    }
  }, [isEdited, commentEditorReference]);

  const isCommentAuthor =
    currentUser?.userIdentifier === creator.userIdentifier;

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

  const [currentValue, setCurrentValue] = useState(tokenizedComment);

  const handleTextEditorChange = (value) => {
    setValueReset(false);
    setCurrentValue(value);
  };

  const handleSave = () => {
    onUpdate({
      commentIdentifier,
      comment: currentValue,
    });
    setIsEdited(false);
    setValueReset(true);
  };

  const processMarkdownValue = useCallback(
    (markdownText, preserveNewLines = true) => {
      let htmlValue = md.render(markdownText || '');
      if (preserveNewLines) {
        const mdValue = markdownText?.replace(/\n {2}\n/g, '<p><br/></p>');
        htmlValue = md.render(mdValue || '');
      }
      return ReactHtmlParser(htmlValue || '')[0];
    },
    [],
  );

  return (
    <CommentWrapper>
      <CommentMemberContainer>
        <UserAvatar user={creator} size={35} />
      </CommentMemberContainer>
      <CommentContainer isEditing={isEdited}>
        <CommentContent>
          <CommentText>
            {isEdited ? (
              <RichTextEditor
                height={60}
                readonly={!isEdited}
                showToolbar={isEdited}
                focus={isFocused}
                value={currentValue}
                reset={isValueReset}
                onChange={handleTextEditorChange}
                initOnClick
                showCharCount
                taskListIdentifier={selectedTask?.taskList?.taskListIdentifier}
                mentions={commentMentions}
              />
            ) : (
              traverseNodes(
                processMarkdownValue(tokenizedComment),
                commentMentions,
              )
            )}
          </CommentText>
          <CommentDetails>{commentDetails}</CommentDetails>
        </CommentContent>
        <CommentActionsSection>
          {isEdited ? (
            <>
              <Spacing horizontal={4} />
              <EditCommentButton>
                <OutfitTypography condensed variant="h5" color="inherit">
                  <CommentActionLabel
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleSave();
                      unsetFocused();
                    }}
                  >
                    Save
                  </CommentActionLabel>
                </OutfitTypography>
              </EditCommentButton>
              <Spacing horizontal={3} />
              <EditCommentButton>
                <OutfitTypography condensed variant="h5" color="inherit">
                  <CommentActionLabel
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsEdited(false);
                      setValueReset(true);
                    }}
                  >
                    Cancel
                  </CommentActionLabel>
                </OutfitTypography>
              </EditCommentButton>
            </>
          ) : (
            <>
              {isCommentAuthor && (
                <>
                  <Spacing horizontal={4} />
                  <EditCommentButton>
                    <OutfitTypography condensed variant="h5" color="inherit">
                      <CommentActionLabel
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setIsEdited(true);
                          setValueReset(false);
                          setFocused();
                        }}
                      >
                        Edit
                      </CommentActionLabel>
                    </OutfitTypography>
                  </EditCommentButton>
                </>
              )}
              {isCommentAuthor && (
                <>
                  <Spacing horizontal={3} />
                  <OutfitTypography condensed variant="h5" color="inherit">
                    <CommentActionLabel
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onDelete(comment);
                      }}
                    >
                      Delete
                    </CommentActionLabel>
                  </OutfitTypography>
                </>
              )}
            </>
          )}
        </CommentActionsSection>
      </CommentContainer>
    </CommentWrapper>
  );
};

export default Comment;
