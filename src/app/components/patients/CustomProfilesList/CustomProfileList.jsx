import React, { useEffect, useRef, useState } from 'react';
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
  Checkbox,
  FormControlLabel,
  FormGroup,
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

  const fetchProfileTypes = () => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypes(data);
        setFilters(data.map((profileType) => profileType.identifier));
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  const fetchProfiles = () => {
    getAllProfiles(profileTypeIdentifier)
      .then((data) => {
        setProfiles(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

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

  const handleFilterChange = (field) => (event) => {
    const checkbox = event.target;
    if (checkbox) {
      if (checkbox.checked) {
        setFilters([...filters, field.identifier]);
      } else {
        setFilters(filters.filter((filter) => filter !== field.identifier));
      }
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
          <Box display="flex" alignItems="center">
            <SearchInput onValueChange={handleSearchInputChange} />
          </Box>
          <Box m={1} />
          <Box display="flex" alignItems="center">
            <Toolbar>
              <Toolbar.Button ref={buttonReference} onClick={handlePopoverOpen}>
                <CustomizeImg
                  src={CustomizeIcon}
                  alt="view type icon"
                  iconColorFilterActive={isPopoverOpen}
                />
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
              <Paper>
                <FormGroup>
                  {profileTypes.map((field) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.includes(field.identifier)}
                            onClick={handleFilterChange(field)}
                          />
                        }
                        label={field.name}
                      />
                    );
                  })}
                </FormGroup>
              </Paper>
            </Popover>
          </Box>
          <Box m={1} />
          <Box display="flex" alignItems="center">
            <Box m={1} />
            <AdornedButton
              adornment={<AddIcon />}
              onClick={handleProfileAddClick}
            >
              ADD A PROVIDER
            </AdornedButton>
          </Box>
        </Stack>
        <DataGrid
          controller={controller}
          dataset={profiles.filter((profile) =>
            getValues(profile).some(
              (value) => value && value.includes(searchPhrase),
            ),
          )}
          onRecordClick={handleRecordClick}
        >
          {profileTypes
            .filter((profileType) => filters.includes(profileType.identifier))
            .map((field) => (
              <Data
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
