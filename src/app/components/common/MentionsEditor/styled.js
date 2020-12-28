import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette, { featurePalette } from 'styles/palette';

export const StyledEditorContainer = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  cursor: ${({ isReadOnly }) => (isReadOnly ? 'inherit' : 'text')};
  background: transparent;

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
