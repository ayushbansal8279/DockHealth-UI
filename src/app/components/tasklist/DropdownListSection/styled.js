import { Collapse } from '@material-ui/core';
import palette from 'styles/palette';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const ListDetailsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin-bottom: ${spacing.giga};
`;

export const ListDetailsHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: ${spacing.regular};
`;

export const ListNameContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
`;

export const ListNameSection = styled.p`
  flex: 1;
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

export const Arrow = styled.img`
  transform: ${props => props.isOpen && 'rotateX(180deg)'};
  -webkit-transform: ${props => props.isOpen && 'rotateX(180deg)'};
  padding-left: ${spacing.tiny};
  padding-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
  cursor: pointer;
`;

export const Tasks = styled(Collapse)`
  height: 300px;
  padding-left: ${props => props.issubtasks && spacing.giga};
`;

export const ListDescription = styled.div`
  display: block;
  margin-bottom: 0;
  color: ${palette.mediumGrey}
  background-color: ${palette.coolGrey4};
  font-size: ${fontSizes.smallPLus};
  font-weight: ${fontWeights.regular};
  font-family: 'Montserrat', sans-serif;
`;
