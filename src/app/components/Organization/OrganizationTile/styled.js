import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

// eslint-disable-next-line import/prefer-default-export
export const OrganizationTileContaier = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.isDefaultTile ? '#F9FAFC' : props.organizationColor};
  height: ${props => props.size};
  min-height: ${props => props.size};
  width: ${props => props.size};
  min-width: ${props => props.size};
  color: ${props => (props.isDefaultTile ? palette.coolGrey2 : 'white')};
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => fontSizes[props.fontSize] || fontSizes.regular};
  font-weight: ${fontWeights.bold};
`;
