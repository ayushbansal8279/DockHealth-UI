/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const HideableContainer = styled.div`
  visibility: ${props => (props.visibility ? 'hidden' : 'visible')};
  max-height: ${props => (props.visibility ? '0px' : '500px')};
  opacity: ${props => (props.visibility ? 0 : 1)};
  transition: all 250ms ease-out;
`;
