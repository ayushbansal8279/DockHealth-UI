import styled from 'styled-components';
import palette from 'styles/palette';

export const DroppablePlaceholder = styled.div`
  min-height: 66px; // per design
  background-color: ${props =>
    props.isDraggingOverGroup ? palette.coolGrey2 : 'transparent'};
`;

export default { DroppablePlaceholder };
