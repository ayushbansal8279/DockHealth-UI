import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, {
  Data,
  useController,
  getValues,
} from 'ui-toolkit/Composite/DataGrid';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import {
  setCurrentUserGroup,
  unsetCurrentUserGroup,
} from 'actions/user-groups-actions';
import {
  Box,
  FormGroup,
  ListItemText,
  MenuItem,
  // Checkbox,
  Stack,
} from '@mui/material';
import { getAllProfiles } from 'api/profile-api';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { showGlobalErrorAlert } from 'alert/actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVert from '@mui/icons-material/MoreVert';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import { Add as AddIcon } from '@mui/icons-material';
import AdornedButton from 'components/common/AdornedButton/AdornedButton';
import ProfileDrawer from 'components/patients/CustomProfilesList/ProfileDrawer';
import SearchInput from 'components/common/SearchInput/SearchInput';
import Popover from 'ui-toolkit/Element/Popover';
import Toolbar from 'ui-toolkit/Composite/Toolbar';
import { Paper } from 'ui-toolkit/Element';
import CustomizeIcon from 'img/customize-icon.svg';
import { CustomizeImg } from 'components/patients/CustomizeToolbarButton/styled';
import Checkbox from 'components/common/Checkbox/Checkbox';
import AddButton from 'components/common/AddButton/AddButton';
import Button from "components/common/Button/Button";

const CustomProfileList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    groupIdentifier: groupIdentifierUrlParameter,
    name,
    profileTypeIdentifier,
  } = useParams();
  const groupIdentifier = getUserGroupIdentifierByUrlParameter(
    groupIdentifierUrlParameter,
  );
  useEffect(() => {
    dispatch(setCurrentUserGroup(groupIdentifier));

    return () => {
      dispatch(unsetCurrentUserGroup());
    };
  }, [dispatch, groupIdentifier]);

  const handleRecordClick = (event, { id }) => {
    // setOpen(id);
    history.push(`/custom-profiles/${name}/${profileTypeIdentifier}/${id}`);
  };

  const [open, setOpen] = useState(null);

  const handleClose = () => {
    setOpen(null);
  };

  const [profileTypes, setProfileTypes] = useState([]);
  const [filters, setFilters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');

  const fetchProfileTypes = useCallback(() => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypes(data);
        setFilters(data.map((profileType) => profileType.identifier));
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, profileTypeIdentifier]);

  const fetchProfiles = useCallback(() => {
    getAllProfiles(profileTypeIdentifier)
      .then((data) => {
        setProfiles(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, profileTypeIdentifier]);

  useEffect(() => {
    fetchProfileTypes();
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileAddClick = () => {
    setOpen(true);
  };

  const handleSearchInputChange = (value) => {
    setSearchPhrase(value);
  };

  const controller = useController();
  const buttonReference = useRef(null);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const handlePopoverOpen = () => {
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  const handleFilterChange = (field) => () => {
    if (filters.includes(field.identifier)) {
      setFilters(filters.filter((filter) => filter !== field.identifier));
    } else {
      setFilters([...filters, field.identifier]);
    }
  };

  return (
    <>
      <ViewLayout
        header={
          <LayoutHeader>
            <Box position="absolute" top={27} left={10}>
              <OptionsMenu disablePortal options={[]}>
                <MoreVert color="primary" />
              </OptionsMenu>
            </Box>
            <LayoutHeader.Title title={name} description="Some description" />
          </LayoutHeader>
        }
      >
        <ProfileDrawer
          title={name}
          open={open}
          profileTypeIdentifier={profileTypeIdentifier}
          types={profileTypes}
          onClose={handleClose}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ m: '16px 32px 0px 32px ' }}
        >
          <Box display="flex" alignItems="center" width="300px">
            <SearchInput onValueChange={handleSearchInputChange} />
          </Box>
          <Box mx={1} />
          <Box display="flex" my={2.5}>
            <Button fullWidth onClick={() => null} size="small">
              Search
            </Button>
          </Box>
          <Box mx={1} />
          <Box display="flex" flex="1 1 auto" alignItems="start" my={2}>
            <Toolbar>
              <Toolbar.Button ref={buttonReference} onClick={handlePopoverOpen}>
                <CustomizeImg
                  src={CustomizeIcon}
                  alt="view type icon"
                  iconColorFilterActive={isPopoverOpen}
                />
                <Box mr={1} />
                Customize
              </Toolbar.Button>
            </Toolbar>
            <Popover
              anchorEl={buttonReference?.current}
              open={isPopoverOpen}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Paper
                sx={{
                  p: 1,
                }}
              >
                <strong>Custom Columns</strong>
                <FormGroup>
                  {profileTypes.map((field) => {
                    return (
                      <MenuItem
                        key={field.identifier}
                        onClick={handleFilterChange(field)}
                      >
                        <Checkbox
                          isChecked={filters.includes(field.identifier)}
                        />
                        <Box mx={0.5} />
                        <ListItemText>{field.name}</ListItemText>
                      </MenuItem>
                    );
                  })}
                </FormGroup>
              </Paper>
            </Popover>
          </Box>
          <Box m={1} />
          <Box display="flex" alignItems="center">
            <Box m={1} />
            <AddButton onClick={handleProfileAddClick}>
              ADD A {name.toUpperCase()}
            </AddButton>
          </Box>
        </Stack>
        <DataGrid
          fluid
          controller={controller}
          dataset={profiles.filter(
            (profile) =>
              profile.fields &&
              getValues(profile).some(
                (value) => value && value?.includes(searchPhrase),
              ),
          )}
          onRecordClick={handleRecordClick}
        >
          {profileTypes
            .filter((profileType) => filters.includes(profileType.identifier))
            .map((field) => (
              <Data
                key={field.identifier}
                name={field.name}
                value={(data) => {
                  const record = data.fields?.find(
                    ({ profileTypeField }) =>
                      field.identifier === profileTypeField.identifier,
                  );

                  if (record) {
                    switch (field.fieldType) {
                      case 'TEXT': {
                        return record.values?.[0].value;
                      }
                      case 'PICK_LIST': {
                        return record.values?.[0].customFieldOption?.name;
                      }
                      default: {
                        return '';
                      }
                    }
                  }

                  return '';
                }}
              />
            ))}
        </DataGrid>
      </ViewLayout>
    </>
  );
};

export default CustomProfileList;
