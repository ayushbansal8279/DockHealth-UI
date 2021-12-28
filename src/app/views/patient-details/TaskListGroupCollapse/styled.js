import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 28px;
`;

export const GroupHeader = styled.div`
  width: 100%;
  display: flex;
  padding: 8px 0;
  justify-content: space-between;
  align-items: center;
  ${({ stickyHeader }) =>
    stickyHeader
      ? `
  position: sticky;
  left: 24px;
  width: calc(100vw - 115px);
  `
      : ''}
`;

export const GroupTitle = styled.div`
  display: flex;
  flex: 1;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  margin-bottom: 0;
  overflow: hidden;
`;

export const GroupName = styled.p`
  display: flex;
  flex: auto 0 1;
  margin-bottom: 0;
  overflow: hidden;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const GroupCount = styled.p`
  padding-left: 4px;
  margin-bottom: 0;
`;
