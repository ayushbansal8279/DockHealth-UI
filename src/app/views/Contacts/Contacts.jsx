import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from 'modal/actions';
import { getAllContacts, deleteContact } from 'api/contacts-api';
import { StyledDataGrid } from './DataGridStyles';
import { getContactColumns } from './helpers';
import { AddContactWrapper, ViewContainer } from './styled';

const PAGE_SIZE = 30;

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllContacts().then(list => setContacts(list));
  }, []);

  const onAddContact = useCallback(() => {
    dispatch(
      openModal('EditContact', {
        onAdded: newContact => {
          setContacts(s => [newContact, ...s]);
        },
      }),
    );
  }, [dispatch]);

  const onEditContact = useCallback(
    ({ id }) => {
      dispatch(
        openModal('EditContact', {
          contact: contacts.find(t => t.identifier === id),
          onUpdated: contact => {
            setContacts(s => [
              ...s.map(t =>
                t.identifier === contact.identifier ? contact : t,
              ),
            ]);
          },
        }),
      );
    },
    [dispatch, contacts],
  );

  const onDeteleContact = useCallback(
    ({ id }) => {
      const modalProps = {
        title: 'Delete contact',
        description:
          'Are you sure you want to delete this contact? This action cannot be undone.',
        confirm: () => {
          dispatch(closeModal());
          deleteContact(id);
          setContacts(s => [...s.filter(t => t.identifier !== id)]);
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
    },
    [dispatch],
  );

  const columns = useMemo(
    () => getContactColumns({ onEditContact, onDeteleContact }),
    [onDeteleContact, onEditContact],
  );

  return (
    <ViewLayout header={<BasicLayoutHeader title="Contacts" />}>
      <ViewContainer>
        <Box display="flex" justifyContent="end">
          <Button onClick={onAddContact}>
            <AddContactWrapper>Create Contact</AddContactWrapper>
          </Button>
        </Box>
        <StyledDataGrid
          columns={columns}
          rows={contacts.map(t => ({ ...t, id: t.identifier }))}
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

export default Contacts;
