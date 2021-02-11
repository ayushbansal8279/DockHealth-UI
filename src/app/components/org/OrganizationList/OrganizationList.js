import React from 'react';
import useBoolean from 'hooks/useBoolean';
import palette from 'styles/palette';
import OrganizationIdentifier from '../OrganizationIdentifier/OrganizationIdentifier';

import {
  OrganizationIdentifiersList,
  OrganizationIdentifiersListContainer,
  AddOrganizationLink,
  AddOrganizationLinkContainer,
  OrganizationsListDropdownContainer,
  PlusIcon,
} from './styled';

const OrganizationList = ({
  currentOrganization,
  availableUserOrganizations,
  shouldExpand,
  selectedIdentifierConfig,
  availableIdentifierConfig,
  showShadowOnHover,
  onSelect,
}) => {
  const [
    isOrganizationSectionOpen,
    openOrganizationSection,
    closeOrganizationSection,
  ] = useBoolean(false);

  const defaultIdentifierConfig = {
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    fontColor: isOrganizationSectionOpen ? palette.mediumGrey : 'white',
  };

  const customSelectedIdentifierConfig = {
    ...defaultIdentifierConfig,
    ...selectedIdentifierConfig,
  };

  const customAvailableIdentifierConfig = {
    onhover: {
      backgroundColor: palette.coolGrey3,
    },
    ...defaultIdentifierConfig,
    ...availableIdentifierConfig,
  };

  return (
    <OrganizationIdentifiersListContainer
      isOpen={isOrganizationSectionOpen}
      onMouseEnter={openOrganizationSection}
      onMouseLeave={closeOrganizationSection}
      showShadowOnHover={showShadowOnHover}
    >
      <OrganizationIdentifier
        tileConfig={{
          fontSize: 'smallPlus',
          ...currentOrganization,
        }}
        identifierConfig={customSelectedIdentifierConfig}
        organizationName={currentOrganization?.organizationName}
        isOpen={shouldExpand}
      />
      <OrganizationsListDropdownContainer isOpen={isOrganizationSectionOpen}>
        <OrganizationIdentifiersList
          isOpen={isOrganizationSectionOpen}
          organizationAmount={
            availableUserOrganizations ? availableUserOrganizations.length : 1
          }
        >
          {availableUserOrganizations?.map(org => (
            <OrganizationIdentifier
              tileConfig={{
                fontSize: 'smallPlus',
                ...org,
              }}
              key={`org_${org?.organizationIdentifier}`}
              identifierConfig={customAvailableIdentifierConfig}
              organizationName={org?.organizationName}
              isOpen={shouldExpand}
              onSelect={() => onSelect(org?.organizationIdentifier)}
            />
          ))}
        </OrganizationIdentifiersList>
        <AddOrganizationLinkContainer>
          <AddOrganizationLink to="/onboarding/new-organization">
            <PlusIcon>+</PlusIcon> Add an organization
          </AddOrganizationLink>
        </AddOrganizationLinkContainer>
      </OrganizationsListDropdownContainer>
    </OrganizationIdentifiersListContainer>
  );
};

export default OrganizationList;
