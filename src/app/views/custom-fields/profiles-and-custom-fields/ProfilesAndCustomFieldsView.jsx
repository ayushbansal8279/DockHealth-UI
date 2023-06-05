import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTemplates, deleteTemplate } from 'api/template-api';
import { Box, Button } from '@mui/material';
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
  const [templates, setTemplates] = useState([]);
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
    getAllTemplates().then((list) => setTemplates(list));
  }, []);

  const onAddProfile = useCallback(() => {
    dispatch(
      openModal('CreateProfile', {
        onAdded: (newTemplate) => {
          setTemplates((s) => [newTemplate, ...s]);
        },
      }),
    );
  }, [dispatch]);

  const onEditProfile = useCallback(
    ({ row: { link } }) => {
      history.push(`/settings/custom-fields/${link}`);
    },
    [history],
  );

  const onConfigureCustomFields = useCallback(
    ({ row: { link } }) => {
      history.push(`/settings/custom-fields/${link}`);
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
          deleteTemplate(id);
          setTemplates((s) => s.filter((t) => t.identifier !== id));
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
        <Box display="flex" justifyContent="end">
          <Button onClick={onAddProfile}>
            <AddTemplateWrapper>Create Profile</AddTemplateWrapper>
          </Button>
        </Box>
        <StyledDataGrid
          columns={columns}
          rows={[
            { id: 'users', name: 'Users', link: 'provider' },
            { id: 'patient', name: 'Patients', link: 'patient' },
            { id: 'provider', name: 'Providers', link: 'provider' },
            { id: 'faculty', name: 'Faculties', link: 'provider' },
          ]}
          rowHeight={55}
          headerHeight={25}
          page={page}
          onPageChange={({ page: p }) => setPage(p)}
          pageSize={PAGE_SIZE}
          disableColumnMenu
          disableSelectionOnClick
        />
      </ViewContainer>
    </ViewLayout>
  );
};

export default ProfilesAndCustomFieldsView;
