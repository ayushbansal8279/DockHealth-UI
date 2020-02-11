import styled from 'styled-components';
import SimpleBar from 'simplebar-react';

export const CommentSectionLabel = styled.div`
  align-items: center;
  display: flex;
  color: #2e3a43;
  cursor: text;
  flex: 1;
  font-size: 0.875rem;
  height: 2.25rem;
  padding: 0 1.5rem;
`;

export const CommentSectionInputField = styled.div`
  border: 0;
  color: #2e3a43;
  flex: 1;
  font-size: 0.875rem;
  height: 100%;
  outline: none;
  padding: 0.5rem 2rem 0.5rem 1.5rem;
  word-break: break-word;

  &:empty ::after {
    color: #dedee2;
    content: '+ add a comment';
  }
`;

export const CommentsDivider = styled.div`
  background-color: #ddf2f7;
  height: 2px;
  width: 100%;
`;

export const CommentsContainer = styled.div`
  align-content: flex-start;
  display: flex;
  flex-flow: column wrap;
  padding: 1.25rem 2.5rem;
  width: 100%;
`;

export const CommentSectionInputFieldContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  min-height: 2.25rem;
  position: relative;
  width: 100%;
`;

export const CubesLoaderContainer = styled.div`
  height: 1rem;
  position: absolute;
  right: 0.75rem;
  top: 1.125rem;
  transform: translateY(-50%);
  width: 3.125rem;
`;

export const AddCommentButtonContainer = styled.div`
  align-items: center;
  background-color: #d9036b;
  border-radius: 0.25rem;
  color: #fff;
  cursor: pointer;
  display: flex;
  height: 2.25rem;
  font-size: 2rem;
  justify-content: center;
  line-height: 1;
  width: 2.125rem;
  z-index: 1;
`;

export const StyledSimpleBar = styled(SimpleBar)`
  max-height: 22.8125rem;
  overflow-y: auto;
  width: 100%;

  & .simplebar-scrollbar::before,
  & .simplebar-scrollbar.simplebar-visible::before {
    background-color: #c8c8ce;
    opacity: ${props => (props.visible ? 1 : 0)};
  }

  & .simplebar-track.simplebar-vertical {
    background-color: #ededf0;
    border-radius: 0.5rem;
  }
`;
