import styled from 'styled-components';

export const ArrowWrapper = styled.div`
  overflow: hidden;
`;

export const Arrow = styled.div`
  position: relative;
  margin-top: 15px;
  &::before {
    background-color: white;
    content: '';
    display: block;
    position: absolute;
    top: -9px;
    left: calc(65% - 9px);
    width: 18px;
    height: 18px;
    transform: rotate(45deg);
    box-shadow: 0px 0px 11px rgb(0 0 0 / 15%);
  }
`;

export const Wrapper = styled.div`
  padding: 7px;
  background-color: white;
  box-shadow: 0px 0px 11px rgb(0 0 0 / 15%);
  max-height: 300px;
  overflow-y: scroll;
`;
