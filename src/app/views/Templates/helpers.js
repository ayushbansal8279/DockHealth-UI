/* eslint-disable import/prefer-default-export */
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
    field: '',
    type: 'actions',
    width: 60,
    renderCell: data => {
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
