/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';

export const LabeledCollapseHeaderButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const LabeledCollapseItemName = styled.p`
  display: block;
  flex: 1;
  margin: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  text-align: left;
`;

export const HideableContainer = styled.div`
  visibility: ${props => (props.visibility ? 'hidden' : 'visible')};
  max-height: ${props => (props.visibility ? '0px' : '500px')};
  opacity: ${props => (props.visibility ? 0 : 1)};
  transition: all 250ms ease-out;
`;
