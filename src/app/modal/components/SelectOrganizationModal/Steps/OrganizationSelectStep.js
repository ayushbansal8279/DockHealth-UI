import React, { useMemo } from 'react';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { userOrganizationsSelector } from 'selectors/user-selectors';
import {
  Title,
  ListItem,
  EmptyMessage,
  ListsWrapper,
  ListItemTextButton,
  Step,
} from '../styled';

const OrganizationSelectStep = ({
  selectedOrganization,
  setSelectedOrganization,
}) => {
  const userOrganizations = useSelector(userOrganizationsSelector);

  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  const availableUserOrganizations = useMemo(
    () =>
      userOrganizations?.filter(
        ({ organizationIdentifier }) =>
          organizationIdentifier !== currentOrganizationIdentifier,
      ),
    [userOrganizations, currentOrganizationIdentifier],
  );

  return (
    <Step>
      <Title>Organizations</Title>
      <Box m={1} />
      <ListsWrapper>
        {availableUserOrganizations.length > 0 && (
          <>
            {availableUserOrganizations?.length > 0 ? (
              availableUserOrganizations.map(list => (
                <ListItem
                  key={list.organizationIdentifier}
                  isSelected={
                    selectedOrganization?.organizationIdentifier ===
                    list.organizationIdentifier
                  }
                >
                  <ListItemTextButton
                    onClick={() => {
                      setSelectedOrganization(list);
                    }}
                    type="button"
                    isSelected={
                      selectedOrganization?.organizationIdentifier ===
                      list.organizationIdentifier
                    }
                  >
                    {list.organizationName}
                  </ListItemTextButton>
                </ListItem>
              ))
            ) : (
              <EmptyMessage>No other organizations available</EmptyMessage>
            )}
          </>
        )}
      </ListsWrapper>
    </Step>
  );
};

export default OrganizationSelectStep;
