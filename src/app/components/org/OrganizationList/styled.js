import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const OrganizationsListDropdownContainer = styled.div`
  position: absolute;
  height: ${(props) => (props.isOpen ? 'fit-content' : 0)};
  width: 100%;
  z-index: 1;
  cursor: pointer;
  background-color: white;
`;

export const OrganizationIdentifiersList = styled.div`
  height: ${(props) =>
    props.isOpen
      ? `calc(67px * ${props.organizationAmount})`
      : 0}; // single oraganization identifier height times visible list items limit

  transition: height 0.5s;
  overflow-y: auto;
  width: 100%;
`;

export const OrganizationIdentifiersListContainer = styled.div`
  margin: ${spacing.smallPlus} ${spacing.small} 0;
  position: relative;
  background-color: ${(props) =>
    props.isOpen ? palette.coolGrey4 : 'transparent'};
  color: ${(props) => (props.isOpen ? palette.mediumGrey : 'white')} !important;
  min-height: 67px;
  ${(props) => !props.isOpen && `overflow: hidden;`}
  ${(props) =>
    props.showShadowOnHover &&
    `
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    &:hover {
      & ${OrganizationIdentifiersList} {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      }
    }
  }`};
`;

export const AddOrganizationLinkContainer = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.blueGrey};
  padding: ${spacing.smallPlus};
  background-color: white;
`;

export const AddOrganizationLink = styled(Link)`
  text-transform: uppercase;
  font-weight: ${fontWeights.regular};
  color: ${palette.brightBlue};
`;

export const PlusIcon = styled.span`
  color: ${palette.coolGrey2};
`;
