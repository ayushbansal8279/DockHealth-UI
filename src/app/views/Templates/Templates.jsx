import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import {
  getAllTemplates,
  deleteTemplate,
  duplicateTemplate,
} from 'api/template-api';
import { openModal, closeModal } from 'modal/actions';
import AddButton, {
  AddEntitiesContainer,
} from 'components/common/AddButton/AddButton';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import {
  userHasSendEmailFeatureSelector,
  userHasSendFaxFeatureSelector,
  userHasSendSmsFeatureSelector,
  userHasPostEMRNoteFeatureSelector,
  userHasSendSecureMessageFeatureSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { StyledDataGrid } from './DataGridStyles';
import { getTemplateColumns } from './helpers';
import { ViewContainer } from './styled';
import { AddIcon } from '../smart-flow-builder/TaskNodeHandles/styled';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import ReusableDataGrid from '@/app/components/custom-profile/CustomProfilesList/DataGrid/DataGrid';

// const PAGE_SIZE = 30;

const Templates = () => {
  const history = useHistory();
  const userProfile = useSelector(userProfileSelector);
  const [templates, setTemplates] = useState([]);
  // const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  const sendEmailAvailable = useSelector(userHasSendEmailFeatureSelector);
  const sendFaxAvailable = useSelector(userHasSendFaxFeatureSelector);
  const sendSmsAvailable = useSelector(userHasSendSmsFeatureSelector);
  const sendSecureMessageAvailable = useSelector(
    userHasSendSecureMessageFeatureSelector,
  );
  const postToEMRAvailable = useSelector(userHasPostEMRNoteFeatureSelector);

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

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

  const onAddTemplate = useCallback(() => {
    dispatch(
      openModal('EditTemplate', {
        onAdded: (newTemplate) => {
          setTemplates((s) => [newTemplate, ...s]);
        },
      }),
    );
  }, [dispatch]);

  const onEditTemplate = useCallback(
    ({ id }) => {
      dispatch(
        openModal('EditTemplate', {
          template: templates.find((t) => t.identifier === id),
          onUpdated: (template) => {
            setTemplates((s) =>
              s.map((t) =>
                t.identifier === template.identifier ? template : t,
              ),
            );
          },
        }),
      );
    },
    [dispatch, templates],
  );

  const onDeteleTemplate = useCallback(
    ({ id }) => {
      const modalProps = {
        title: 'Delete template',
        description:
          'Are you sure you want to delete this template? This action cannot be undone.',
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

  const onDuplicateTemplate = useCallback(
    ({ id, ...data }) => {
      duplicateTemplate(id).then((data) => {
        setTemplates((s) => [data, ...s]);
      });
    },
    [dispatch, templates],
  );

  const columns = useMemo(
    () =>
      getTemplateColumns({
        onEditTemplate,
        onDeteleTemplate,
        onDuplicateTemplate,
      }),
    [onDeteleTemplate, onEditTemplate, onDuplicateTemplate],
  );

  return (
    <ViewLayout header={<BasicLayoutHeader title="Templates" />}>
      <ViewContainer>
        <AddEntitiesContainer>
          <ToolbarButton
            icon={
              <Typography sx={{ ml: '-5px' }}>
                <AddIcon />
              </Typography>
            }
            onClick={onAddTemplate}
          >
            Create Template
          </ToolbarButton>
        </AddEntitiesContainer>
        <ReusableDataGrid
          columns={columns}
          rows={templates.map((t) => ({ ...t, id: t.identifier }))}
          rowHeight={35}
          headerHeight={45}
          disableSelectionOnClick
        />
      </ViewContainer>
    </ViewLayout>
  );
};

export default Templates;
