import styled from 'styled-components';
import palette from 'styles/palette';

export const VLoadMoreTasks = styled('div')`
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};
`;
