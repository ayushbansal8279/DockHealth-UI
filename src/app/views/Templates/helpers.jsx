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

export const getTemplateColumns = ({ onEditTemplate, onDeteleTemplate }) => [
  {
    field: 'name',
    headerName: 'Template Name',
    flex: 1,
    renderHeader: renderColumnHeader,
  },
  {
    field: 'type',
    headerName: 'Template Type',
    width: 150,
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
          name: 'Edit',
          onClick: () => onEditTemplate(data),
        },
        {
          name: 'Delete',
          color: palette.red,
          onClick: () => onDeteleTemplate(data),
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
