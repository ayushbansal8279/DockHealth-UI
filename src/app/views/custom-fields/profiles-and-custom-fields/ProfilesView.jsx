import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProfileTypes, deleteProfileType } from 'api/profile-type-api';
import { openModal, closeModal } from 'modal/actions';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import {
  userHasCustomProfilesFeatureSelector,
  userHasProfileBuilderFeatureSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { capitalize } from 'helpers/capitalize';
import { getTemplateColumns, textFieldSx } from './helpers';
import { ViewContainer, AddButtonWrapper, AddButton, PlusIcon } from './styled';
import { createProfileType } from 'api/profile-type-api';
import { showGlobalAlert, showGlobalErrorAlert } from '@/app/alert/actions';
import AlertMessages from '@/app/alert/AlertMessages';
import { useBoolean } from 'react-use';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import ReusableDataGrid from '@/app/components/custom-profile/CustomProfilesList/DataGrid/DataGrid';

const PAGE_SIZE = 30;

const ProfilesAndCustomFieldsView = () => {
  const history = useHistory();
  const userProfile = useSelector(userProfileSelector);
  const [profileTypes, setProfileTypes] = useState([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [shouldShowInput, showInput] = useBoolean(false);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const textFieldRef = useRef(null);
  const customerTypeLabel = getCustomerTypeLabel(userProfile);

  const userHasCustomProfilesAvailable = useSelector(
    userHasCustomProfilesFeatureSelector,
  );

  const profileBuilderFeatureAvailable = useSelector(
    userHasProfileBuilderFeatureSelector,
  );

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  useEffect(() => {
    getAllProfileTypes().then((list) => {
      const typeList = list.map((type) => ({ ...type, id: type.identifier }));
      setProfileTypes(typeList);
    });
  }, []);

  const onEditProfile = useCallback(
    ({ row: { name, description, id } }) => {
      dispatch(
        openModal('CreateProfile', {
          onUpdated: (newTemplate) => {
            const { identifier } = newTemplate;
            setProfileTypes((s) =>
              s.map((profile) =>
                profile.identifier === identifier
                  ? { ...profile, ...newTemplate }
                  : profile,
              ),
            );
          },
          isCreatingNewField: false,
          template: { name, description, identifier: id },
        }),
      );
    },
    [dispatch],
  );

  const onConfigureCustomFields = useCallback(
    ({ row: { id, name, identifier } }) => {
      if (
        id.toLowerCase() === 'users' ||
        id.toLowerCase() === `${customerTypeLabel}s`
      ) {
        history.push(`/settings/custom-fields/${id.toLowerCase()}`);
        return;
      }
      history.push(`/settings/custom-fields/objects/${identifier}`);
    },
    [history, customerTypeLabel],
  );

  const onOpenProfileBuilder = useCallback(
    ({ row: { id, name, identifier } }) => {
      if (id.toLowerCase() === `${customerTypeLabel}s`) {
        history.push(`/settings/object-builder/${id.toLowerCase()}`);
        return;
      }
      history.push(`/settings/object-builder/objects/${identifier}`);
    },
    [history, customerTypeLabel],
  );

  const onDeleteProfile = useCallback(
    ({ id }) => {
      const modalProps = {
        title: 'Delete Object',
        description:
          'Are you sure you want to delete this object? This action cannot be undone.',
        confirm: () => {
          dispatch(closeModal());
          deleteProfileType(id);
          setProfileTypes((s) => s.filter((t) => t.identifier !== id));
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
    },
    [dispatch],
  );

  const columns = useMemo(
    () =>
      getTemplateColumns({
        onEditProfile,
        onDeleteProfile,
        onConfigureCustomFields,
        onOpenProfileBuilder,
        profileBuilderFeatureAvailable,
      }),
    [
      onEditProfile,
      onDeleteProfile,
      onConfigureCustomFields,
      onOpenProfileBuilder,
      profileBuilderFeatureAvailable,
    ],
  );

  let profileOptions = [
    { id: 'users', name: 'User', link: 'provider' },
    {
      id: `${customerTypeLabel}s`,
      name: `${capitalize(customerTypeLabel)}`,
      link: customerTypeLabel,
    },
  ];

  if (userHasCustomProfilesAvailable) {
    profileOptions = profileOptions.concat(profileTypes);
  }

  const onSaveNewProfile = () => {
    const data = {
      name: newProfileName,
    };
    if (!!newProfileName) {
      createProfileType(data)
        .then((newTemplate) => {
          dispatch(showGlobalAlert(AlertMessages.CREATED));
          const { identifier } = newTemplate;
          setProfileTypes((s) => [...s, { id: identifier, ...newTemplate }]);
          setNewProfileName('');
        })
        .catch(() => {
          dispatch(showGlobalErrorAlert());
        });
    }
  };

  const onAddProfile = () => {
    showInput();
    setTimeout(() => {
      if (textFieldRef.current) textFieldRef.current.focus();
    }, 100);
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Objects" />}>
      <ViewContainer>
        {userHasCustomProfilesAvailable && (
          <AddButtonWrapper>
            <AddButton onClick={onAddProfile}>
              <PlusIcon />
              New Object
            </AddButton>
          </AddButtonWrapper>
        )}
        <ReusableDataGrid
          columns={columns}
          rows={profileOptions}
          rowHeight={35}
        />
        {/* {shouldShowInput && (
          <TextField
            onChange={(e) => setNewProfileName(e.target.value)}
            inputRef={textFieldRef}
            sx={textFieldSx}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                ev.preventDefault();
                onSaveNewProfile();
              }
            }}
            value={newProfileName}
            placeholder="Object Name here"
            fullWidth
          />
        )} */}
      </ViewContainer>
    </ViewLayout>
  );
};

export default ProfilesAndCustomFieldsView;
