import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { userOrganizationsSelector } from 'selectors/user-selectors';
import Checkbox from 'components/common/Checkbox/Checkbox';
import {
  Title,
  ListItem,
  EmptyMessage,
  ListsWrapper,
  ListItemTextButton,
  Step,
  Description,
} from '../styled';

const OrganizationSelectStep = ({
  selectedOrganizations,
  setSelectedOrganizations,
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
      <Description>
        <b>Note:</b> please ensure linked workflows are copied first to the
        target organizations, otherwise the workflow will not be copied.
      </Description>
      <Box m={1} />
      <ListsWrapper>
        {availableUserOrganizations.length > 0 && (
          <>
            {availableUserOrganizations?.length > 0 ? (
              availableUserOrganizations.map((list) => (
                <ListItem
                  key={list.organizationIdentifier}
                  isSelected={selectedOrganizations?.has(
                    list.organizationIdentifier,
                  )}
                >
                  <Checkbox
                    isChecked={selectedOrganizations?.has(
                      list.organizationIdentifier,
                    )}
                    onClick={() => {
                      if (
                        !selectedOrganizations.has(list.organizationIdentifier)
                      ) {
                        setSelectedOrganizations(
                          (prev) =>
                            new Set([...prev, list.organizationIdentifier]),
                        );
                      } else {
                        setSelectedOrganizations((prev) => {
                          return new Set(
                            [...prev].filter((orgId) => {
                              return orgId !== list.organizationIdentifier;
                            }),
                          );
                        });
                      }
                    }}
                  />
                  <ListItemTextButton
                    onClick={() => {
                      if (
                        !selectedOrganizations.has(list.organizationIdentifier)
                      ) {
                        setSelectedOrganizations(
                          (prev) =>
                            new Set([...prev, list.organizationIdentifier]),
                        );
                      } else {
                        setSelectedOrganizations((prev) => {
                          return new Set(
                            [...prev].filter((orgId) => {
                              return orgId !== list.organizationIdentifier;
                            }),
                          );
                        });
                      }
                    }}
                    type="button"
                    isSelected={
                      // selectedOrganizations?.includes(org => org.organizationIdentifier ===
                      //   list.organizationIdentifier )
                      selectedOrganizations.has(list.organizationIdentifier)
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
