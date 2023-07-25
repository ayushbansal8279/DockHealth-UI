import React, { useEffect, useState } from 'react';
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
import { Box, Stack } from '@mui/material';
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
  const [profiles, setProfiles] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');

  const fetchProfileTypes = () => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypes(data);
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

  // useEffect(() => {
  //   if (controller) {
  //     controller.column('RELATION').visilibity = false;
  //     console.log('!!:', controller.ref.current);
  //   }
  // }, [controller]);

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
        {/* eslint-disable-next-line react/button-has-type */}
        <button
          onClick={() => {
            // controller.column('RELATION').visilibity = false;
            // controller.ref.current.setColumnVisibility('RELATION', false);
            // console.log(controller.column('RELATION').visibility);
            controller.column('RELATION').visibility = false;
          }}
        >
          TEST
        </button>
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
          {profileTypes.map((field) => (
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
