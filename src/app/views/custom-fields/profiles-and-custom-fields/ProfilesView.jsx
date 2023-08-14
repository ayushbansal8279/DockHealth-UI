import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProfileTypes, deleteProfileType } from 'api/profile-type-api';
import { Box, Button } from '@mui/material';
import AddButton, {
  AddEntitiesContainer,
} from 'components/common/AddButton/AddButton';
import { openModal, closeModal } from 'modal/actions';
import {
  userHasSendEmailFeatureSelector,
  userHasSendFaxFeatureSelector,
  userHasSendSmsFeatureSelector,
  userHasPostEMRNoteFeatureSelector,
  userHasSendSecureMessageFeatureSelector,
} from 'selectors/user-selectors';
import { StyledDataGrid } from './DataGridStyles';
import { getTemplateColumns } from './helpers';
import { ViewContainer, AddTemplateWrapper } from './styled';

const PAGE_SIZE = 30;

const ProfilesAndCustomFieldsView = () => {
  const history = useHistory();
  const [profileTypes, setProfileTypes] = useState([]);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const sendFaxAvailable = useSelector(userHasSendFaxFeatureSelector);
  const sendSmsAvailable = useSelector(userHasSendSmsFeatureSelector);
  const sendSecureMessageAvailable = useSelector(
    userHasSendSecureMessageFeatureSelector,
  );
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);

  useEffect(() => {
    if (
      sendEmailAvailable ||
      sendFaxAvailable ||
      sendSmsAvailable ||
      postToEMRAvailable ||
      sendSecureMessageAvailable
    ) {
      // continue
    } else {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllProfileTypes().then((list) => {
      const typeList = list.map((type) => ({ ...type, id: type.identifier }));
      setProfileTypes(typeList);
    });
  }, []);

  const onAddProfile = useCallback(() => {
    dispatch(
      openModal('CreateProfile', {
        onAdded: (newTemplate) => {
          const { identifier } = newTemplate;
          setProfileTypes((s) => [...s, { id: identifier, ...newTemplate }]);
        },
        isCreatingNewField: true,
      }),
    );
  }, [dispatch]);

  const onEditProfile = useCallback(
    ({ row: { name, description, id } }) => {
      dispatch(
        openModal('CreateProfile', {
          onUpdated: (newTemplate) => {
            const { identifier } = newTemplate;
            setProfileTypes((s) => [...s, { id: identifier, ...newTemplate }]);
          },
          isCreatingNewField: false,
          template: { name, description, identifier: id },
        }),
      );
    },
    [dispatch],
  );

  const onConfigureCustomFields = useCallback(
    ({ row: { name, identifier } }) => {
      if (name.toLowerCase() === 'users' || name.toLowerCase() === 'patients') {
        history.push(`/settings/custom-fields/${name.toLowerCase()}`);
        return;
      }
      history.push(
        `/settings/custom-fields/${name.toLowerCase()}/${identifier}`,
      );
    },
    [history],
  );

  const onDeleteProfile = useCallback(
    ({ id }) => {
      const modalProps = {
        title: 'Delete Profile',
        description:
          'Are you sure you want to delete this profile? This action cannot be undone.',
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
      }),
    [onDeleteProfile, onEditProfile, onConfigureCustomFields],
  );

  return (
    <ViewLayout header={<BasicLayoutHeader title="Profiles" />}>
      <ViewContainer>
        {/* <Box display="flex" justifyContent="end">
          <Button onClick={onAddProfile}>
            <AddTemplateWrapper>Create Profile</AddTemplateWrapper>
          </Button>
        </Box> */}
        <AddEntitiesContainer>
          <AddButton onClick={onAddProfile}>Create Profile</AddButton>
        </AddEntitiesContainer>
        <StyledDataGrid
          columns={columns}
          rows={[
            { id: 'users', name: 'Users', link: 'provider' },
            { id: 'patient', name: 'Patients', link: 'patient' },
            ...profileTypes,
          ]}
          rowHeight={35}
          headerHeight={45}
          page={page}
          onPageChange={({ page: p }) => setPage(p)}
          pageSize={PAGE_SIZE}
          hideFooterSelectedRowCount
          autoHeight
          disableColumnMenu
          disableSelectionOnClick
          showColumnRightBorder
          showCellRightBorder
        />
      </ViewContainer>
    </ViewLayout>
  );
};

export default ProfilesAndCustomFieldsView;
