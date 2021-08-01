import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette, { featurePalette } from 'styles/palette';

export const StyledEditorContainer = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  cursor: ${({ isReadOnly }) => (isReadOnly ? 'inherit' : 'text')};
  background: transparent;
  max-height: ${({ height }) => (height ? `${height}px` : 'auto')};
  overflow: auto;

  .DraftEditor-root {
    height: ${({ height }) => (height ? `${height}px` : 'auto')};
  }
  .emojiSelectButton {
    background: transparent;
  }

  .editor {
    box-sizing: border-box;
    border: 1px solid #ddd;
    cursor: text;
    padding: 16px;
    border-radius: 2px;
    margin-bottom: 2em;
    box-shadow: inset 0px 1px 8px -3px #ababab;
    background: #fefefe;
  }

  .editor :global(.public-DraftEditor-content) {
    min-height: 140px;
  }

  ul {
    li {
      margin-left: 1.25rem;
      list-style-type: disc;
    }
  }

  ol {
    list-style: none;
    counter-reset: my-awesome-counter;
  }
  ol li {
    counter-increment: my-awesome-counter;
    display: flex;
  }
  ol li::before {
    content: counter(my-awesome-counter) '. ';
    font-weight: bold;
  }

  ${({ isOneline }) =>
    isOneline &&
    `
      height: 1.3em;
      overflow: hidden;

      & .public-DraftStyleDefault-block {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `}

  & .public-DraftEditor-content {
    height: auto;
  }

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    font-weight: ${fontWeights.light};
    color: ${palette.coolGrey2};
    z-index: 1;
  }

  .DraftEditor-editorContainer {
    position: relative;
    z-index: 2;
  }

  ${({ withEditedLabel }) =>
    withEditedLabel &&
    `
    & .public-DraftEditor-content > div > div:last-of-type > div:after {
      display: inline-block;
      content: '(edited)';
      font-size: 0.75rem;
      color: ${palette.coolGrey2};
      margin-left: 8px;
      text-decoration: none;
    }
  `}
`;

export const HighlightedElement = styled.span`
  color: inherit;
  background-color: ${featurePalette.globalSearchHighlight};
`;

export const EmojiContainer = styled.div`
  display: inline-block;
  ul {
    li {
      margin-left: 0px;
      list-style-type: none;
    }
  }
  button {
    border: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    line-height: 0px;
    font-size: 26px;
    background: transparent;
    border-radius: 0px;
    &:focus,
    &:active {
      background: transparent !important;
    }
  }
  & > div > div {
    position: fixed;
  }
`;
export const ToolbarContainer = styled.div`
  box-sizing: border-box;
  margin-top: 0px;
  padding-bottom: 5px;
`;
