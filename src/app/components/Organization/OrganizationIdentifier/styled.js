import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
// eslint-disable-next-line import/prefer-default-export
export const OrganizationIdentifierContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.regular};
  padding-top: ${props => spacing[props.top] || props.top}px;
  padding-bottom: ${props => spacing[props.bottom] || props.bottom}px;
  padding-left: ${props => spacing[props.left] || props.left}px;
  padding-right: ${props => spacing[props.right] || props.right}px;
  color: ${props => props.fontColor || 'white'};
  overflow: hidden;
  cursor: pointer;

  & > span {
    margin-left: ${spacing.small};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ${props => {
    if (props.onhover) {
      return `&:hover {
        background-color: ${props.onhover.backgroundColor};
      }`;
    }
    return null;
  }}
`;
