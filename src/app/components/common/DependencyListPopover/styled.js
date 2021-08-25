/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const DependencyListContainer = styled.div`
  width: 330px;
  background: white;
  box-shadow: 0px 3px 9px rgb(0 0 0 / 17%);
  box-sizing: border-box;
  font-weight: 500;
  font-size: 1rem;
  &:before {
    content: '';
    margin: auto;
    display: block;
    width: inherit;
    height: 25px;
    top: -15px;
    position: absolute;
    background-color: transparent;
  }
`;

export const Header = styled.div`
  border-bottom: 1px solid ${palette.coolGrey3};
  padding: ${spacing.regular};
`;

export const DependencyIconWrapper = styled.span`
  padding-right: ${spacing.smallPlus};
`;

export const DependencyDescription = styled.span`
  cursor: pointer;
  color: ${palette.brightBlue};
`;

export const ListWrapper = styled.ul`
  display: block;
  margin: 0;
  padding: ${spacing.regular};
`;
export const ListElement = styled.li`
  &:hover {
    text-decoration: underline;
    text-decoration-color: ${palette.brightBlue};
  }
`;
