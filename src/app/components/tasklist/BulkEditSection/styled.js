import styled from 'styled-components';

export const BulkEditOptionsBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, ${({ isOpen }) => (isOpen ? 0 : 100)}%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
`;
