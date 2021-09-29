/* eslint-disable sonarjs/no-identical-functions */
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const ArrowImg = styled.img`
  height: 7px;
  transform-origin: center;
  transform: ${props =>
    props.isOpen
      ? `rotate(${props.openDegree}deg)`
      : `rotate(${props.closeDegree}deg)`};
  -webkit-transform: ${props =>
    props.isOpen
      ? `rotate(${props.openDegree}deg)`
      : `rotate(${props.closeDegree}deg)`};
  transition: ${props => `all ${props.transitionTime}s ease-in-out`};
  height: 7px;
`;

export const ArrowImgContainer = styled.div`
  display: flex;
  padding-top: ${spacing.tiny};
`;

export const ArrowContainer = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent || 'flex-end'};
  align-items: center;
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.bold};
  padding-left: ${props => props.paddingLeft || spacing.giga};
  cursor: ${props => (props.isDisabled ? 'default' : 'pointer')};
  & > span {
    margin-right: ${spacing.tiny};
  }
`;
