import React from 'react';
import { MoreActionsWrapper } from 'views/person-details/PersonDetailsDrawer/styled';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import palette from 'styles/palette';

const renderColumnHeader = props => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <span>{headerName}</span>
      </div>
    </>
  );
};

export const getContactColumns = ({ onEditContact, onDeteleContact }) => [
  {
    field: 'type',
    headerName: 'Contact Type',
    width: 150,
    renderHeader: renderColumnHeader,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    renderHeader: renderColumnHeader,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 250,
    renderHeader: renderColumnHeader,
  },
  {
    field: 'mobilePhoneNumber',
    headerName: 'Phone',
    width: 120,
    renderHeader: renderColumnHeader,
  },
  {
    field: 'faxPhoneNumber',
    headerName: 'Fax',
    width: 120,
    renderHeader: renderColumnHeader,
  },
  {
    field: '',
    type: 'actions',
    width: 60,
    renderCell: data => {
      const contextMenuOptions = [
        {
          name: 'Edit',
          onClick: () => onEditContact(data),
        },
        {
          name: 'Delete',
          color: palette.red,
          onClick: () => onDeteleContact(data),
        },
      ];
      return (
        <MoreActionsWrapper>
          <OptionsMenu
            options={contextMenuOptions}
            customButtonComponent={IconButton}
          >
            <MoreVertIcon />
          </OptionsMenu>
        </MoreActionsWrapper>
      );
    },
  },
];
