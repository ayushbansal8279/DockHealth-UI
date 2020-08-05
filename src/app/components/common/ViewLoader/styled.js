import styled from 'styled-components';
import { Fade } from '@material-ui/core';

export const FadeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${props => props.padding || '100px 0'};
`;

export const StyledFade = styled(Fade)`
  transition-delay: 800ms;
`;

export default FadeContainer;
