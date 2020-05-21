import styled from 'styled-components';
import palette from 'styles/palette';

// eslint-disable-next-line import/prefer-default-export
export const DroppablePlaceholder = styled.div`
  min-height: 66px; // per design
  background-color: ${props =>
    props.isDraggingOverGroup ? palette.coolGrey2 : 'transparent'};
`;
