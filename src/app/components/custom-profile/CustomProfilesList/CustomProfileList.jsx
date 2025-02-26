import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, {
  Data,
  useController,
  getValues,
} from 'ui-toolkit/Composite/DataGrid';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getUserGroupIdentifierByUrlParameter } from 'helpers/user-groups-helper';
import {
  setCurrentUserGroup,
  unsetCurrentUserGroup,
} from 'actions/user-groups-actions';
import { Box, Dialog, FormGroup, ListItemText, MenuItem, Stack, Switch } from '@mui/material';
import { getAllProfileTypes } from 'api/profile-type-api';
import { getAllProfiles } from 'api/profile-api';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { showGlobalErrorAlert } from 'alert/actions';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import ProfileDrawer from 'components/custom-profile/CustomProfilesList/ProfileDrawer';
import SearchInput from 'components/common/SearchInput/SearchInput';
import Popover from 'ui-toolkit/Element/Popover';
import Toolbar from 'ui-toolkit/Composite/Toolbar';
import { Paper } from 'ui-toolkit/Element';
import CustomizeIcon from 'img/customize-icon.svg';
import { CustomizeImg } from 'components/patients/CustomizeToolbarButton/styled';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ToolbarButton from '../../tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';
import ProfileFilter from '../ProfileFilter/ProfileFilter';
import OptionsMenu from '../../common/OptionsMenu/OptionsMenu';
import { MoreVert } from '@mui/icons-material';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { isUserGuestOrDockLite, isUserViewOnly } from '@/app/helpers/user-helper';
import { downloadProfileData, downloadProfileImportTemplate, uploadProfileData } from '@/app/api/profile-api';
import { initializeProfileState } from '@/app/actions/profile-actions';
import ImportDataModal from '@/app/modal/components/ImportDataModal/ImportDataModal';
import ProfileImportPopover from './ProfileImportPopover';


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
    dispatch(initializeProfileState(profileTypeIdentifier));
  }, [dispatch, profileTypeIdentifier]);

  useEffect(() => {
    dispatch(setCurrentUserGroup(groupIdentifier));

    return () => {
      dispatch(unsetCurrentUserGroup());
    };
  }, [dispatch, groupIdentifier]);

  const handleRecordClick = (event, { id }) => {
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
  // console.log(profiles);
  const currentUser = useSelector(userProfileSelector);
  const [importPopupOpen, setImportPopupOpen] = useState(false);
  const [importPopoverOpen, setImportPopoverOpen] = useState(false);
  const [importResponse, setImportResponse] = useState(null);
  
  const isGuestOrDockLite = isUserGuestOrDockLite(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);

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

  const handleDownloadProfileData = () => {
    const filename = `Dock ${currentProfileType?.name}.csv`;
    downloadProfileData(profileTypeIdentifier, filename);
};
  
  return (
    <>
      <ViewLayout
        header={
          <LayoutHeader> 
            <Box
              position="absolute"
              top={currentProfileType?.description ? 17 : 27}
              left={10}
            >
              <OptionsMenu
                disablePortal
                options={[
                  !isGuestOrDockLite &&
                    !isViewOnly && {
                      name: 'Import from Excel or CSV',
                      onClick: () => {
                        setImportPopupOpen(true);
                      },
                    },
                  !isGuestOrDockLite &&
                    !isViewOnly && {
                      name: 'Export to CSV',
                      onClick: () => {
                        handleDownloadProfileData();
                      },
                    }
                ]}
              >
                <MoreVert color="primary" />
              </OptionsMenu>
            </Box>
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
          <Box display="flex" alignItems="start" my={2}>
            <Toolbar>
              <div style={{ marginTop: '3px' }}>
                <ToolbarButton
                  ref={buttonReference}
                  icon={
                    <CustomizeImg src={CustomizeIcon} alt="view type icon" />
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
                        <Switch
                          checked={filters.includes(field.identifier)}
                        />
                        <Box mx={0.5} />
                        <ListItemText>{field.name}</ListItemText>
                      </MenuItem>
                    );
                  })}
                </FormGroup>
              </Paper>
            </Popover>
            <Box display="flex" alignItems="center" my={0.4} mx={2}>
              <ProfileFilter
                profileTypeIdentifier={profileTypeIdentifier}
                fetchProfiles={fetchProfiles}
                setProfiles={setProfiles}
              />
            </Box>
            <Box display="flex" alignItems="center" width="400px" my={0.4}>
              <SearchInput
                value={searchPhrase}
                onValueChange={handleSearchInputChange}
              />
            </Box>
          </Box>
          <Box m={1} />
          <Box display="flex" alignItems="center">
            <ToolbarButton
              icon={
                <span style={{ marginLeft: '-5px' }}>
                  <AddIcon />
                </span>
              }
              onClick={handleProfileAddClick}
              isOpen={open}
              active={open}
            >
              <span style={{ marginLeft: '-5px' }}>
                Add a {currentProfileType?.name}
              </span>
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
                      case 'MULTI_SELECT':
                      case 'PICK_LIST': {
                        return (
                          record.references
                            ?.map((item) => item.displayValue)
                            .join(', ') ||
                          record.values?.join(', ') ||
                          ''
                        );
                      }
                      case 'RELATIONSHIP': {
                        return record.references
                          ?.map((item) => item.displayValue)
                          .join(', ');
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
      <Dialog
        open={importPopupOpen}
        onClose={() => setImportPopupOpen(false)}
        PaperProps={{
          elevation: 0,
          square: true,
          style: {},
        }}
      >
        <ImportDataModal
          closeModal={() => {
            setImportPopupOpen(false);
          }}
          downloadTemplate={() => downloadProfileImportTemplate(profileTypeIdentifier)}
          setImportPopoverOpen={setImportPopoverOpen}
          step={1}
          label="profile"
          uploadFunction={uploadProfileData}
          identifier={profileTypeIdentifier}
          setImportResponse={setImportResponse}
        />
      </Dialog>
      {importPopoverOpen && (
        <ProfileImportPopover
          closePopover={() => {
            setImportPopoverOpen(false);
          }}
          uploadResponse={importResponse}
        />
      )}
    </>
  );
};

export default CustomProfileList;
