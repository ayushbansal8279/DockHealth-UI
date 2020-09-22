import styled from 'styled-components';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const StyledEditorContainer = styled.div`
  box-sizing: border-box;
  cursor: ${({ isReadOnly }) => (isReadOnly ? 'inherit' : 'text')};
  background: transparent;

  & .public-DraftEditor-content {
    height: fit-content;
  }

  .public-DraftEditorPlaceholder-root {
    position: absolute;
    font-weight: ${fontWeights.light};
    color: ${palette.coolGrey1};
  }

  ${({ withEditedLabel }) =>
    withEditedLabel &&
    `
    & .public-DraftEditor-content > div > div:last-of-type > div:after {
      content: '(Edited)';
      display: inline;
      font-size: 0.75rem;
      color: ${palette.coolGrey2};
      margin-left: 8px;
    }
  `}
`;

export default StyledEditorContainer;
