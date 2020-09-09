import styled from 'styled-components';
import { Link } from 'react-router';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const OrganizationIdentifiersList = styled.div`
  height: ${props => (props.isOpen ? 'fit-content' : 0)};
  max-height: ${props =>
    props.isOpen ? `calc(100% * ${props.organizationAmount})` : 0};
  overflow-y: auto;
  background-color: ${props => props.isOpen && 'white'};
  position: absolute;
  background-color: white;
  z-index: 1;
  width: 100%;
  transition: max-height 0.5s;
  cursor: pointer;
`;

export const OrganizationIdentifiersListContainer = styled.div`
  margin: ${spacing.smallPlus} ${spacing.small} 0;
  position: relative;
  background-color: ${props =>
    props.isOpen ? palette.coolGrey4 : 'transparent'};
  color: ${props => (props.isOpen ? palette.mediumGrey : 'white')} !important;
  overflow: hidden;

  ${props =>
    props.showShadowOnHover &&
    `
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    &:hover {
      & ${OrganizationIdentifiersList} {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }
    }
  }`}
`;

export const AddOrganizationLinkContainer = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.blueGrey};
  padding: ${spacing.smallPlus};
`;

export const AddOrganizationLink = styled(Link)`
  text-transform: uppercase;
  color: ${palette.brightBlue};
`;
