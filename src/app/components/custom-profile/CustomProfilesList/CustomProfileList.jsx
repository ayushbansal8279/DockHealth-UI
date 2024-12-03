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
import { getAllProfileTypes } from 'api/profile-type-api';
import { getAllProfiles } from 'api/profile-api';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { showGlobalErrorAlert } from 'alert/actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVert from '@mui/icons-material/MoreVert';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
// import { Add as AddIcon } from '@mui/icons-material';
// import AdornedButton from 'components/common/AdornedButton/AdornedButton';
import ProfileDrawer from 'components/custom-profile/CustomProfilesList/ProfileDrawer';
import SearchInput from 'components/common/SearchInput/SearchInput';
import Popover from 'ui-toolkit/Element/Popover';
import Toolbar from 'ui-toolkit/Composite/Toolbar';
import { Paper } from 'ui-toolkit/Element';
import CustomizeIcon from 'img/customize-icon.svg';
import { CustomizeImg } from 'components/patients/CustomizeToolbarButton/styled';
import Checkbox from 'components/common/Checkbox/Checkbox';
import AddButton from 'components/common/AddButton/AddButton';
import Button from 'components/common/Button/Button';
import ToolbarButton from '../../tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';

const CustomProfileList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    groupIdentifier: groupIdentifierUrlParameter,
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
    history.push(`/custom-profiles/${profileTypeIdentifier}/${id}`);
  };

  const [open, setOpen] = useState(null);

  const handleClose = () => {
    setOpen(null);
  };

  const [profileTypes, setProfileTypes] = useState([]);
  const [profileTypeFields, setProfileTypeFields] = useState([]);
  const [currentProfileType, setCurrentProfileType] = useState('');
  const [filters, setFilters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');

  const fetchProfileTypes = useCallback(() => {
    getAllProfileTypes()
      .then((data) => {
        setProfileTypes(data);
        const selectedProfileType = data.find(
          (profileType) => profileType.identifier === profileTypeIdentifier,
        );
        setCurrentProfileType(selectedProfileType);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  }, [dispatch, profileTypeIdentifier]);

  const fetchProfileTypeFields = useCallback(() => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypeFields(data);
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
    fetchProfileTypeFields();
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
            {/* Kept for future to use menu options for CUstom Profile */}
            {/* <Box position="absolute" top={27} left={10}>
              <OptionsMenu disablePortal options={[]}>
                <MoreVert color="primary" />
              </OptionsMenu>
            </Box> */}
            <LayoutHeader.Title
              title={currentProfileType?.name}
              description={currentProfileType?.description}
            />
          </LayoutHeader>
        }
      >
        <ProfileDrawer
          title={currentProfileType?.name}
          open={open}
          profileTypeIdentifier={profileTypeIdentifier}
          types={profileTypeFields}
          onClose={handleClose}
          onUpdate={() => {
            fetchProfiles();
          }}
          addMode
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ m: '16px 32px 0px 32px ' }}
        >
          {/* <Box display="flex" alignItems="center" width="300px">
            <SearchInput onValueChange={handleSearchInputChange} />
          </Box>
          <Box mx={1} />
          <Box display="flex" my={2.5}>
            <Button fullWidth onClick={() => null} size="small">
              Search
            </Button>
          </Box>
          <Box mx={1} /> */}
          <Box display="flex" flex="1 1 auto" alignItems="start" my={2}>
            {/* <Toolbar>
              <Toolbar.Button ref={buttonReference} onClick={handlePopoverOpen}>
                <CustomizeImg
                  src={CustomizeIcon}
                  alt="view type icon"
                  iconColorFilterActive={isPopoverOpen}
                />
                <Box mr={1} />
                Customize
              </Toolbar.Button>
            </Toolbar> */}
            <Toolbar>
              <div style={{ marginTop: '3px' }}>
                <ToolbarButton
                  ref={buttonReference}
                  icon={
                    <CustomizeImg
                      src={CustomizeIcon}
                      alt="view type icon"
                      // iconColorFilterActive={isPopoverOpen}
                    />
                  }
                  onClick={handlePopoverOpen}
                  isOpen={isPopoverOpen}
                  active={isPopoverOpen}
                  hasPopover
                >
                  Customize
                </ToolbarButton>
              </div>
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
                  {profileTypeFields.map((field) => {
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
            <Box mx={0.5} />
            <Box display="flex" alignItems="center" width="400px" my={0.4}>
              {/* <Box display="flex" width="120px"> */}
              <SearchInput
                value={searchPhrase}
                onValueChange={handleSearchInputChange}
              />
              {/* </Box> */}
            </Box>
          </Box>
          <Box m={1} />
          <Box display="flex" alignItems="center">
            <ToolbarButton
              // ref={buttonReference}
              icon={
                <span style={{ marginLeft: '-5px' }}>
                  <AddIcon />
                </span>
              }
              onClick={handleProfileAddClick}
              isOpen={open}
              active={open}
              // hasPopover
            >
              {/* <AddButton onClick={handleProfileAddClick}> */}
              <span style={{ marginLeft: '-5px' }}>
                Add a {currentProfileType?.name}
              </span>
              {/* </AddButton> */}
            </ToolbarButton>
          </Box>
        </Stack>
        <DataGrid
          fluid
          sx={{
            '& .MuiTablePagination-select': {
              paddingLeft: '1rem',
            },
          }}
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
          {profileTypeFields
            .filter((profileTypeField) =>
              filters.includes(profileTypeField.identifier),
            )
            .map((field) => (
              <Data
                key={field.identifier}
                name={field.name}
                value={(data) => {
                  const record = data.fields?.find(
                    (profileField) =>
                      field.identifier ===
                      profileField.profileTypeFieldIdentifier,
                  );

                  if (record) {
                    switch (field.fieldType) {
                      case 'TEXT': {
                        return (
                          record.values?.[0] || record.values?.[0]?.value || ''
                        );
                      }
                      case 'PICK_LIST': {
                        return (
                          record.references?.map(item => item.displayValue).join(", ") ||
                          record.values?.join(", ") ||
                          ''
                        );
                      }
                      case 'RELATIONSHIP': {
                        return (
                          record.references?.map(item => item.displayValue).join(", ")
                        );
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
