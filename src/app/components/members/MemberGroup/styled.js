import styled from 'styled-components';

export const GroupItem = styled.div`
  position: relative;
  z-index: ${({ zIndex }) => zIndex};
`;

export const GroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > ${GroupItem}, & > div {
    &:not(:first-child) {
      margin-left: -8px;
    }
  }
`;
