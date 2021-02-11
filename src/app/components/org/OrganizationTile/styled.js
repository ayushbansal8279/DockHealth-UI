import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

// eslint-disable-next-line import/prefer-default-export
export const OrganizationTileContaier = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: ${props =>
    props.isDefaultTile ? palette.coolGrey2 : props.organizationColor};
  height: ${props => props.size};
  min-height: ${props => props.size};
  width: ${props => props.size};
  min-width: ${props => props.size};
  color: ${props => (props.isDefaultTile ? palette.coolGrey2 : 'white')};
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => props.size / 45}rem;
  font-weight: ${fontWeights.bold};
  border-radius: 3px;
`;
