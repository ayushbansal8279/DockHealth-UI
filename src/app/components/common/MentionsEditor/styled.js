import styled from 'styled-components';

export const StyledEditorContainer = styled.div`
  box-sizing: border-box;
  cursor: text;
  background: transparent;

  & .public-DraftEditor-content {
    height: fit-content;
  }

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    color: #8492a4;
  }

  ${({ withEditedLabel }) =>
    withEditedLabel &&
    `
    & .public-DraftEditor-content > div > div:last-of-type > div:after {
      content: '(Edited)';
      display: inline;
      font-size: 0.75rem;
      color: #8492a4;
      margin-left: 8px;
    }
  `}
`;

export default StyledEditorContainer;
