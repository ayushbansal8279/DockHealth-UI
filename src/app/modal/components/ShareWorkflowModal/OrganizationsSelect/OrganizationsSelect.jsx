/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userOrganizationsSelector } from 'selectors/user-selectors';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import filter from 'ramda/src/filter';
import { Box, ListItemText, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Autocomplete,
  SelectedUsersContainer,
  SelectedUserItem,
  SelectedUserText,
} from './styled';
import OrganizationTile from '@/app/components/org/OrganizationTile/OrganizationTile';

const OrganizationsSelect = (props) => {
  const { selectedOrganizations, onAdd, onDelete, onMoveToExternalUserForm } =
    props;
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const userOrganizations = useSelector(userOrganizationsSelector);
  const currentOrganizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );
  const [options, setOptions] = useState([]);
  const [isLoadingOptions, setLoadingOptions] = useState(false);

  const availableUserOrganizations = useMemo(() => {
    return userOrganizations?.filter(
      ({ organizationIdentifier }) =>
        organizationIdentifier !== currentOrganizationIdentifier,
    );
  }, [userOrganizations, currentOrganizationIdentifier]);

  const getOrganizationsWithDebounce = useCallback(
    (searchValue) => {
      availableUserOrganizations
        ?.filter(
          (option) =>
            !selectedOrganizations?.some(
              (so) =>
                so?.organizationIdentifier === option?.organizationIdentifier,
            ),
        )
        ?.map((option) => {
          if (
            option?.organizationName
              ?.toLowerCase()
              .trim()
              .includes(searchValue?.toLowerCase().trim())
          ) {
            setOptions((existingOption) => [...existingOption, option]);
          }
        });
      setLoadingOptions(false);
    },
    [setOptions, availableUserOrganizations, selectedOrganizations],
  );

  useEffect(() => {
    if (inputValue) {
      setLoadingOptions(true);
      getOrganizationsWithDebounce(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, getOrganizationsWithDebounce, setOptions]);

  const handleInputChange = (event) => {
    setInputValue(event?.target?.value || '');
  };

  return (
    <>
      <Autocomplete
        autoHighlight
        inputValue={inputValue}
        options={options}
        // getOptionLabel={prop('userName')}
        renderOption={(props_, option) => (
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="left"
            {...props_}
          >
            <OrganizationTile
              organizationProfileColor={option?.organizationProfileColor}
              organizationInitials={option?.organizationInitials}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <ListItemText>{option?.organizationName}</ListItemText>
          </Box>
        )}
        filterOptions={filter(
          (option) =>
            option?.organizationIdentifier !== currentOrganizationIdentifier &&
            !selectedOrganizations?.some(
              (su) =>
                su?.organizationIdentifier === option?.organizationIdentifier,
            ),
        )}
        loading={isLoadingOptions}
        onInputChange={handleInputChange}
        onChange={(_, selectedOption) => {
          onAdd(selectedOption);
        }}
        renderInput={({ inputProps, InputProps: rootProps }) => (
          <div {...rootProps}>
            <input
              placeholder="Select an organization"
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  inputValue &&
                  !isLoadingOptions &&
                  options?.length === 0
                ) {
                  onMoveToExternalUserForm(inputValue);
                }
              }}
              {...inputProps}
            />
          </div>
        )}
        noOptionsText={inputValue ? 'No records found' : 'Type to search...'}
      />
      {selectedOrganizations.length > 0 && (
        <>
          <SelectedUsersContainer>
            {selectedOrganizations?.map((u) => (
              <SelectedUserItem key={u?.organizationIdentifier}>
                <OrganizationTile
                  organizationProfileColor={u?.organizationProfileColor}
                  organizationInitials={u?.organizationInitials}
                />
                <SelectedUserText>{u?.organizationName}</SelectedUserText>
                <OptionsMenu
                  customButtonComponent={IconButton}
                  options={[
                    {
                      name: 'Remove',
                      onClick: () => onDelete(u?.organizationIdentifier),
                    },
                  ]}
                >
                  <MoreVertIcon />
                </OptionsMenu>
              </SelectedUserItem>
            ))}
          </SelectedUsersContainer>
        </>
      )}
    </>
  );
};

export default OrganizationsSelect;
