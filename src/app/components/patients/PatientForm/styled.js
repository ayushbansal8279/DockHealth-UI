/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const HidableContainer = styled.div`
  visibility: ${props => (props.visible ? 'hidden' : 'visible')};
  max-height: ${props => (props.visible ? '0px' : '500px')};
  opacity: ${props => (props.visible ? 0 : 1)};
  transition: all 250ms ease-out;
`;
