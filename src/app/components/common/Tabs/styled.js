import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const TabsContainer = styled.div`
  display: flex;
`;

export const TabButton = styled.button`
  background-color: ${props =>
    props.isSelected ? palette.coolGrey4 : palette.white};
  color: ${props =>
    props.isSelected ? palette.brightBlue : palette.coolGrey2};
  font-family: 'Montserrat', sans-serif;
  font-weight: ${fontWeights.regularPlus};
  padding: ${spacing.regular} ${spacing.large};
  position: relative;
  text-transform: uppercase;
  width: 200px;

  &:hover {
    color: ${props =>
      props.isSelected ? palette.brightBlue : palette.lightGray};
    cursor: pointer;
  }

  &:after {
    visibility: ${props => (props.isSelected ? 'visible' : 'hidden')};
    background: ${palette.brightBlue};
    border-radius: 10px;
    bottom: 30%;
    content: '';
    display: block;
    height: 2px;
    left: 39%;
    position: absolute;
    right: 39%;
  }
`;
