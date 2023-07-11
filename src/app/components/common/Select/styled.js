import styled from 'styled-components';

export const ColorIndicator = styled.div`
  display: block;
  width: 6px;
  height: 100%;
  background: ${(props) => props.color};
  position: absolute;
  left: 0px;
`;

export const SelectArrowImg = styled.img`
  pointer-events: none;
  height: 7px;
`;
