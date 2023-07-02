import styled from 'styled-components';

export const Avatar = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  max-width: 32px;
  max-height: 32px;
  min-width: 32px;
  min-height: 32px;
  margin: 4px;
  color: white;
  background-color: ${({ $color }) => $color};
  border: 1px solid white;
  outline: 1px solid ${({ $color }) => $color};
  border-radius: 100%;

  img {
    border-radius: 100%;
  }
`;
