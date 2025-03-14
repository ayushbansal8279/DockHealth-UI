import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { Box, Chip, Grid, Typography } from '@mui/material';
// import Tooltip from 'components/common/Tooltip/Tooltip';
import {
  userProfileSelector,
  // selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import { CUSTOM_PROFILES_PATH } from 'routing/helpers/paths';
// import { organizationSelector } from 'selectors/organization-selectors';
// import { FieldType } from 'helpers/field-type-helpers';
import {
  TASK_LIST_RESTRICTIONS_OPTIONS,
  TASK_LIST_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import { getAllProfileFieldTypes } from 'api/profile-type-field-api';
import { showGlobalErrorAlert } from 'alert/actions';
import { getProfileDetails } from 'api/profile-api';
import ProfileDetailsLoader from 'views/custom-profile-details/ProfileDetailsLoader/ProfileDetailsLoader';
import ProfileDrawer from 'components/custom-profile/CustomProfilesList/ProfileDrawer';
import { FieldType } from 'helpers/field-type-helpers';
import { getProfileName } from 'views/custom-profile-details/helpers';
import {
  ProfileDetailsContainer,
  ProfileName,
  ProfileInfo,
  ProfileInfoDivider,
  ProfileDetailsInformation,
  ProfileDetailsLabel,
  ButtonContainer,
} from './styled';

const { DISABLED } = TASK_LIST_RESTRICTIONS_OPTIONS;

// eslint-disable-next-line sonarjs/cognitive-complexity
const ProfileDetailsHeader = () => {
  const dispatch = useDispatch();
  const { name, profileTypeIdentifier, profileIdentifier } = useParams();
  const [profileTypeFields, setProfileTypeFields] = useState([]);
  const [profile, setProfile] = useState([]);
  const [profileName, setProfileName] = useState('');

  const fetchProfileTypeFields = () => {
    getAllProfileFieldTypes(profileTypeIdentifier)
      .then((data) => {
        setProfileTypeFields(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  const fetchProfile = () => {
    getProfileDetails(profileIdentifier)
      .then((data) => {
        setProfile(data);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  // const profile = useMemo(
  //   () => profiles.find(({ identifier }) => identifier === profileIdentifier),
  //   [profiles, profileIdentifier],
  // );

  // const profileHeader = useMemo(
  //   () =>
  //     Object.fromEntries(
  //       profile?.fields
  //         .filter((field) =>
  //           field?.profileTypeField?.displayOptions?.includes('PROFILE_HEADER'),
  //         )
  //         .map((field) => {
  //           return [
  //             field.profileTypeField.name,
  //             field.values?.[0].value ||
  //               field.values?.[0]?.customFieldOption.name,
  //           ];
  //         }) || [],
  //     ),
  //   [profile],
  // );

  useEffect(() => {
    fetchProfileTypeFields();
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIdentifier]);

  useEffect(() => {
    const profileNameInfo = getProfileName(profileTypeFields, profile);
    setProfileName(profileNameInfo);
  }, [profile, profileTypeFields]);

  const history = useHistory();
  const location = useLocation();
  // const [isDrawerOpen, setIsDrawerOpen, unsetIsDrawerOpen] = useBoolean(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  // const currentOrganization = useSelector(selectedUserOrganizationSelector);
  // const organization = useSelector(organizationSelector);
  const [cameFrom, setCameFrom] = useState();
  const taskListRestrictions =
    TASK_LIST_RESTRICTIONS_PROFILES[currentUser?.orgUserRole];
  const embeddedMode = sessionStorage.getItem('EmbeddedMode') || false;

  const goBack = useCallback(() => {
    if (cameFrom) {
      history.push(cameFrom);
    } else {
      history.push(`${CUSTOM_PROFILES_PATH}/${profileTypeIdentifier}`);
    }
  }, [cameFrom, history, profileTypeIdentifier]);

  useEffect(() => {
    if (location?.state?.from) setCameFrom(location.state.from);
  }, [location]);

  return (
    <ProfileDetailsContainer>
      {false ? (
        <Box pl="30px">
          <ProfileDetailsLoader />
        </Box>
      ) : (
        <>
          <Box display="flex" alignItems="center">
            <Box flex="1 0 0" display="flex" alignItems="center">
              <Grid container alignItems="center">
                <Box flexBasis={30}>
                  {(!embeddedMode || cameFrom) && (
                    <button type="button" onClick={goBack}>
                      <img
                        src={ArrowLeftIcon}
                        alt="back-navigation"
                        style={{ width: '16px' }}
                      />
                    </button>
                  )}
                </Box>
                <ProfileName>
                  {[
                    `${profileName?.[1] ? profileName?.[1]+',' : ''}`,
                    profileName?.[0],
                    profileName?.[2],
                  ].join(' ')}
                </ProfileName>
                <Box mx={1} />
                {taskListRestrictions?.createTask !== DISABLED && (
                  <ButtonContainer onClick={() => setIsDrawerOpen(true)}>
                    <ProfileDetailsLabel>View details</ProfileDetailsLabel>
                  </ButtonContainer>
                )}
              </Grid>
            </Box>
          </Box>
          <Box>
            <ProfileDetailsInformation>
              {profile?.fields
                ?.filter((field) => {
                  const profileTypeField = profileTypeFields?.find(
                    (ptField) =>
                      ptField.identifier === field?.profileTypeFieldIdentifier,
                  );
                  return profileTypeField?.displayOptions?.includes(
                    'PROFILE_HEADER',
                  );
                })
                .map((field) => {
                  return (
                    <React.Fragment key={field.identifier}>
                      <ProfileInfo>
                        <Typography>{field.profileTypeFieldName}: </Typography>
                        <Box ml={1} />
                        {field.profileTypeFieldType === FieldType.DROPDOWN_MULTI ||
                          field.profileTypeFieldType === FieldType.DROPDOWN ||
                          field.profileTypeFieldType === FieldType.RELATIONSHIP
                          ? `${
                              field.references
                                ?.map((item) => item.displayValue)
                                .join(', ') ||
                              field.values?.join(',') ||
                              field.value ||
                              ''
                            }`
                          : `${field.values?.join(',') || field.value || ''}`}
                      </ProfileInfo>
                      <ProfileInfoDivider />
                    </React.Fragment>
                  );
                })}
            </ProfileDetailsInformation>
          </Box>
          <ProfileDrawer
            title={[
              `${profileName?.[1] ? profileName?.[1]+',' : ''}`,
              profileName?.[0],
              profileName?.[2],
            ].join(' ')}
            open={isDrawerOpen}
            profileTypeIdentifier={profileTypeIdentifier}
            profile={profile}
            profileName={profileName}
            types={profileTypeFields}
            onClose={() => {
              setIsDrawerOpen(false);
            }}
            onUpdate={() => {
              fetchProfile();
            }}
          />
        </>
      )}
    </ProfileDetailsContainer>
  );
};

export default ProfileDetailsHeader;
