import { Collapse } from '@material-ui/core';
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

export const ViewIconBox = styled.div`
  visibility: ${props => (props.isHidden ? 'hidden' : 'visible')};
`;

export const IconsBox = styled.div`
  display: flex;
`;

export const ViewIcon = styled.img`
  margin-left: ${spacing.regularPlus};
  margin-bottom: ${spacing.tiny};
  cursor: ${props => (props.isHidden ? 'initial' : 'pointer')};
`;

export const Arrow = styled.img`
  transform: ${props => props.isOpen && 'rotateX(180deg)'};
  -webkit-transform: ${props => props.isOpen && 'rotateX(180deg)'};
  padding-left: ${spacing.tiny};
  padding-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
`;

export const Tasks = styled(Collapse)`
  height: 300px;
  padding-left: ${props => props.issubtasks && spacing.giga};
`;
