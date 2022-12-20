import styled from 'styled-components';
import palette from 'styles/palette';

export const UsersViewOuterContainer = styled.div`
  display: flex;
  min-height: 100%;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 24px;
  background-color: ${palette.white};
`;

export const UsersViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  max-width: 1200px;
  width: 1200px;
`;
