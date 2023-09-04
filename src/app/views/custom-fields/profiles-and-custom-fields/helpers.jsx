import React from 'react';
import { MoreActionsWrapper } from 'views/person-details/PersonDetailsDrawer/styled';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import palette from 'styles/palette';

const renderColumnHeader = (props) => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <div className="MuiDataGrid-colCellTitle">
      <span>{headerName}</span>
    </div>
  );
};

export const getTemplateColumns = ({
  onEditProfile,
  onDeleteProfile,
  onConfigureCustomFields,
}) => [
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.25,
    renderHeader: renderColumnHeader,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    renderHeader: renderColumnHeader,
  },
  {
    field: '-',
    type: 'actions',
    headerName: 'Option',
    width: 60,
    renderHeader: renderColumnHeader,
    renderCell: (data) => {
      const contextMenuOptions = [
        {
          name: 'Configure Custom Fields',
          onClick: () => onConfigureCustomFields(data),
        },
      ];

      if (data.id !== 'users' && data.id !== 'patient') {
        contextMenuOptions.push(
          {
            name: 'Edit',
            onClick: () => onEditProfile(data),
          },
          {
            name: 'Delete',
            color: palette.red,
            onClick: () => onDeleteProfile(data),
          },
        );
      }

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
