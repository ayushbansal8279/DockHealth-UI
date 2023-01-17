import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;
