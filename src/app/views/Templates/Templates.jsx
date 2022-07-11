import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllTemplates, deleteTemplate } from 'api/template-api';
import { Box, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { StyledDataGrid } from './DataGridStyles';
import { getTemplateColumns } from './helpers';
import { ViewContainer, AddTemplateWrapper } from './styled';

const PAGE_SIZE = 30;

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllTemplates().then(list => setTemplates(list));
  }, []);

  const onAddTemplate = useCallback(() => {
    dispatch(
      openModal('EditTemplate', {
        onAdded: newTemplate => {
          setTemplates(s => [newTemplate, ...s]);
        },
      }),
    );
  }, [dispatch]);

  const onEditTemplate = useCallback(
    ({ id }) => {
      dispatch(
        openModal('EditTemplate', {
          template: templates.find(t => t.identifier === id),
          onUpdated: template => {
            setTemplates(s => [
              ...s.map(t =>
                t.identifier === template.identifier ? template : t,
              ),
            ]);
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
          setTemplates(s => [...s.filter(t => t.identifier !== id)]);
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
    },
    [dispatch],
  );

  const columns = useMemo(
    () => getTemplateColumns({ onEditTemplate, onDeteleTemplate }),
    [onDeteleTemplate, onEditTemplate],
  );

  return (
    <ViewLayout header={<BasicLayoutHeader title="Templates" />}>
      <ViewContainer>
        <Box display="flex" justifyContent="end">
          <Button onClick={onAddTemplate}>
            <AddTemplateWrapper>Create Template</AddTemplateWrapper>
          </Button>
        </Box>
        <StyledDataGrid
          columns={columns}
          rows={templates.map(t => ({ ...t, id: t.identifier }))}
          rowHeight={35}
          headerHeight={45}
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

export default Templates;
